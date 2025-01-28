import { NextResponse } from "next/server";

import { getLatestWorkflow } from "@/actions/gh";
import { formatTimeUpdatedAgo } from "@/lib/utils";
import { RES_TYPE } from "@/types/globals";

export async function GET(): Promise<NextResponse<RES_TYPE<string>>> {
  const res = await getLatestWorkflow();

  if (res.status === "error") {
    return NextResponse.json({ status: "error", error: "Failed to fetch data" }, { status: 500 });
  }
  const { timeStamp } = res.data;

  return NextResponse.json({ status: "success", data: formatTimeUpdatedAgo(timeStamp) });
}

export const dynamic = "force-dynamic";
