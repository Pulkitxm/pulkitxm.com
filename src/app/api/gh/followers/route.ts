import { NextResponse } from "next/server";

import { CONTRIBUTION_GRAPH_SECRET } from "@/lib/constants";
import { RES_TYPE } from "@/types/globals";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(): Promise<NextResponse<RES_TYPE<{ picUrl: string; username: string }[]>>> {
  try {
    const followers: { username: string; picUrl: string }[] = [];
    let page = 1;
    const perPage = 100;
    let hasMorePages = true;

    do {
      const response = await fetch(
        `https://api.github.com/user/followers?per_page=${perPage}&page=${page}&timestamp=${Date.now()}`,
        {
          headers: {
            Authorization: `Bearer ${CONTRIBUTION_GRAPH_SECRET}`,
            Accept: "application/vnd.github.v3+json",
            "Cache-Control": "no-cache, no-store, must-revalidate, private",
            Pragma: "no-cache",
            Expires: "0"
          },
          cache: "no-store"
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API responded with status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.length) {
        hasMorePages = false;
        break;
      }

      followers.push(
        ...data.map((follower: { avatar_url: string; login: string }) => ({
          picUrl: follower.avatar_url,
          username: follower.login
        }))
      );

      if (data.length < perPage) {
        hasMorePages = false;
        break;
      }

      page++;
    } while (hasMorePages);

    if (!followers.length) {
      return NextResponse.json(
        { status: "error", error: "No followers found or unable to fetch followers" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: followers.sort((a, b) => a.username.localeCompare(b.username))
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: "error", error: "Unable to fetch followers" }, { status: 500 });
  }
}
