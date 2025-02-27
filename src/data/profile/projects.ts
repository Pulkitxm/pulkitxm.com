import assets from "@/assets";
import { getSlug } from "@/lib/utils";
import { Project } from "@/types/profile";

const projectsWithSlug: Omit<Project, "slug">[] = [
  {
    name: "Deployit",
    image: assets.projects.deployitProject,
    url: "https://deployit.live/",
    tagline: "deploy your react projects with ease"
  },
  {
    name: "Image Tweaker",
    url: "https://image-tweaker.pulkitxm.com/",
    image: assets.projects.imageTweakerProject,
    tagline: "dynamic url based image editor"
  },
  {
    name: "VidWave: (HLS Video Streaming)",
    url: "https://github.com/Pulkitxm/vidwave",
    image: assets.projects.vidWaveProject,
    tagline: "A simple video streaming server"
  },
  {
    name: "useeForm React hook(npm library)",
    url: "https://www.npmjs.com/package/useeform",
    image: assets.projects.useeFormProject,
    tagline: "A simple react hook for form handling"
  }
];

export const projects: readonly Project[] = projectsWithSlug.map((project) => ({
  ...project,
  slug: getSlug(project.name)
}));
