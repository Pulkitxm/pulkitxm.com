import { MetadataRoute } from "next";

import { NEXT_PUBLIC_API_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/private/"]
    },
    sitemap: NEXT_PUBLIC_API_URL + "/sitemap.xml"
  };
}
