import assets from "@/assets";
import { createMetadata } from "@/lib/utils";

import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Blogs",
  description:
    "Explore Pulkit's blogs on web development, technology, and more. Dive into insightful articles and tutorials.",
  image: assets.banner.blogs.src,
  path: "blogs",
  keywords: ["Pulkit", "blogs", "web development", "technology", "tutorials", "articles"]
});

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
