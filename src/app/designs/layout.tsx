import assets from "@/assets";
import { createMetadata } from "@/lib/utils";

import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Designs",
  description: "Explore my designs, showcasing my creativity and design skills.",
  image: assets.banner.designs.src,
  path: "designs",
  keywords: ["designs", "graphic design", "UI/UX design", "web design", "branding", "illustration"]
});

export default function DesignsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
