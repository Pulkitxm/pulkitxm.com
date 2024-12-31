import { NextResponse } from "next/server";

import { githubData } from "@/actions/gh";
import profile from "@/data/profile";
import { GITHUB_START_CONTRIBUTION_YEAR, TODAY } from "@/lib/config";
import { CONTRIBUTION } from "@/types/github";

export async function GET() {
  const allowedYears: number[] = [];

  for (let i = GITHUB_START_CONTRIBUTION_YEAR; i <= TODAY.getFullYear(); i++) {
    allowedYears.push(i);
  }

  const contributions: {
    year: number;
    data: CONTRIBUTION;
  }[] = [];

  for (const year of allowedYears) {
    const githubContribution = await githubData({
      from: new Date(year, 0, 1).toISOString(),
      to: new Date(year, 11, 31).toISOString()
    });

    if (githubContribution.status === "success") {
      contributions.push({
        year,
        data: githubContribution.data
      });
    }
  }

  return NextResponse.json({
    ...profile,
    contributions
  });
}

export const dynamic = "force-dynamic";
