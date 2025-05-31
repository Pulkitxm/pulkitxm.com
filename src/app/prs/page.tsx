import assets from "@/assets";
import { createMetadata } from "@/lib/utils";

import Prs from "./PRs";

import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Pull Requests",
  description: "Explore the pull requests made by me.",
  image: assets.banner.prs.src,
  path: "prs",
  keywords: ["pull requests", "prs", "github", "explore"]
});

export default function PrsPage() {
  return <Prs />;
}
