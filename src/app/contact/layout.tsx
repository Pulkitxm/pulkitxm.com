import assets from "@/data/assets";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Pulkit",
  description:
    "Get in touch with Pulkit, a passionate developer and tech enthusiast.",
  openGraph: {
    title: "Contact - Pulkit",
    description:
      "Reach out to Pulkit to discuss projects, ideas, or opportunities.",
    url: "https://devpulkit.in/contact",
    type: "website",
    images: [
      {
        url: assets.banner.contact,
        width: 1200,
        height: 630,
        alt: "Contact Pulkit - Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact - Pulkit",
    description:
      "Reach out to Pulkit to discuss projects, ideas, or opportunities.",
    images: [assets.banner.contact],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
