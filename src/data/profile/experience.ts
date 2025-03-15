import assets from "@/assets";
import CrowdVolt from "@/components/ExperienceDetails/CrowdVolt";
import DatawavelabsExperience from "@/components/ExperienceDetails/Datawavelabs";
import GeeksForGeeks from "@/components/ExperienceDetails/GeeksForGeeks";
import { getSlug } from "@/lib/utils";
import { Experience } from "@/types/profile";

const experienceWithoutSlug: (Omit<Experience, "slug"> & {
  slug?: Experience["slug"];
})[] = [
  {
    companyName: "CrowdVolt (YC W24)",
    position: "Software Engineer",
    startDate: new Date("2025-02-03"),
    endDate: new Date("2025-03-14"),
    location: "NYC, USA",
    type: "remote",
    url: "https://www.crowdvolt.com",
    showOnHome: true,
    desc: "Worked at CrowdVolt as a Software Engineer, responsible for maintaining the web application, implementing new features, and improving the existing codebase. Grateful for the experience and the opportunity to learn and grow with the team.",
    expDetails: CrowdVolt,
    logo: assets.proffessionalThings.crowdVolt.logo,
    slug: "crowdvolt"
  },
  {
    companyName: "DatawaveLabs",
    position: "Full Stack Engineer",
    startDate: new Date("2024-04-01"),
    endDate: new Date("2024-09-30"),
    location: "India",
    type: "remote",
    url: "https://datawavelabs.io",
    showOnHome: true,
    desc: "My work at Datawave Labs involved developing and integrating various systems and tools to enhance the platform's functionality and user experience. I focused on authentication, cloud integration, infrastructure automation, real-time notifications, client and server development, and DevOps practices.",
    expDetails: DatawavelabsExperience,
    logo: assets.proffessionalThings.datawavelabs.logo
  },
  {
    companyName: "GeeksforGeeks",
    position: "Campus Mantri",
    startDate: new Date("2024-04-01"),
    endDate: new Date("2025-04-01"),
    location: "India",
    type: "hybrid",
    url: "https://geeksforgeeks.org",
    desc: "I am responsible for managing and organizing various events, workshops, and contests for the college students. I also help students in their technical and non-technical queries and guide them in their career path.",
    expDetails: GeeksForGeeks,
    logo: assets.proffessionalThings.geeksforgeeks.logo
  }
].sort((a, b) => {
  if (!a.endDate && b.endDate) return -1;
  if (!b.endDate && a.endDate) return 1;
  if (!a.endDate && !b.endDate) {
    return b.startDate.getTime() - a.startDate.getTime();
  }
  if (a.endDate && b.endDate && a.endDate.getTime() === b.endDate.getTime()) {
    return b.startDate.getTime() - a.startDate.getTime();
  }
  return (b.endDate?.getTime() || 0) - (a.endDate?.getTime() || 0);
});

export const experience: Experience[] = experienceWithoutSlug.map((exp) => ({
  ...exp,
  slug: exp.slug || getSlug(exp.companyName)
}));
