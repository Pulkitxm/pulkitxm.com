import { NextResponse } from "next/server";

import { getGithubData } from "@/actions/gh";
import profile from "@/data/profile";
import { getToday, GITHUB_START_CONTRIBUTION_YEAR } from "@/lib/config";
import { CONTRIBUTION } from "@/types/github";

export async function GET() {
  const allowedYears: number[] = [];

  for (let i = GITHUB_START_CONTRIBUTION_YEAR; i <= getToday().getFullYear(); i++) {
    allowedYears.push(i);
  }

  const contributions: CONTRIBUTION[] = [];

  for (const year of allowedYears) {
    const githubContribution = await getGithubData({
      from: new Date(year, 0, 1).toISOString(),
      to: new Date(year, 11, 31).toISOString(),
      monthsType: "string"
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
