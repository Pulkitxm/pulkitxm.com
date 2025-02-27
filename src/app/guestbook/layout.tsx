import assets from "@/assets";

import { SessionProviderWrapper } from "./SessionProvider";

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://pulkitxm.com"),
  title: "GuestBook - Pulkit",
  description: "Discover Pulkit's professional journey, roles, achievements, and the skills honed along the way.",
  openGraph: {
    title: "GuestBook - Pulkit",
    description:
      "Explore Pulkit's career highlights, including roles, projects, and key contributions in the tech industry.",
    url: "https://pulkitxm.com/guestbook",
    type: "website",
    images: [
      {
        url: assets.banner.guestbook.src,
        width: 1200,
        height: 630,
        alt: "Pulkit's GuestBook"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Guestbook - Pulkit",
    description: "Check out Pulkit's professional journey and career milestones in the tech industry.",
    images: [assets.banner.guestbook.src]
  }
};

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return <SessionProviderWrapper>{children}</SessionProviderWrapper>;
}
