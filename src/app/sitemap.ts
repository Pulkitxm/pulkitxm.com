import { MetadataRoute } from "next";

import { NAVIGATION_LINKS } from "@/data/pages";
import profile from "@/data/profile";
import { NEXT_PUBLIC_API_URL } from "@/lib/constants";

type Route = {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = NEXT_PUBLIC_API_URL;

  const priorityMap: Record<string, number> = {
    "": 1.0,
    about: 0.8,
    projects: 0.9,
    contact: 0.7,
    events: 0.8,
    experience: 0.8,
    guestbook: 0.6
  };

  const navigationRoutes: Route[] = NAVIGATION_LINKS.map(({ url }) => {
    const path = url.startsWith("/") ? url.slice(1) : url;

    return {
      url: `${baseUrl}/${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: priorityMap[path] || 0.5
    };
  });

  if (!NAVIGATION_LINKS.some((link) => link.url === "/" || link.url === "")) {
    navigationRoutes.unshift({
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0
    });
  }

  const eventRoutes: Route[] = profile.events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: new Date(event.date),
    changeFrequency: "monthly",
    priority: 0.7
  }));

  const experienceRoutes: Route[] = profile.experience.map((exp) => ({
    url: `${baseUrl}/experience/${exp.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7
  }));

  const indexPages = [
    { path: "events", priority: 0.8 },
    { path: "experience", priority: 0.8 },
    { path: "guestbook", priority: 0.6 }
  ];

  for (const { path, priority } of indexPages) {
    if (!NAVIGATION_LINKS.some((link) => link.url === `/${path}` || link.url === path)) {
      navigationRoutes.push({
        url: `${baseUrl}/${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority
      });
    }
  }

  return [...navigationRoutes, ...eventRoutes, ...experienceRoutes];
}
