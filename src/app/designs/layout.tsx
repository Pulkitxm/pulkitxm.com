import assets from "@/assets";

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://devpulkit.in"),
  title: "Designs - Pulkit",
  description: "Explore Pulkit's portfolio designs showcasing creativity and development skills.",
  openGraph: {
    title: "Designs - Pulkit",
    description: "Take a look at Pulkit's previous portfolio designs and creative projects.",
    url: "https://devpulkit.in/designs",
    type: "website",
    images: [
      {
        url: assets.banner.designs.src,
        width: 1200,
        height: 630,
        alt: "Designs by Pulkit - Portfolio Showcase"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Designs - Pulkit",
    description: "Take a look at Pulkit's previous portfolio designs and creative projects.",
    images: [assets.banner.designs.src]
  }
};

export default function DesignsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
