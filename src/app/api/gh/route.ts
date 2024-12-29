import {
  fetchGitHubContributions,
  fetchTotalMergedPrs,
} from "@/actions/github";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get("year");
    let selectedYear: number;

    if (year) {
      if (isNaN(Number(year))) {
        return NextResponse.json({
          error: "Invalid year",
        });
      }
      selectedYear = Number(year);
    } else {
      selectedYear = new Date().getFullYear();
    }

    const [contriData, pr] = await Promise.all([
      fetchGitHubContributions(selectedYear),
      fetchTotalMergedPrs(),
    ]);
    return NextResponse.json({
      contributions: contriData,
      prs: pr,
      year: selectedYear,
    });
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub contributions" },
      { status: 500 },
    );
  }
}
