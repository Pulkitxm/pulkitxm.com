import { NextResponse } from "next/server";

import { getAuthenticatedOcto, isAuthenticated } from "@/actions/gh";
import { RES_TYPE } from "@/types/globals";

export async function GET(): Promise<
  NextResponse<
    RES_TYPE<
      {
        picUrl: string;
        username: string;
      }[]
    >
  >
> {
  try {
    const octokit = await getAuthenticatedOcto();

    const res = await isAuthenticated(octokit);
    if (res.status === "error") {
      return NextResponse.json({ status: "error", error: "GitHub authentication failed" }, { status: 401 });
    }

    if (!res.data) {
      return NextResponse.json({ status: "error", error: "GitHub authentication failed" }, { status: 401 });
    }

    const followers: { username: string; picUrl: string }[] = [];
    let page = 1;
    const perPage = 100;

    let hasMorePages = true;
    do {
      const response = await octokit.rest.users.listFollowersForAuthenticatedUser({
        per_page: perPage,
        page,
        headers: {
          "If-None-Match": "",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0"
        }
      });

      if (!response.data?.length) {
        hasMorePages = false;
        break;
      }

      followers.push(
        ...response.data.map((follower) => ({
          picUrl: `${follower.avatar_url}`,
          username: follower.login
        }))
      );

      if (response.data.length < perPage) {
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

export const dynamic = "force-dynamic";
