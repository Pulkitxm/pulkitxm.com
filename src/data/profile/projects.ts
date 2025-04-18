import assets from "@/assets";
import { getSlug } from "@/lib/utils";
import { Project } from "@/types/profile";

const projectsWithSlug: Omit<Project, "slug">[] = [
  {
    name: "DevOlympus Hackathon Website",
    image: assets.designs.devolympusDeviators,
    url: "https://devolympus.deviatorsdce.tech/",
    tagline: "Hackathon website for Deviators DCE"
  },
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
  }
];

export const projects: readonly Project[] = projectsWithSlug.map((project) => ({
  ...project,
  slug: getSlug(project.name)
}));
