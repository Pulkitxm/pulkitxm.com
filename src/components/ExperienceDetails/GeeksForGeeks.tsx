"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ImageCarousel from "@/components/ImageCarousel";
import assets from "@/data/assets";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function GeeksForGeeks() {
  return (
    <div className="space-y-8">
      <h1 className="mb-4 text-lg font-bold text-primary md:text-xl lg:text-2xl">
        <span className="underline">{geeksForGeeksExp.position}</span>@
        <Link
          href={geeksForGeeksExp.url}
          className="hover:text-primary-dark transition-colors duration-200 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {geeksForGeeksExp.companyName}
        </Link>
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ImageCarousel images={geeksForGeeksExp.images} />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        <div>
          <div className="mb-4 text-xl font-semibold text-primary md:text-2xl">
            Key Responsibilities
          </div>
          <Card>
            <CardContent className="p-6">
              <motion.ul className="grid gap-4 md:grid-cols-2">
                {geeksForGeeksExp.points.map((point, index) => (
                  <motion.li
                    key={index}
                    variants={item}
                    className="flex items-start gap-2"
                  >
                    <span className="text-muted-foreground">{point}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="mb-4 flex items-center text-xl font-semibold text-primary md:text-2xl">
            Certificate of Employment
            <Link
              href={geeksForGeeksExp.docLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <iframe
            src={geeksForGeeksExp.docLink}
            title="Relieving Letter"
            className="h-60 w-full rounded-md border-0 lg:h-96"
          />
        </div>
      </motion.div>
    </div>
  );
}

const geeksForGeeksExp = {
  position: "Campuse Mantri",
  companyName: "GeeksforGeeks",
  url: "https://www.geeksforgeeks.org/",
  startDate: new Date("2024-04-24"),
  endDate: null,
  docLink: assets.geeksForGeeksLetter,
  location: "India",
  type: "hybrid",
  points: [
    "Acted as a bridge between GeeksforGeeks and students, promoting the platform's resources and initiatives to help peers improve their coding and programming skills.",
    "Organized informative sessions and workshops in collaboration with my college's club to introduce students to GeeksforGeeks and its offerings.",
    "Guided students on using GeeksforGeeks effectively for learning programming concepts, preparing for interviews, and participating in coding competitions.",
    "Encouraged participation in GeeksforGeeks events, ensuring students were aware of opportunities for skill development.",
    "Utilized my position as a Campus Ambassador to foster a collaborative learning environment within the club and across the campus.",
  ],
  images: assets.geekssForGeeksImages,
} as const;
