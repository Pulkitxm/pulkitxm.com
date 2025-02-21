"use server";

import { Octokit } from "@octokit/rest";

import { getToday } from "@/lib/config";
import { CONTRIBUTION_GRAPH_SECRET, MONTHS, REPO_NAME } from "@/lib/constants";
import { CONTRIBUTION, CONTRIBUTION_QUERY_RESPONSE, PR } from "@/types/github";
import { RES_TYPE } from "@/types/globals";

const octokit = new Octokit({
  auth: CONTRIBUTION_GRAPH_SECRET
});

export async function getAuthenticatedOcto() {
  return new Octokit({
    auth: CONTRIBUTION_GRAPH_SECRET
  });
}

export async function isAuthenticated(_octokit: Octokit): Promise<RES_TYPE<boolean>> {
  try {
    const res = (await _octokit.auth()) as { type: "unauthenticated" | "token"; token?: string };
    return {
      status: "success",
      data: res.type == "token"
    };
  } catch (error) {
    console.log("Error checking authentication:", error);
    return {
      status: "error",
      error: "Failed to check authentication"
    };
  }
}

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

export async function getGithubUsername(): Promise<RES_TYPE<string>> {
  try {
    const res = await isAuthenticated(octokit);
    if (res.status === "error") {
      return res;
    }

    if (!res.data) {
      return {
        status: "error",
        error: "GitHub authentication failed"
      };
    }

    const {
      data: { login }
    } = await octokit.rest.users.getAuthenticated();

    return {
      status: "success",
      data: login
    };
  } catch (error) {
    console.error("Error fetching GitHub username:", error);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Failed to fetch GitHub username"
    };
  }
}

export async function getGithubData({
  from,
  to,
  monthsType = "number"
}: {
  from: string;
  to: string;
  monthsType?: "string" | "number";
}): Promise<RES_TYPE<CONTRIBUTION>> {
  try {
    const res = await isAuthenticated(octokit);
    if (res.status === "error") {
      return res;
    }

    if (!res.data) {
      return {
        status: "error",
        error: "GitHub authentication failed"
      };
    }

    const {
      data: { login }
    } = await octokit.rest.users.getAuthenticated();

    const year = new Date(from).getFullYear();

    const [contributionsData, resPrs] = await Promise.all([
      octokit.graphql<CONTRIBUTION_QUERY_RESPONSE>(CONTRIBUTION_QUERY, {
        username: login,
        from,
        to
      }),
      getPrsData({ from, to, select: true })
    ]);

    if (resPrs.status === "error") {
      return resPrs;
    }

    const prs = resPrs.data;
    const prsCount = prs.length;

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
        month: monthsType === "string" ? MONTHS[month.month - 1] : month.month,
        days: month.days
          .map((day) => ({
            ...day,
            date: new Date(day.date)
          }))
          .filter((day) => day.contributionCount > 0)
      }))
    };

    return {
      status: "success",
      data: {
        contributions,
        prs: prsCount,
        year
      }
    };
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Failed to fetch GitHub data"
    };
  }
}

export async function getPrsData(
  props: ({ from: string; to: string } | { all: true }) & { select?: boolean }
): Promise<RES_TYPE<PR[]>> {
  try {
    const res = await isAuthenticated(octokit);
    if (res.status === "error") {
      return res;
    }

    if (!res.data) {
      return {
        status: "error",
        error: "GitHub authentication failed"
      };
    }

    const {
      data: { login }
    } = await octokit.rest.users.getAuthenticated();

    let query = "";
    if ("all" in props) {
      query = `author:${login} is:pr`;
    } else {
      query = `author:${login} is:pr created:${props.from.split("T")[0]}..${props.to.split("T")[0]}`;
    }

    if (!props.select) {
      query += " is:closed is:merged is:open";
    }

    const { data: pullRequests } = await octokit.rest.search.issuesAndPullRequests({
      q: query,
      per_page: 10000,
      sort: "created",
      order: "desc"
    });

    return {
      status: "success",
      data: pullRequests.items.map((pr) => ({
        created_at: pr.created_at,
        labels: pr.labels.map((label) => label.name ?? ""),
        merged_at: pr.pull_request && pr.pull_request.merged_at ? new Date(pr.pull_request.merged_at) : new Date(),
        title: pr.title,
        url: pr.pull_request?.html_url ?? "",
        state: pr.state === "closed" && pr.pull_request?.merged_at !== null ? "merged" : "closed",
        repo: {
          url: pr.repository_url,
          name: pr.repository ? pr.repository.name : ""
        }
      }))
    };
  } catch (error) {
    console.error("Error fetching PRs:", error);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Failed to fetch PRs"
    };
  }
}

export async function getLatestWorkflow(): Promise<RES_TYPE<{ timeStamp: Date }>> {
  try {
    const res = await isAuthenticated(octokit);
    if (res.status === "error") {
      return res;
    }

    if (!res.data) {
      return {
        status: "error",
        error: "GitHub authentication failed"
      };
    }

    const {
      data: { login: username }
    } = await octokit.rest.users.getAuthenticated();

    const response = await octokit.actions.listWorkflowRunsForRepo({
      owner: username,
      repo: REPO_NAME
    });

    return {
      status: "success",
      data: { timeStamp: new Date(response.data.workflow_runs[0].updated_at) }
    };
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Unknown error occurred");
    return {
      status: "success",
      data: { timeStamp: getToday() }
    };
  }
}
