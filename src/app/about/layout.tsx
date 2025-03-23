import assets from "@/assets";
import { createMetadata } from "@/lib/utils";

import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "About Pulkit",
  description: "About Pulkit - Web Developer, Tech Enthusiast, and Blogger",
  image: assets.banner.about.src,
  path: "about",
  keywords: ["about", "pulkit", "web developer", "blogger", "tech enthusiast"]
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
