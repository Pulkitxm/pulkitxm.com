import { NextResponse } from "next/server";

import profile from "@/data/profile";

export async function GET() {
  return NextResponse.json({
    events: profile.events
  });
}
