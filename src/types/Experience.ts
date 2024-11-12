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
};

export type Profile = {
  name: string;
  caption: string;
  image: StaticImageData;
  contactLink: ContactLink;
  experience: Experience[];
};
