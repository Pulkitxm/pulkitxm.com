import assets from "@/data/assets";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(assets);
}
