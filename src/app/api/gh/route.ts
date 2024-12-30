import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { GITHUB_START_CONTRIBUTION_YEAR } from "@/lib/config";
import { CONTRIBUTION_GRAPH_SECRET } from "@/lib/constants";
import {
  CONTRIBUTION,
  CONTRIBUTION_QUERY_RESPONSE,
  PRS_QUERY_RESPONSE,
} from "@/types/github";

const octokit = new Octokit({
  auth: CONTRIBUTION_GRAPH_SECRET,
});

const CONTRIBUTION_QUERY = `
query($username: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $username) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}
`;

const PRS_QUERY = `
query($username: String!) {
  user(login: $username) {
    pullRequests(states: [CLOSED, MERGED]) {
      totalCount
    }
  }
}
`;

export async function GET(
  request: NextRequest,
): Promise<NextResponse<CONTRIBUTION | { error: string }>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get("y");

    let selectedYear: number;
    const currentYear = new Date().getFullYear();

    if (year) {
      if (isNaN(Number(year))) {
        return NextResponse.json({ error: "Invalid year" }, { status: 400 });
      }
      selectedYear = Number(year);
    } else {
      selectedYear = new Date().getFullYear();
    }

    if (
      selectedYear < GITHUB_START_CONTRIBUTION_YEAR ||
      selectedYear > currentYear
    ) {
      return NextResponse.json(
        {
          error: `Year must be between ${GITHUB_START_CONTRIBUTION_YEAR} and ${currentYear}`,
        },
        { status: 400 },
      );
    }

    const {
      data: { login },
    } = await octokit.rest.users.getAuthenticated();

    const today = new Date();
    let toDate = new Date(selectedYear, 11, 31);
    if (selectedYear === currentYear) {
      toDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }
    const from = new Date(selectedYear, 0, 1).toISOString();
    const to = toDate.toISOString();

    const [contributionsData, prsData] = await Promise.all([
      octokit.graphql<CONTRIBUTION_QUERY_RESPONSE>(CONTRIBUTION_QUERY, {
        username: login,
        from,
        to,
      }),
      octokit.graphql<PRS_QUERY_RESPONSE>(PRS_QUERY, { username: login }),
    ]);

    const contributionsByMonth = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      days: [] as { date: string; contributionCount: number }[],
    }));

    contributionsData.user.contributionsCollection.contributionCalendar.weeks.forEach(
      (week) => {
        week.contributionDays.forEach((day) => {
          const date = new Date(day.date);
          const month = date.getMonth();
          contributionsByMonth[month].days.push({
            date: day.date,
            contributionCount: day.contributionCount,
          });
        });
      },
    );

    return NextResponse.json({
      contributions: {
        totalContributions:
          contributionsData.user.contributionsCollection.contributionCalendar
            .totalContributions,
        months: contributionsByMonth.map((month) => ({
          ...month,
          days: month.days.map((day) => ({
            ...day,
            date: new Date(day.date),
          })),
        })),
      },
      prs: prsData.user.pullRequests.totalCount,
      year: selectedYear,
    });
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
