import myImage from "@/assets/me.png";
import { Profile } from "@/types/Experience";

// projects
import DeployIt from "@/assets/projects/deployit.webp";
import ImageTweaker from "@/assets/projects/tweaker.webp";
import VidWave from "@/assets/projects/vidwave.webp";
import UseeForm from "@/assets/projects/useeform.webp";

// certifications
import GitHubFoundations from "@/assets/certifications/githubFoundations.png";

// portfolio previews
import v1 from "@/assets/portfolios/v1.png";
import v2 from "@/assets/portfolios/v2.png";
import v3 from "@/assets/portfolios/v3.png";
import v4 from "@/assets/portfolios/v4.png";

const profile: Profile = {
  name: "Pulkit",
  caption: "Full Stack Developer & Open Source Enthusiast",
  image: myImage,
  githubUserName: "pulkitxm",
  resumeLink: "/resume.pdf",
  sourceCodeUrl: "https://github.com/Pulkitxm/devpulkit.in",
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
    },
    {
      companyName: "GeeksforGeeks",
      position: "Campus Mantri",
      // Apr 2024
      startDate: new Date("2024-04-01"),
      location: "India",
      type: "hybrid",
      url: "https://geeksforgeeks.org/",
    },
    {
      companyName: "Deviators Club",
      position: "Chairperson & Web Lead",
      location: "Gurugram, India",
      type: "hybrid",
      url: "https://deviatorsdce.tech/",
      startDate: new Date("2024-02-01"),
    },
  ],
  projects: [
    {
      name: "Deployit",
      image: DeployIt,
      url: "https://deployit.live/",
      tagline: "deploy your react projects with ease",
    },
    {
      name: "Image Tweaker",
      url: "https://image-tweaker.devpulkit.in/",
      image: ImageTweaker,
      tagline: "dynamic url based image editor",
    },
    {
      name: "VidWave: (HLS Video Streaming)",
      url: "https://github.com/Pulkitxm/vidwave",
      image: VidWave,
      tagline: "A simple video streaming server",
    },
    {
      name: "useeForm React hook(npm library)",
      url: "https://www.npmjs.com/package/useeform",
      image: UseeForm,
      tagline: "A simple react hook for form handling",
    },
  ],
  skills: {
    Languages: ["JavaScript", "TypeScript", "Python", "Java", "SQL"],
    "Libraries & Frameworks": [
      "React",
      "NextJS",
      "Express",
      "Fast Api",
      "HonoJs (Serverless)",
      "NodeJs",
      "React Native",
      "Tailwind CSS",
      "Bootstrap",
      "Material UI",
      "Jest",
      "Cypress",
      "React Query",
      "GraphQL",
      "Redux",
      "Recoil",
    ],
    "Databases & ORMs": [
      "MongoDB",
      "Postgres",
      "SqlAlchemy",
      "Redis",
      "Alembic",
      "MySQL",
      "Prisma",
      "PyScopG2",
    ],
    "Tools & Platforms": [
      "GitHub Actions",
      "Serverless",
      "ESLint",
      "AWS S3",
      "AWS EC2",
      "AWS CloudFront",
      "Azure VM",
      "Docker",
      "Mapbox",
    ],
  },
  certifications: [
    {
      name: "GitHub Foundations",
      issuedBy: {
        name: "GitHub",
        url: "https://www.credly.com/org/github",
      },
      verifyLink:
        "https://www.credly.com/badges/0d980c06-511c-4e3d-a9a7-9973688b34ad",
      image: GitHubFoundations,
    },
  ],
  portfolioIndex: [
    {
      link: "v4.devpulkit.in",
      image: v4,
    },
    {
      link: "v3.devpulkit.in",
      image: v3,
    },
    {
      link: "v2.devpulkit.in",
      image: v2,
    },
    {
      link: "v1.devpulkit.in",
      image: v1,
    },
  ],
};

profile.experience.sort((a, b) => {
  if (!a.endDate && b.endDate) return -1;
  if (!b.endDate && a.endDate) return 1;
  if (!a.endDate && !b.endDate)
    return a.startDate.getTime() - b.startDate.getTime();
  return (b.endDate?.getTime() || 0) - (a.endDate?.getTime() || 0);
});

export default profile;
