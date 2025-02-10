import { NextRequest, NextResponse } from "next/server";

import { getGithubData } from "@/actions/gh";
import { getToday, GITHUB_START_CONTRIBUTION_YEAR } from "@/lib/config";
import { CONTRIBUTION } from "@/types/github";

export async function GET(request: NextRequest): Promise<NextResponse<CONTRIBUTION | { error: string }>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get("y");

    let selectedYear: number;
    const currentYear = getToday().getFullYear();

    if (year) {
      if (isNaN(Number(year))) {
        return NextResponse.json({ error: "Invalid year" }, { status: 400 });
      }
      selectedYear = Number(year);
    } else {
      selectedYear = getToday().getFullYear();
    }

    if (selectedYear < GITHUB_START_CONTRIBUTION_YEAR || selectedYear > currentYear) {
      return NextResponse.json(
        {
          error: `Year must be between ${GITHUB_START_CONTRIBUTION_YEAR} and ${currentYear}`
        },
        { status: 400 }
      );
    }

    let toDate = new Date(selectedYear, 11, 31);
    if (selectedYear === currentYear) {
      toDate = new Date(getToday().getFullYear(), getToday().getMonth(), getToday().getDate());
    }
    const from = new Date(selectedYear, 0, 1).toISOString();
    const to = toDate.toISOString();

    const res = await getGithubData({ from, to });

    if (res.status === "error") {
      return NextResponse.json({ error: res.error }, { status: 500 });
    } else {
      return NextResponse.json(res.data);
    }
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
