import axios from "axios";

import { CONTRIBUTION_SCHEMA } from "@/types/github";

export async function getGithubContributionData(year?: number) {
  try {
    const response = await axios.get(`/api/gh${year ? `?y=${year}` : ""}`);
    const validatedRes = CONTRIBUTION_SCHEMA.safeParse(response.data);

    if (!validatedRes.success) {
      return null;
    }

    return validatedRes.data;
  } catch (e) {
    if (e) return null;
  }
}
