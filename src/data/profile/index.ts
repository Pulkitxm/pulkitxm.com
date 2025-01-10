// icons
import { FaDiscord, FaGithub, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { FaHashnode } from "react-icons/fa6";

import assets from "@/data/assets";
import { Profile } from "@/types/Experience";

import { certifications } from "./certifications";
import { design } from "./design";
import { projects } from "./projects";
import { skills } from "./skills";

const profile: Readonly<Profile> = {
  name: "Pulkit",
  caption: "Full Stack Developer & Open Source Enthusiast",
  image: assets.myImage,
  githubUserName: "pulkitxm",
  resumeLink: "http://resume.devpulkit.in",
  calendlyUrl: "https://cal.com/pulkitxm",
  sourceCodeUrl: "https://github.com/Pulkitxm/devpulkit.in",
  email: "kpulkit15234@gmail.com",
  links: {
    github: "https://github.com/Pulkitxm",
    linkedin: "https://www.linkedin.com/in/pulkitxm",
    twitter: "https://x.com/devpulkitt",
    blogPageUrl: "https://blogs.devpulkit.in/",
    discord: "http://discordapp.com/users/790426084994187304",
    blogs: "https://blogs.devpulkit.in"
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
      desc: "My work at Datawave Labs involved developing and integrating various systems and tools to enhance the platform's functionality and user experience. I focused on authentication, cloud integration, infrastructure automation, real-time notifications, client and server development, and DevOps practices."
    },
    {
      companyName: "GeeksforGeeks",
      position: "Campus Mantri",
      startDate: new Date("2024-04-01"),
      location: "India",
      type: "hybrid",
      url: "https://geeksforgeeks.org/",
      slug: "geeksforgeeks",
      desc: "I am responsible for managing and organizing various events, workshops, and contests for the college students. I also help students in their technical and non-technical queries and guide them in their career path."
    }
  ]
    .sort((a, b) => {
      if (!a.endDate && b.endDate) return -1;
      if (!b.endDate && a.endDate) return 1;
      if (!a.endDate && !b.endDate) return a.startDate.getTime() - b.startDate.getTime();
      return (b.endDate?.getTime() || 0) - (a.endDate?.getTime() || 0);
    })
    .sort((a) => (a.type === "remote" ? -1 : 1)),
  projects,
  skills,
  certifications,
  design
};

export default profile;

export const links = [
  {
    href: profile.links.github,
    icon: FaGithub,
    label: "GitHub"
  },
  {
    href: profile.links.linkedin,
    icon: FaLinkedinIn,
    label: "LinkedIn"
  },
  {
    href: profile.links.discord,
    icon: FaDiscord,
    label: "Discord"
  },
  {
    href: profile.links.twitter,
    icon: FaTwitter,
    label: "Twitter"
  },
  {
    href: profile.links.blogs,
    icon: FaHashnode,
    label: "Blogs"
  }
];
