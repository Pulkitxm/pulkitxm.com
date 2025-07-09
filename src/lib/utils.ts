import { clsx, type ClassValue } from "clsx";
import { StaticImageData } from "next/image";
import { twMerge } from "tailwind-merge";
import { parseStringPromise } from "xml2js";

import assets from "@/assets";

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

export function formatDuration(duration: number): string {
  const msPerDay = 1000 * 60 * 60 * 24;
  const msPerMonth = msPerDay * 30.44;
  const msPerYear = msPerDay * 365.25;

  if (duration >= msPerYear) {
    const years = Math.floor(duration / msPerYear);
    const remainingMs = duration % msPerYear;
    const months = Math.floor(remainingMs / msPerMonth);

    if (months > 0) {
      return `${years} year${years > 1 ? "s" : ""} ${months} month${months > 1 ? "s" : ""}`;
    } else {
      return `${years} year${years > 1 ? "s" : ""}`;
    }
  }

  if (duration >= msPerMonth) {
    const months = Math.floor(duration / msPerMonth);
    return `${months} month${months > 1 ? "s" : ""}`;
  }

  if (duration >= msPerDay) {
    const days = Math.floor(duration / msPerDay);
    return `${days} day${days > 1 ? "s" : ""}`;
  }

  return "less than a day";
}

export function formatTimeUpdatedAgo(dateString: Date): string {
  const date = new Date(dateString);
  const diff = new Date().getTime() - date.getTime();
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

export async function getSitemapUrls(): Promise<string[]> {
  try {
    const sitemapUrl = `${process.env.NEXT_PUBLIC_API_URL}/sitemap.xml`;

    const response = await fetch(sitemapUrl, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      console.error(`Failed to fetch sitemap: ${response.status}`);
      return ["/"];
    }

    const sitemapContent = await response.text();
    const result = await parseStringPromise(sitemapContent);

    if (result.urlset && result.urlset.url) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return result.urlset.url.map((urlObj: any) => {
        const fullUrl = urlObj.loc[0];

        try {
          const url = new URL(fullUrl);
          return `${process.env.NEXT_PUBLIC_API_URL}${url.pathname}`;
        } catch (e) {
          if (e) return `${process.env.NEXT_PUBLIC_API_URL}${fullUrl}`;
        }
      });
    }

    return ["/"];
  } catch (error) {
    console.error("Error fetching or parsing sitemap:", error);
    return ["/"];
  }
}

export const isSameDomain = (url: string): boolean => {
  try {
    if (url.startsWith("/")) return true;

    const urlObj = new URL(url);
    const currentHostname = window.location.hostname;
    return urlObj.hostname === currentHostname;
  } catch (e) {
    if (e) return false;
  }
  return false;
};

export function supportsViewTransitions(): boolean {
  return typeof document !== "undefined" && "startViewTransition" in document;
}

export function getOgImageFromUrl(url: string): StaticImageData {
  let path: string;

  if (url.startsWith("/")) {
    path = url;
  } else {
    try {
      const ogImageUrl = new URL(url);
      path = ogImageUrl.pathname;
    } catch {
      path = url.startsWith("/") ? url : `/${url}`;
    }
  }

  if (path === "/") return assets.banner.home;

  if (path === "/about") return assets.banner.about;

  if (path === "/blogs") return assets.banner.blogs;

  if (path === "/contact") return assets.banner.contact;

  if (path === "/designs") return assets.banner.designs;

  if (path.startsWith("/exp")) return assets.banner.experience;

  if (path.startsWith("/events")) return assets.banner.events;

  if (path === "/guestbook") return assets.banner.guestbook;

  if (path === "/prs") return assets.banner.prs;

  if (path === "/resume") return assets.banner.resume;

  if (path === "/gh-followers") return assets.banner.ghFollowers;

  return assets.banner.home;
}

export function getUniqueId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
