import axios from "axios";
import { StaticImageData } from "next/image";
import { z } from "zod";

import assets from "@/assets";
import { DEVIATORS_WEBSITE } from "@/lib/constants";
import { getSlug } from "@/lib/utils";
import { Event } from "@/types/profile";

const validateResult = z
  .array(
    z.object({
      src: z.string(),
      width: z.number(),
      height: z.number()
    })
  )
  .min(1);

async function getDevolympusImages() {
  if (!DEVIATORS_WEBSITE) {
    return [];
  }

  try {
    const response = await axios.get(`${DEVIATORS_WEBSITE}/api/devolympus`, {
      timeout: 5000,
      validateStatus: () => true
    });

    const parsedData = validateResult.safeParse(response.data);

    if (!parsedData.success) {
      return [];
    }

    return parsedData.data;
  } catch (error) {
    console.error("Failed to fetch Devolympus images:", error);
    return [];
  }
}

const baseEvents: Omit<Event, "slug" | "images">[] = [
  {
    name: "GitHub Constellation",
    link: "https://www.linkedin.com/posts/pulkitxm_githubconstellation-activity-7206997836423471104-E_eo",
    date: new Date(2024, 5, 13),
    tagline:
      "GitHub Constellation 2024 was an amazing event at blr where I met with the GitHub team and learned a lot about open source."
  },
  {
    name: "HackKRMU Hackathon",
    link: "https://www.linkedin.com/posts/pulkitxm_krmuhackathon-ai-ml-activity-7171504117083684865-N7RB",
    date: new Date(2024, 2, 7),
    tagline: "HackKRMU Hackathon 2024 was a 24-hour hackathon where I built an AI/ML model to make a travel solution."
  },
  {
    name: "Debug Decrypt",
    link: "https://www.deviatorsdce.tech/gallery/debug-decrypt",
    date: new Date(2024, 7, 13),
    tagline: "Debug Decrypt 2024 was a technical event where me and my team organized a CTF competition."
  },
  {
    name: "IDE Bootcamp@Amity Jaipur",
    link: "https://www.linkedin.com/posts/pulkitxm_idebootcamp2024-dronacharyaengineering-studentinnovation-activity-7246105751406927872-Ww5C",
    date: new Date(2024, 8, 29),
    tagline: "IDE Bootcamp 2024 was a 3-day bootcamp where I learned about innovation and entrepreneurship."
  },
  {
    name: "Youth Day x Univerity Ideathon",
    link: "https://www.linkedin.com/posts/pulkitxm_excited-to-share-that-my-team-kanak-tanwar-activity-7284575438922752000-W0Ji",
    date: new Date(2025, 0, 13),
    tagline:
      "I was thrilled to be felicitated by the University on the occasion of Youth Day, alongside my team, for winning the University Ideathon."
  },
  {
    name: "CSIR visit with College Friends & Professors",
    link: "https://www.linkedin.com/posts/pulkitxm_npl-delhi-csir-activity-7055041100675186688-jT-s",
    date: new Date(2023, 3, 21),
    tagline:
      "Visited CSIR with my college friends and professors. It was a great experience to learn about the research and development happening there."
  },
  {
    name: "ICPC Amritapuri",
    date: new Date(2024, 0, 27),
    tagline: "ICPC Amritapuri 2023 was a national level programming contest."
  },
  {
    name: "Devolympus Hackathon",
    date: new Date(2025, 3, 11),
    tagline:
      "Me and my team at the Deviators Club organized the Devolympus Hackathon which was a 36 hours offline hackathon."
  }
];

export const getEvents = async (): Promise<Event[]> => {
  const imagesToEvent: Record<string, StaticImageData[]> = {
    "GitHub Constellation": assets.events.constellation,
    "HackKRMU Hackathon": assets.events.krmu,
    "Debug Decrypt": assets.events["debug-decrypt"],
    "IDE Bootcamp@Amity Jaipur": assets.events["ide-bootcamp-1"],
    "Youth Day x Univerity Ideathon": assets.events.gugIdeathon,
    "CSIR visit with College Friends & Professors": assets.events["nptl-csir"],
    "ICPC Amritapuri": assets.events["icpc-amritapuri"],
    "Devolympus Hackathon": await getDevolympusImages()
  };

  const eventsWithSlug = await Promise.all(
    baseEvents.map(async (event) => {
      const slug = getSlug(event.name);
      return {
        ...event,
        slug,
        images: imagesToEvent[event.name]
      };
    })
  );

  return eventsWithSlug.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const eventsForSitemap = baseEvents.map((event) => ({
  slug: getSlug(event.name),
  date: event.date
}));
