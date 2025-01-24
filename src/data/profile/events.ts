import assets from "@/assets";
import { Event } from "@/types/profile";

const eventsWithoutSlug: Omit<Event, "slug">[] = [
  {
    name: "GitHub Constellation",
    images: assets.events.constellation,
    link: "https://www.linkedin.com/posts/pulkitxm_githubconstellation-activity-7206997836423471104-E_eo",
    date: new Date(2024, 5, 13),
    tagline:
      "GitHub Constellation 2024 was an amazing event at blr where I met with the GitHub team and learned a lot about open source."
  },
  {
    name: "HackKRMU Hackathon",
    images: assets.events.krmu,
    link: "https://www.linkedin.com/posts/pulkitxm_krmuhackathon-ai-ml-activity-7171504117083684865-N7RB",
    date: new Date(2024, 2, 7),
    tagline: "HackKRMU Hackathon 2024 was a 24-hour hackathon where I built an AI/ML model to make a travel solution."
  },
  {
    name: "Debug Decrypt",
    images: assets.events["debug-decrypt"],
    link: "https://www.deviatorsdce.tech/gallery/debug-decrypt",
    date: new Date(2024, 7, 13),
    tagline: "Debug Decrypt 2024 was a technical event where me and my team organized a CTF competition."
  },
  {
    name: "IDE Bootcamp@Amity Jaipur",
    images: assets.events["ide-bootcamp-1"],
    link: "https://www.linkedin.com/posts/pulkitxm_idebootcamp2024-dronacharyaengineering-studentinnovation-activity-7246105751406927872-Ww5C",
    date: new Date(2024, 8, 29),
    tagline: "IDE Bootcamp 2024 was a 3-day bootcamp where I learned about innovation and entrepreneurship."
  },
  {
    name: "Youth Day x Univerity Ideathon",
    images: assets.events.gugIdeathon,
    link: "https://www.linkedin.com/posts/pulkitxm_excited-to-share-that-my-team-kanak-tanwar-activity-7284575438922752000-W0Ji",
    date: new Date(2025, 0, 13),
    tagline:
      "I was thrilled to be felicitated by the University on the occasion of Youth Day, alongside my team, for winning the University Ideathon."
  },
  {
    name: "CSIR visit with College Friends & Professors",
    images: assets.events["nptl-csir"],
    link: "https://www.linkedin.com/posts/pulkitxm_npl-delhi-csir-activity-7055041100675186688-jT-s",
    date: new Date(2023, 3, 21),
    tagline:
      "Visited CSIR with my college friends and professors. It was a great experience to learn about the research and development happening there."
  },
  {
    name: "ICPC Amritapuri",
    images: assets.events["icpc-amritapuri"],
    date: new Date(2024, 0, 27),
    tagline: "ICPC Amritapuri 2023 was a national level programming contest."
  }
].sort((a, b) => b.date.getTime() - a.date.getTime());

export const events: Event[] = eventsWithoutSlug.map((event) => ({
  ...event,
  slug: event.name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}));
