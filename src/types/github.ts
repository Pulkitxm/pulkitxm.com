import { z } from "zod";

export const CONTRIBUTION_SCHEMA = z.object({
  contributions: z.object({
    totalContributions: z.number(),
    weeks: z.array(
      z.object({
        contributionDays: z.array(
          z.object({
            contributionCount: z.number(),
            timeStamp: z.string().transform((val) => new Date(val)),
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
