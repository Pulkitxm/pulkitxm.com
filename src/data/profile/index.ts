import { FaDiscord, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FaHashnode, FaXTwitter } from "react-icons/fa6";
import { RiNpmjsFill } from "react-icons/ri";

import assets from "@/assets";

import { certifications } from "./certifications";
import { design } from "./design";
import { events } from "./events";
import { experience } from "./experience";
import { projects } from "./projects";
import { skills } from "./skills";

const profile = {
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
    blogPageUrl: "https://blogs.pulkitxm.com",
    discord: "http://discordapp.com/users/790426084994187304",
    blogs: "https://blogs.pulkitxm.com",
    npm: "https://www.npmjs.com/~pulkitxm"
  },
  x: {
    username: "_pulkitxm",
    pfp: "https://pbs.twimg.com/profile_images/1925253012307492864/X7eWOnYs_400x400.jpg"
  },
  experience,
  projects,
  skills,
  certifications,
  design,
  events
} as const;

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
