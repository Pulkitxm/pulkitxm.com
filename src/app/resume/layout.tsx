import assets from "@/data/assets";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume - Pulkit",
  description:
    "Showcasing Pulkit's professional journey, skills, and achievements.",
  openGraph: {
    title: "Resume - Pulkit",
    description:
      "Delve into Pulkit's career highlights, key projects, and impactful contributions.",
    url: "https://devpulkit.in/resume",
    type: "website",
    images: [
      {
        url: assets.banner.resumePage,
        width: 1200,
        height: 630,
        alt: "Pulkit's Resume",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume - Pulkit",
    description: "Explore Pulkit's professional milestones and expertise.",
    images: [assets.banner.resumePage],
  },
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
