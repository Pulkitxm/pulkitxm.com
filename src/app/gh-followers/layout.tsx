import assets from "@/assets";

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://pulkitxm.com"),
  title: "Github Followers - Pulkit",
  description: "Explore Pulkit's GitHub followers and their contributions to the developer community.",
  openGraph: {
    title: "Github Followers - Pulkit",
    description: "Take a look at Pulkit's github followers and their contributions to the developer community.",
    url: "https://pulkitxm.com/gh-followers",
    type: "website",
    images: [
      {
        url: assets.banner.ghFollowers.src,
        width: 1200,
        height: 630,
        alt: "Github Followers Showcase"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Github Followers - Pulkit",
    description: "Take a look at Pulkit's github followers and their contributions to the developer community.",
    images: [assets.banner.ghFollowers.src]
  }
};

export default function GithubFollowersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
