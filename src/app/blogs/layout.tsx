import assets from "@/data/assets";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Pulkit",
  description:
    "Explore Pulkit's blog for insights on technology, development, and open-source projects.",
  openGraph: {
    title: "Blog - Pulkit",
    description:
      "Stay updated with Pulkit's thoughts and experiences in technology, development, and more.",
    url: "https://devpulkit.in/blog",
    type: "website",
    images: [
      {
        url: assets.banner.blogs,
        width: 1200,
        height: 630,
        alt: "Pulkit's Blog - Insights on Technology and Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Pulkit",
    description:
      "Discover Pulkit's latest blog posts on technology, software development, and open-source contributions.",
    images: [assets.banner.blogs],
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
