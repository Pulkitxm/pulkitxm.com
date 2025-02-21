import { z } from "zod";

export const CONTRIBUTION_SCHEMA = z.object({
  contributions: z.object({
    totalContributions: z.number(),
    months: z.array(
      z.object({
        month: z.union([z.string(), z.number().min(1).max(12)]),
        days: z.array(
          z.object({
            date: z.string().transform((v) => new Date(v)),
            contributionCount: z.number()
          })
        )
      })
    )
  }),
  prs: z.number(),
  year: z.number()
});

export type CONTRIBUTION = z.infer<typeof CONTRIBUTION_SCHEMA>;

export type CONTRIBUTION_QUERY_RESPONSE = {
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

export type PRS_QUERY_RESPONSE = {
  user: {
    pullRequests: {
      totalCount: number;
    };
  };
};

export const PR_STATE = z.enum(["closed", "merged"]);
export const PR_SCHEMA = z.object({
  created_at: z.string(),
  labels: z.array(z.string()),
  merged_at: z.string().transform((v) => new Date(v)),
  title: z.string(),
  url: z.string(),
  state: PR_STATE,
  repo: z.object({
    name: z.string(),
    url: z.string()
  })
});
export const PRS_SCHEMA = z.array(PR_SCHEMA);
export type PR = z.infer<typeof PR_SCHEMA>;
export type PR_STATE_TYPE = z.infer<typeof PR_STATE>;

export const validateFollowers = z.array(
  z.object({
    picUrl: z.string(),
    username: z.string()
  })
);
export type FOLLOWERS = z.infer<typeof validateFollowers>;
