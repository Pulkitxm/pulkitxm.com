import assets from "@/assets";
import { Certification } from "@/types/profile";

export const certifications: readonly Certification[] = [
  {
    name: "GitHub Foundations",
    issuedBy: {
      name: "GitHub",
      url: "https://www.credly.com/org/github"
    },
    verifyLink: "https://www.credly.com/badges/0d980c06-511c-4e3d-a9a7-9973688b34ad",
    image: assets.badges.githubFoundationBadge,
    issuedAt: new Date(2024, 10, 14)
  },
  {
    name: "Fullstackopen",
    issuedBy: {
      name: "University of helsinki, Finland",
      url: "https://www.helsinki.fi/en"
    },
    verifyLink: "https://github.com/Pulkitxm/fullstackopen/blob/main/Certificates/Pulkit%20Pulkit.pdf",
    image: assets.badges.fullStackOpen,
    cover: true,
    issuedAt: new Date(2024, 2, 21)
  }
];
