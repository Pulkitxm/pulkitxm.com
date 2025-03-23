import assets from "@/assets";
import { createMetadata } from "@/lib/utils";

import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Github Followers",
  description: "Explore the Github followers of my projects.",
  image: assets.banner.ghFollowers.src,
  path: "gh-followers",
  keywords: ["github", "followers", "projects", "repositories"]
});

export default function GithubFollowersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
