import assets from "@/assets";
import { createMetadata } from "@/lib/utils";

import ExperienceTimeline from "./ExperienceTimeline";

import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Experience",
  description: "Explore my professional journey, including work experience, internships, and volunteer roles.",
  image: assets.banner.experience.src,
  path: "experience",
  keywords: ["experience", "work", "internships", "volunteering", "projects"]
});

export default function ExperienceLayout() {
  return <ExperienceTimeline />;
}
