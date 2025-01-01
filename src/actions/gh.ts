"use server";

import { Octokit } from "@octokit/rest";

import { CONTRIBUTION_GRAPH_SECRET, months } from "@/lib/constants";
import { CONTRIBUTION, CONTRIBUTION_QUERY_RESPONSE, PRS_QUERY_RESPONSE } from "@/types/github";
import { RES_TYPE } from "@/types/globals";

const octokit = new Octokit({
  auth: CONTRIBUTION_GRAPH_SECRET
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

export async function githubData({
  from,
  to,
  monthsType = "number",
  filterNull = false
}: {
  from: string;
  to: string;
  monthsType?: "string" | "number";
  filterNull?: boolean;
}): Promise<RES_TYPE<CONTRIBUTION>> {
  try {
    const {
      data: { login }
    } = await octokit.rest.users.getAuthenticated();

    const year = new Date(from).getFullYear(); // Derive the year from 'from'
    const [contributionsData, prsData] = await Promise.all([
      octokit.graphql<CONTRIBUTION_QUERY_RESPONSE>(CONTRIBUTION_QUERY, {
        username: login,
        from,
        to
      }),
      octokit.graphql<PRS_QUERY_RESPONSE>(PRS_QUERY, { username: login })
    ]);

    const contributionsByMonth = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      days: [] as { date: string; contributionCount: number }[]
    }));

    contributionsData.user.contributionsCollection.contributionCalendar.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        const date = new Date(day.date);
        const month = date.getMonth();
        if (date.getFullYear() === year) {
          contributionsByMonth[month].days.push({
            date: day.date,
            contributionCount: day.contributionCount
          });
        }
      });
    });

    const contributions: CONTRIBUTION["contributions"] = {
      totalContributions: contributionsData.user.contributionsCollection.contributionCalendar.totalContributions,
      months: contributionsByMonth.map((month) => ({
        ...month,
        month: monthsType === "string" ? months[month.month - 1] : month.month,
        days: month.days
          .map((day) => ({
            ...day,
            date: new Date(day.date)
          }))
          .filter((day) => day.contributionCount > 0)
      }))
    };

    if (filterNull) {
      contributions.months = contributions.months.filter((month) => month.days.length > 0);
    }

    return {
      status: "success",
      data: {
        contributions,
        prs: prsData.user.pullRequests.totalCount,
        year
      }
    };
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return { status: "error", error: "Failed to fetch GitHub data" };
  }
}
