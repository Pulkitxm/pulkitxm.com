import assets from "@/assets";
import { createMetadata } from "@/lib/utils";
import { SessionProviderWrapper } from "@/providers/session";

import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Guestbook",
  description: "Leave a message for the world to see.",
  image: assets.banner.guestbook.src,
  path: "guestbook",
  keywords: ["guestbook", "message", "leave a message"]
});

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return <SessionProviderWrapper>{children}</SessionProviderWrapper>;
}
