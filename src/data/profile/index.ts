import { FaDiscord, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FaHashnode, FaXTwitter } from "react-icons/fa6";
import { RiNpmjsFill } from "react-icons/ri";

import assets from "@/assets";
import { Profile } from "@/types/profile";

import { certifications } from "./certifications";
import { design } from "./design";
import { getEvents } from "./events";
import { experience } from "./experience";
import { projects } from "./projects";
import { setupItems } from "./setup";
import { skills } from "./skills";

const profile: Readonly<Profile> = {
  name: "Pulkit",
  caption: "Full Stack Developer & Open Source Enthusiast",
  image: assets.myImage,
  githubUserName: "pulkitxm",
  resumeLink: "https://gh.pulkitxm.com/resume/resume.pdf",
  calendlyUrl: "https://cal.com/pulkitxm",
  sourceCodeUrl: "https://github.com/Pulkitxm/pulkitxm.com",
  email: "kpulkit15234@gmail.com",
  links: {
    github: "https://github.com/Pulkitxm",
    linkedin: "https://www.linkedin.com/in/pulkitxm",
    x: "https://x.com/_pulkitxm",
    blogPageUrl: "https://blogs.pulkitxm.com/",
    discord: "http://discordapp.com/users/790426084994187304",
    blogs: "https://blogs.pulkitxm.com",
    npm: "https://www.npmjs.com/~pulkitxm"
  },
  experience,
  projects,
  skills,
  certifications,
  design,
  events: getEvents(),
  setupItems
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
    href: profile.links.x,
    icon: FaXTwitter,
    label: "X"
  },
  {
    href: profile.links.blogs,
    icon: FaHashnode,
    label: "Blogs"
  },
  {
    href: profile.links.npm,
    icon: RiNpmjsFill,
    label: "Blogs"
  }
];
