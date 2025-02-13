import { NextResponse } from "next/server";

import { getLatestFollowers } from "@/actions/gh";
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
  const res = await getLatestFollowers();

  if (res.status === "error") {
    return NextResponse.json({ status: "error", error: "Failed to fetch data" }, { status: 500 });
  }
  return NextResponse.json({ status: "success", data: res.data });
}

export const dynamic = "force-dynamic";
