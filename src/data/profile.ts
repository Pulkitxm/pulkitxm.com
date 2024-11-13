import myImage from "@/assets/me.png";
import { Profile } from "@/types/Experience";

import DeployIt from "@/assets/projects/deployit.webp";
import ImageTweaker from "@/assets/projects/tweaker.webp";
import VidWave from "@/assets/projects/vidwave.webp";
import UseeForm from "@/assets/projects/useeform.webp";

const profile: Profile = {
  name: "Pulkit",
  caption: "Full Stack Developer & Open Source Enthusiast",
  image: myImage,
  githubUserName: "pulkitxm",
  contactLinks: {
    github: "https://github.com/Pulkitxm",
    linkedin: "https://www.linkedin.com/in/pulkit-dce/",
    twitter: "https://x.com/devpulkitt",
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
      showMain: true,
    },
    {
      companyName: "GeeksforGeeks",
      position: "Campus Mantri",
      // Apr 2024
      startDate: new Date("2024-04-01"),
      location: "India",
      type: "hybrid",
      url: "https://geeksforgeeks.org/",
      showMain: true,
    },
    {
      companyName: "Deviators Club",
      position: "Chairperson & Web Lead",
      location: "Gurugram, India",
      type: "hybrid",
      url: "deviatorsdce.tech",
      startDate: new Date("2024-02-01"),
      showMain: false,
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
};

profile.experience.sort((a, b) => {
  if (!a.endDate && b.endDate) return -1;
  if (!b.endDate && a.endDate) return 1;
  if (!a.endDate && !b.endDate)
    return a.startDate.getTime() - b.startDate.getTime();
  return (b.endDate?.getTime() || 0) - (a.endDate?.getTime() || 0);
});

export default profile;
