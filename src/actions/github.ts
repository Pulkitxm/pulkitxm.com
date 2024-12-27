"use server";

import { Octokit } from "@octokit/rest";
import { GITHUB_START_CONTRIBUTION_YEAR } from "@/lib/config";
import { CONTRIBUTION_GRAPH_SECRET } from "@/lib/constants";
import { ContributionCalendar } from "@/types/github";

const octokit = new Octokit({
  auth: CONTRIBUTION_GRAPH_SECRET,
});

export async function fetchGitHubContributions(
  year?: number,
): Promise<ContributionCalendar | null> {
  try {
    const {
      data: { login },
    } = await octokit.rest.users.getAuthenticated();

    const currentYear = new Date().getFullYear();
    const selectedYear = year || currentYear;

    if (
      selectedYear < GITHUB_START_CONTRIBUTION_YEAR ||
      selectedYear > currentYear
    ) {
      throw new Error("Invalid year selected");
    }

    const from = new Date(selectedYear, 0, 1).toISOString();
    const to = new Date(selectedYear, 11, 31).toISOString();

    type QueryResponse = {
      user: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: number;
            weeks: {
              contributionDays: {
                contributionCount: number;
                date: string;
              }[];
            }[];
          };
        };
      };
    };

    const query = `
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

    const { user } = await octokit.graphql<QueryResponse>(query, {
      username: login,
      from,
      to,
    });

    return user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return null;
  }
}

export async function fetchTotalMergedPrs() {
  try {
    const {
      data: { login },
    } = await octokit.rest.users.getAuthenticated();

    type QueryResponse = {
      user: {
        pullRequests: {
          totalCount: number;
        };
      };
    };

    const query = `
      query($username: String!) {
        user(login: $username) {
          pullRequests(states: [CLOSED, MERGED]) {
            totalCount
          }
        }
      }
    `;

    const { user } = await octokit.graphql<QueryResponse>(query, {
      username: login,
    });

    return user.pullRequests.totalCount;
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return null;
  }
}
