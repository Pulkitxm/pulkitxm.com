"use server";

import { Octokit } from "@octokit/rest";
import { unstable_cache } from "next/cache";

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

const isAuthenticatedImpl = async (_octokit: Octokit): Promise<RES_TYPE<boolean>> => {
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
};

export const isAuthenticated = unstable_cache(isAuthenticatedImpl, ["github-auth"], { revalidate: 3600 });

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

const getGithubUsernameImpl = async (): Promise<RES_TYPE<string>> => {
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
};

export const getGithubUsername = unstable_cache(getGithubUsernameImpl, ["github-username"], { revalidate: false });

type GithubDataParams = {
  from: string;
  to: string;
  monthsType?: "string" | "number";
};

const getGithubDataImpl = async ({
  from,
  to,
  monthsType = "number"
}: GithubDataParams): Promise<RES_TYPE<CONTRIBUTION>> => {
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
      getPrsData({
        all: true,
        select: true
      })
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
};

export const getGithubData = unstable_cache(getGithubDataImpl, ["github-data"], { revalidate: false });

type PrsDataParams = ({ from: string; to: string } | { all: true }) & { select?: boolean };

const getPrsDataImpl = async (props: PrsDataParams): Promise<RES_TYPE<PR[]>> => {
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
        merged_at: pr.pull_request && pr.pull_request.merged_at ? new Date(pr.pull_request.merged_at) : getToday(),
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
};

export const getPrsData = unstable_cache(getPrsDataImpl, ["github-prs"], { revalidate: 3600 });

const getLatestWorkflowImpl = async (): Promise<RES_TYPE<{ timeStamp: Date }>> => {
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
};

export const getLatestWorkflow = unstable_cache(getLatestWorkflowImpl, ["github-workflow"], { revalidate: 3600 });

const getFileLastModifiedImpl = async (path: string): Promise<RES_TYPE<Date>> => {
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

    const response = await octokit.repos.getContent({
      owner: username,
      repo: REPO_NAME,
      path,
      ref: "main"
    });

    if (Array.isArray(response.data)) {
      return {
        status: "error",
        error: "Path is a directory"
      };
    }

    const commitResponse = await octokit.repos.listCommits({
      owner: username,
      repo: REPO_NAME,
      path,
      per_page: 1
    });

    return {
      status: "success",
      data: new Date(commitResponse.data[0].commit.author?.date || getToday())
    };
  } catch (error) {
    console.error("Error fetching file last modified date:", error);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Failed to fetch file last modified date"
    };
  }
};

export const getFileLastModified = unstable_cache(getFileLastModifiedImpl, ["github-file-modified"], {
  revalidate: false
});
