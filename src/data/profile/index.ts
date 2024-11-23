import { Profile } from "@/types/Experience";
import { portfolioIndex } from "./portfolioIndex";
import { certifications } from "./certifications";
import { skills } from "./skills";
import { projects } from "./projects";
import assets from "@/data/assets";

const profile: Readonly<Profile> = {
  name: "Pulkit",
  caption: "Full Stack Developer & Open Source Enthusiast",
  image: assets.myImage,
  githubUserName: "pulkitxm",
  resumeLink: assets.resume,
  sourceCodeUrl: "https://github.com/Pulkitxm/devpulkit.in",
  email: "kpulkit15234@gmail.com",
  links: {
    github: "https://github.com/Pulkitxm",
    linkedin: "https://www.linkedin.com/in/pulkit-dce/",
    twitter: "https://x.com/devpulkitt",
    blogPageUrl: "https://blogs.devpulkit.in/",
  },
  experience: [
    {
      companyName: "DatawaveLabs",
      position: "Full Stack Engineer",
      startDate: new Date("2024-04-01"),
      endDate: new Date("2024-09-30"),
      location: "India",
      type: "remote",
      url: "https://datawavelabs.io/",
      slug: "datawavelabs",
      showOnHome: true,
    },
    {
      companyName: "GeeksforGeeks",
      position: "Campus Mantri",
      startDate: new Date("2024-04-01"),
      location: "India",
      type: "hybrid",
      url: "https://geeksforgeeks.org/",
      slug: "geeksforgeeks",
    },
    {
      companyName: "Deviators Club",
      position: "Chairperson & Web Lead",
      location: "Gurugram, India",
      type: "hybrid",
      url: "https://deviatorsdce.tech/",
      startDate: new Date("2024-02-01"),
      slug: "deviators",
    },
  ].sort((a, b) => {
    if (!a.endDate && b.endDate) return -1;
    if (!b.endDate && a.endDate) return 1;
    if (!a.endDate && !b.endDate)
      return a.startDate.getTime() - b.startDate.getTime();
    return (b.endDate?.getTime() || 0) - (a.endDate?.getTime() || 0);
  }),
  projects,
  skills,
  certifications,
  portfolioIndex,
};

export default profile;
