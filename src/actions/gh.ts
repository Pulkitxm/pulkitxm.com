"use server";

import { Octokit } from "@octokit/rest";

import { CONTRIBUTION_GRAPH_SECRET } from "@/lib/constants";
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

export async function githubData({ from, to }: { from: string; to: string }): Promise<RES_TYPE<CONTRIBUTION>> {
  try {
    const {
      data: { login }
    } = await octokit.rest.users.getAuthenticated();

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
        contributionsByMonth[month].days.push({
          date: day.date,
          contributionCount: day.contributionCount
        });
      });
    });

    return {
      status: "success",
      data: {
        contributions: {
          totalContributions: contributionsData.user.contributionsCollection.contributionCalendar.totalContributions,
          months: contributionsByMonth.map((month) => ({
            ...month,
            days: month.days.map((day) => ({
              ...day,
              date: new Date(day.date)
            }))
          }))
        },
        prs: prsData.user.pullRequests.totalCount,
        year: new Date(from).getFullYear()
      }
    };
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return { status: "error", error: "Failed to fetch GitHub data" };
  }
}
