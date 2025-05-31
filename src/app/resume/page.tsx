import { redirect } from "next/navigation";

import assets from "@/assets";
import profile from "@/data/profile";
import { createMetadata } from "@/lib/utils";

import type { Metadata } from "next";

export default function page() {
  return redirect(profile.resumeLink);
}

export const metadata: Metadata = createMetadata({
  title: "Resume",
  description: "My resume and experience.",
  image: assets.banner.resume.src,
  path: "resume",
  keywords: ["resume", "experience", "cv", "curriculum vitae"]
});
