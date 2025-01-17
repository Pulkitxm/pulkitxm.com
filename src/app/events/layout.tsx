import assets from "@/data/assets";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events - Pulkit",
  description: "Explore Pulkit's events and moments that shaped his journey.",
  openGraph: {
    title: "Events - Pulkit",
    description: "Take a look at Pulkit's events and moments that shaped his journey.",
    url: "https://devpulkit.in/events",
    type: "website",
    images: [
      {
        url: assets.banner.events,
        width: 1200,
        height: 630,
        alt: "Events - Pulkit"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Events - Pulkit",
    description: "Take a look at Pulkit's previous portfolio events and creative projects.",
    images: [assets.banner.events]
  }
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
