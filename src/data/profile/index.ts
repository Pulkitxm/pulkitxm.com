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
  calendlyUrl: "https://cal.com/pulkitxm",
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
      desc: "My work at Datawave Labs involved developing and integrating various systems and tools to enhance the platform's functionality and user experience. I focused on authentication, cloud integration, infrastructure automation, real-time notifications, client and server development, and DevOps practices.",
    },
    {
      companyName: "GeeksforGeeks",
      position: "Campus Mantri",
      startDate: new Date("2024-04-01"),
      location: "India",
      type: "hybrid",
      url: "https://geeksforgeeks.org/",
      slug: "geeksforgeeks",
      desc: "I am responsible for managing and organizing various events, workshops, and contests for the college students. I also help students in their technical and non-technical queries and guide them in their career path.",
    },
    {
      companyName: "Deviators Club",
      position: "Chairperson & Web Lead",
      location: "Gurugram, India",
      type: "hybrid",
      url: "https://deviatorsdce.tech/",
      startDate: new Date("2024-02-01"),
      slug: "deviators",
      desc: "I lead a team of 50+ members and manage the club's activities, events, and workshops. I also manage the club's website and other technical activities.",
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
