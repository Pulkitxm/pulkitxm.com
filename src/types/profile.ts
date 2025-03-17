/* eslint-disable no-unused-vars */

import { StaticImageData } from "next/image";

export enum EXP_TYPE {
  JOB = "job",
  INTERNSHIP = "internship",
  VOLUNTEER = "volunteer"
}

export type Experience = {
  companyName: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  location: string;
  type: string;
  url: string;
  slug: string;
  showOnHome?: boolean;
  desc: string;
  expDetails?: ({ exp }: { exp: Experience }) => JSX.Element | Promise<JSX.Element>;
  logo: StaticImageData;
  expType: EXP_TYPE;
};

export type Project = {
  name: string;
  image: StaticImageData;
  url: string;
  tagline: string;
  slug: string;
};

export type Certification = {
  name: string;
  issuedBy: {
    name: string;
    url: string;
  };
  verifyLink: string;
  image: StaticImageData;
  cover?: boolean;
  issuedAt: Date;
  slug: string;
};

export type DesignItem = {
  title: string;
  link: string;
  image: StaticImageData;
  githubLink: string;
};

export type Design = {
  portfolioDesigns: DesignItem[];
  webDesigns: DesignItem[];
};

export type Event = {
  slug: string;
  name: string;
  images: StaticImageData[];
  link?: string;
  date: Date;
  tagline: string;
};

export type Profile = {
  name: string;
  caption: string;
  image: StaticImageData;
  calendlyUrl: string;
  githubUserName: string;
  resumeLink: string;
  sourceCodeUrl: string;
  email: string;
  links: Readonly<Record<string, string>>;
  experience: readonly Experience[];
  projects: readonly Project[];
  events: readonly Event[];
  skills: Readonly<Record<string, string[]>>;
  certifications: readonly Certification[];
  design: Design;
};
