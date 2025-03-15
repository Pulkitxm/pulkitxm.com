import assets from "@/assets";
import { Design, DesignItem } from "@/types/profile";

const portfolioDesigns: DesignItem[] = [
  {
    title: "v5.pulkitxm.com",
    link: "https://v5.pulkitxm.com",
    githubLink: "https://github.com/pulkitxm/pulkitxm.com",
    image: assets.designs.portfolio.v5Portfolio
  },
  {
    title: "v4.pulkitxm.com",
    link: "https://v4.pulkitxm.com",
    githubLink: "https://github.com/pulkitxm/v4.pulkitxm.com",
    image: assets.designs.portfolio.v4Portfolio
  },
  {
    title: "v3.pulkitxm.com",
    link: "https://v3.pulkitxm.com",
    githubLink: "https://github.com/pulkitxm/v3.pulkitxm.com",
    image: assets.designs.portfolio.v3Portfolio
  },
  {
    title: "v2.pulkitxm.com",
    link: "https://v2.pulkitxm.com",
    githubLink: "https://github.com/pulkitxm/v2.pulkitxm.com",
    image: assets.designs.portfolio.v2Portfolio
  },
  {
    title: "v1.pulkitxm.com",
    link: "https://v1.pulkitxm.com",
    githubLink: "https://github.com/pulkitxm/v1.pulkitxm.com",
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
    title: "Devolympus Hackathon",
    link: "https://devolympus.deviatorsdce.tech/",
    githubLink: "https://github.com/deviatorsclub/DevOlympus",
    image: assets.designs.devolympusDeviators
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
