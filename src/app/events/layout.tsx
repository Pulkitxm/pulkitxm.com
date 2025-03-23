import assets from "@/assets";
import { createMetadata } from "@/lib/utils";

import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Events",
  description: "Explore the events I have attended and organized.",
  image: assets.banner.events.src,
  path: "events",
  keywords: ["events", "talks", "workshops", "conferences", "meetups"]
});

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
