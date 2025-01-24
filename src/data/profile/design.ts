import assets from "@/assets";
import { Design, DesignItem } from "@/types/profile";

const portfolioDesigns: DesignItem[] = [
  {
    title: "v5.devpulkit.in",
    link: "https://v5.devpulkit.in",
    githubLink: "https://github.com/pulkitxm/devpulkit.in",
    image: assets.designs.portfolio.v5Portfolio
  },
  {
    title: "v4.devpulkit.in",
    link: "https://v4.devpulkit.in",
    githubLink: "https://github.com/pulkitxm/v4.devpulkit.in",
    image: assets.designs.portfolio.v4Portfolio
  },
  {
    title: "v3.devpulkit.in",
    link: "https://v3.devpulkit.in",
    githubLink: "https://github.com/pulkitxm/v3.devpulkit.in",
    image: assets.designs.portfolio.v3Portfolio
  },
  {
    title: "v2.devpulkit.in",
    link: "https://v2.devpulkit.in",
    githubLink: "https://github.com/pulkitxm/v2.devpulkit.in",
    image: assets.designs.portfolio.v2Portfolio
  },
  {
    title: "v1.devpulkit.in",
    link: "https://v1.devpulkit.in",
    githubLink: "https://github.com/pulkitxm/v1.devpulkit.in",
    image: assets.designs.portfolio.v1Portfolio
  }
];

export const webDesigns: DesignItem[] = [
  {
    title: "deviatorsdce.tech",
    link: "https://www.deviatorsdce.tech",
    githubLink: "https://github.com/deviatorsclub/deviatorsdce.tech",
    image: assets.designs.deviators
  },
  {
    title: "eosdesignstudio.in",
    link: "https://www.eosdesignstudio.in",
    githubLink: "https://github.com/Pulkitxm/freelance/tree/eos-architecture",
    image: assets.designs.eosArchitecture
  }
];

export const design: Design = {
  portfolioDesigns,
  webDesigns
};
