import axios from "axios";
import CryptoJS from "crypto-js";

import { CONTRIBUTION, CONTRIBUTION_SCHEMA, FOLLOWERS, validateFollowers } from "@/types/github";
import { RES_TYPE } from "@/types/globals";

import { ENCRYPTION_KEY, NEXT_PUBLIC_API_URL } from "./constants";

const CACHE_DURATION = 3600 * 1000;

interface CacheData<T> {
  data: T;
  timestamp: number;
}

function encodeData<T>(data: T): string {
  const jsonStr = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonStr, ENCRYPTION_KEY).toString();
}

function decodeData<T>(encoded: string): T | null {
  try {
    const bytes = CryptoJS.AES.decrypt(encoded, ENCRYPTION_KEY);
    const jsonStr = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const encoded = localStorage.getItem(key);
    if (!encoded) return null;

    const decoded = decodeData<CacheData<T>>(encoded);
    if (!decoded) return null;

    const { data, timestamp } = decoded;
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }

    if (data && typeof data === "object" && "contributions" in data) {
      const contributionData = data as unknown as CONTRIBUTION;
      if (contributionData.contributions?.months) {
        contributionData.contributions.months = contributionData.contributions.months.map((month) => ({
          ...month,
          days: month.days.map((day) => ({
            ...day,
            date: new Date(day.date)
          }))
        }));
      }
    }

    return data;
  } catch {
    return null;
  }
}

export function setCachedData<T>(key: string, data: T): void {
  try {
    let dataToCache = data;
    if (data && typeof data === "object") {
      dataToCache = JSON.parse(
        JSON.stringify(data, (_, value) => {
          if (value instanceof Date) {
            return value.toISOString();
          }
          return value;
        })
      );
    }

    const dataToStore: CacheData<T> = {
      data: dataToCache,
      timestamp: Date.now()
    };

    const encoded = encodeData(dataToStore);
    localStorage.setItem(key, encoded);
  } catch (e) {
    console.error(e);
  }
}

export async function getGithubContributionData(year?: number) {
  const cacheKey = `github-contributions-${year ?? "current"}`;

  const cached = await getCachedData<CONTRIBUTION>(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`/api/gh${year ? `?y=${year}` : ""}`);
    const validatedRes = CONTRIBUTION_SCHEMA.safeParse(response.data);

    if (!validatedRes.success) {
      return null;
    }

    setCachedData(cacheKey, validatedRes.data);
    return validatedRes.data;
  } catch (e) {
    if (e) return null;
  }
}

export async function getGithubFollowers(): Promise<RES_TYPE<FOLLOWERS>> {
  const cacheKey = "github-followers";

  const cached = await getCachedData<RES_TYPE<FOLLOWERS>>(cacheKey);
  if (cached) return cached;

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

    const result = {
      status: "success" as const,
      data: validatedRes.data
    };

    setCachedData(cacheKey, result);
    return result;
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
