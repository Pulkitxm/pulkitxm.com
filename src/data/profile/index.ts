import { FaDiscord, FaGithub, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { FaHashnode } from "react-icons/fa6";

import assets from "@/assets";
import { Profile } from "@/types/profile";

import { certifications } from "./certifications";
import { design } from "./design";
import { events } from "./events";
import { experience } from "./experience";
import { projects } from "./projects";
import { skills } from "./skills";

const profile: Readonly<Profile> = {
  name: "Pulkit",
  caption: "Full Stack Developer & Open Source Enthusiast",
  image: assets.myImage,
  githubUserName: "pulkitxm",
  resumeLink: "http://resume.pulkitxm.com",
  calendlyUrl: "https://cal.com/pulkitxm",
  sourceCodeUrl: "https://github.com/Pulkitxm/pulkitxm.com",
  email: "kpulkit15234@gmail.com",
  links: {
    github: "https://github.com/Pulkitxm",
    linkedin: "https://www.linkedin.com/in/pulkitxm",
    twitter: "https://x.com/devpulkitt",
    blogPageUrl: "https://blogs.pulkitxm.com/",
    discord: "http://discordapp.com/users/790426084994187304",
    blogs: "https://blogs.pulkitxm.com"
  },
  experience,
  projects,
  skills,
  certifications,
  design,
  events
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
