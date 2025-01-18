export type Experience = {
  companyName: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  location: string;
  type: string;
  url?: string;
  slug: string;
  showOnHome?: boolean;
  desc: string;
};

export type Project = {
  name: string;
  image: string;
  url: string;
  tagline: string;
};

export type Certification = {
  name: string;
  issuedBy: {
    name: string;
    url: string;
  };
  verifyLink: string;
  image: string;
  optimize?: boolean;
  cover?: boolean;
};

export type DesignItem = {
  title: string;
  link: string;
  image: string;
  githubLink: string;
};

export type Design = {
  portfolioDesigns: DesignItem[];
  webDesigns: DesignItem[];
};

export type Event = {
  slug: string;
  name: string;
  images: string[];
  link?: string;
  date: Date;
  tagline: string;
};

export type Profile = {
  name: string;
  caption: string;
  image: string;
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
