import { Certification } from "@/types/Experience";
import assets from "@/data/assets";

export const certifications: readonly Certification[] = [
  {
    name: "GitHub Foundations",
    issuedBy: {
      name: "GitHub",
      url: "https://www.credly.com/org/github",
    },
    verifyLink:
      "https://www.credly.com/badges/0d980c06-511c-4e3d-a9a7-9973688b34ad",
    image: assets.githubFoundationBadge,
  },
];
