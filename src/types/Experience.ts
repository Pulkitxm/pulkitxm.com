import { StaticImageData } from "next/image";

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
  links: {
    [key: string]: string;
  };
  experience: Experience[];
  projects: Project[];
};

export type Project = {
  name: string;
  image: StaticImageData;
  url: string;
  tagline: string;
};
