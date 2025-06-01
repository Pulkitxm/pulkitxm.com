import { NextResponse } from "next/server";

import { generateRssFeed } from "@/data/feed";

export async function GET() {
  const feed = generateRssFeed();
  return new NextResponse(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600"
    }
  });
}
