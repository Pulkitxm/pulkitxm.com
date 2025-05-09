import { NextRequest, NextResponse } from "next/server";

import { getPrsData } from "@/actions/gh";
import { getToday, GITHUB_START_CONTRIBUTION_YEAR } from "@/lib/config";
import { PR } from "@/types/github";
import { RES_TYPE } from "@/types/globals";

export async function GET(request: NextRequest): Promise<NextResponse<PR[] | { error: string }>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get("y");
    const select = searchParams.get("select") === "all";

    let selectedYear: number | null = null;
    const currentYear = getToday().getFullYear();

    if (year) {
      if (isNaN(Number(year))) {
        return NextResponse.json({ error: "Invalid year" }, { status: 400 });
      }
      selectedYear = Number(year);
    }

    if (selectedYear && (selectedYear < GITHUB_START_CONTRIBUTION_YEAR || selectedYear > currentYear)) {
      return NextResponse.json(
        {
          error: `Year must be between ${GITHUB_START_CONTRIBUTION_YEAR} and ${currentYear}`
        },
        { status: 400 }
      );
    }

    let res: RES_TYPE<PR[]>;

    if (selectedYear) {
      let toDate = new Date(selectedYear, 11, 31);
      if (selectedYear === currentYear) {
        toDate = new Date(getToday().getFullYear(), getToday().getMonth(), getToday().getDate());
      }
      const from = new Date(selectedYear, 0, 1).toISOString();
      const to = toDate.toISOString();
      res = await getPrsData({ from, to, select });
    } else {
      res = await getPrsData({ all: true, select });
    }

    if (res.status === "error") {
      return NextResponse.json({ error: res.error }, { status: 500 });
    } else {
      return NextResponse.json(res.data);
    }
  } catch (error) {
    console.error("Error fetching PRs:", error);
    return NextResponse.json({ error: "Failed to fetch PRs" }, { status: 500 });
  }
}
