import axios from "axios";

import { CONTRIBUTION_SCHEMA, FOLLOWERS, validateFollowers } from "@/types/github";
import { RES_TYPE } from "@/types/globals";

import { NEXT_PUBLIC_API_URL } from "./constants";

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

export async function getGithubFollowers(): Promise<RES_TYPE<FOLLOWERS>> {
  try {
    const { data: resData } = await axios.get(`${NEXT_PUBLIC_API_URL}/api/gh/followers`);

    if (resData.status == "error") {
      return resData;
    }

    const validatedRes = validateFollowers.safeParse(resData.data);
    if (!validatedRes.success) {
      return {
        status: "error",
        error: "Invalid data"
      };
    }
    return {
      status: "success",
      data: validatedRes.data
    };
  } catch (e) {
    if (e)
      return {
        status: "error",
        error: "Invalid data"
      };
    else
      return {
        status: "error",
        error: "Unknown error"
      };
  }
}
