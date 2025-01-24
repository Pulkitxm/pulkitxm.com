import { NextResponse } from "next/server";

import assets from "@/assets";

export async function GET() {
  return NextResponse.json(assets);
}
