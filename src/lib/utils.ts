import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { NEXT_PUBLIC_API_URL } from "./constants";

import type { Metadata } from "next";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short"
  });
}

export function formatTimeUpdatedAgo(dateString: Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const units = [
    { label: "second", value: 1000 },
    { label: "minute", value: 1000 * 60 },
    { label: "hour", value: 1000 * 60 * 60 },
    { label: "day", value: 1000 * 60 * 60 * 24 },
    { label: "month", value: 1000 * 60 * 60 * 24 * 30 }
  ];

  let i = 0;
  while (i < units.length && diff >= units[i].value) {
    i++;
  }

  const value = Math.floor(diff / units[i - 1].value);
  const label = units[i - 1].label;

  return `${value} ${label}${value > 1 ? "s" : ""} ago`;
}

export function getSlug(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s(),.]+/g, "-")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function compareTimes(a: Date, b: Date): boolean {
  return a.getTime() === b.getTime();
}

type MetadataParams = {
  title: string;
  description: string;
  path: string;
  image: string;
  keywords?: string[];
};

export const createMetadata = ({ title, description, path, image, keywords = [] }: MetadataParams): Metadata => {
  const url = NEXT_PUBLIC_API_URL + "/" + path;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Pulkit's Portfolio",
      locale: "en_US",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} - Pulkit's Portfolio`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@pulkitxm",
      images: [image]
    }
  };
};
