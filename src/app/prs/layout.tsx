import assets from "@/assets";

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://devpulkit.in"),
  title: "Prs - Open Source Contributions",
  description: "Discover Pulkit's professional journey, roles, achievements, and the skills honed along the way.",
  openGraph: {
    title: "Prs - Pulkit",
    description:
      "Explore Pulkit's career highlights, including roles, projects, and key contributions in the tech industry.",
    url: "https://devpulkit.in/prs",
    type: "website",
    images: [
      {
        url: assets.banner.prs.src,
        width: 1200,
        height: 630,
        alt: "Pulkit's Open Source Prs"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Prs - Pulkit",
    description: "Check out Pulkit's open source contributions, professional journey, and achievements.",
    images: [assets.banner.prs.src]
  }
};

export default function PrsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
