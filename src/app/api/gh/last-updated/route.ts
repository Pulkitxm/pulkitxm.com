import { NextResponse } from "next/server";

import { getLatestWorkflow } from "@/actions/gh";
import { formatTimeUpdatedAgo } from "@/lib/utils";
import { RES_TYPE } from "@/types/globals";

export async function GET(): Promise<NextResponse<RES_TYPE<string>>> {
  const { timeStamp } = await getLatestWorkflow();
  return NextResponse.json({ status: "success", data: formatTimeUpdatedAgo(timeStamp) });
}

export const dynamic = "force-dynamic";
