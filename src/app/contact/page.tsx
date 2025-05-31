import assets from "@/assets";
import { createMetadata } from "@/lib/utils";

import Contact from "./Contact";

import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description:
    "Get in touch with Pulkit. Whether you have questions, feedback, or just want to say hi, feel free to reach out!",
  image: assets.banner.contact.src,
  path: "contact",
  keywords: ["Pulkit", "contact", "web development", "technology", "tutorials", "articles"]
});

export default function ContactPage() {
  return <Contact />;
}
