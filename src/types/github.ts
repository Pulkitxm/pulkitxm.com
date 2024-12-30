import { z } from "zod";

export const CONTRIBUTION_SCHEMA = z.object({
  contributions: z.object({
    totalContributions: z.number(),
    months: z.array(
      z.object({
        month: z.number().min(1).max(12),
        days: z.array(
          z.object({
            date: z.string().transform((v) => new Date(v)),
            contributionCount: z.number(),
          }),
        ),
      }),
    ),
  }),
  prs: z.number(),
  year: z.number(),
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
