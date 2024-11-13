import { StaticImageData } from "next/image";

export type ContactLink = {
  github: string;
  linkedin: string;
  twitter: string;
};

export type Experience = {
  companyName: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  location: string;
  type: string;
  url?: string;
  showMain: boolean;
};

export type Profile = {
  name: string;
  caption: string;
  image: StaticImageData;
  githubUserName: string;
  contactLinks: ContactLink;
  experience: Experience[];
  projects: Project[];
};

export type Project = {
  name: string;
  image: StaticImageData;
  url: string;
  tagline: string;
};
