import { NextRequest, NextResponse } from "next/server";

import { githubData } from "@/actions/gh";
import profile from "@/data/profile";
import { GITHUB_START_CONTRIBUTION_YEAR, TODAY } from "@/lib/config";
import { CONTRIBUTION } from "@/types/github";

export async function GET(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams;
  const filterNull = searchParams.get("y") === "";

  const allowedYears: number[] = [];

  for (let i = GITHUB_START_CONTRIBUTION_YEAR; i <= TODAY.getFullYear(); i++) {
    allowedYears.push(i);
  }

  const contributions: CONTRIBUTION[] = [];

  for (const year of allowedYears) {
    const githubContribution = await githubData({
      from: new Date(year, 0, 1).toISOString(),
      to: new Date(year, 11, 31).toISOString(),
      monthsType: "string",
      filterNull
    });

    if (githubContribution.status === "success") {
      contributions.push(githubContribution.data);
    }
  }

  return NextResponse.json({
    ...profile,
    contributions
  });
}

export const dynamic = "force-dynamic";
