import assets from "@/assets";
import { createMetadata } from "@/lib/utils";

import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Resume",
  description: "My resume and experience.",
  image: assets.banner.resume.src,
  path: "resume",
  keywords: ["resume", "experience", "cv", "curriculum vitae"]
});

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
