import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

import assets from "@/assets";
import ImageCarousel from "@/components/ImageCarousel";
import { Card, CardContent } from "@/components/ui/card";
import { Experience } from "@/types/profile";

export default async function GeeksForGeeks({ exp }: { exp: Experience }) {
  return (
    <div className="space-y-8">
      <h1 className="text-primary mb-4 text-lg font-bold md:text-xl lg:text-3xl">
        <span className="underline">{exp.position}</span>@
        <Link
          href={exp.url}
          className="hover:text-primary-dark transition-colors duration-200 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {exp.companyName}
        </Link>
      </h1>

      <ImageCarousel
        images={assets.proffessionalThings.geeksforgeeks.images}
        autoMoveInterval={2000}
        autoMove
        showNavigation
      />

      <div className="space-y-8">
        <div>
          <div className="text-primary mb-4 text-xl font-semibold md:text-2xl">Key Responsibilities</div>
          <Card>
            <CardContent className="p-6">
              <ul className="grid gap-4 md:grid-cols-2">
                {gfgPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="text-primary mb-4 flex items-center text-xl font-semibold md:text-2xl">
            Certificate of Employment
            <Link
              href={assets.proffessionalThings.geeksforgeeks.geeksForGeeksLetter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open document"
            >
              <ExternalLink className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <iframe
            src={assets.proffessionalThings.geeksforgeeks.geeksForGeeksLetter}
            title="Relieving Letter"
            className="h-60 w-full rounded-md border-0 lg:h-96"
          />
        </div>
      </div>
    </div>
  );
}

const gfgPoints = [
  "Acted as a bridge between GeeksforGeeks and students, promoting the platform's resources and initiatives to help peers improve their coding and programming skills.",
  "Organized informative sessions and workshops in collaboration with my college's club to introduce students to GeeksforGeeks and its offerings.",
  "Guided students on using GeeksforGeeks effectively for learning programming concepts, preparing for interviews, and participating in coding competitions.",
  "Encouraged participation in GeeksforGeeks events, ensuring students were aware of opportunities for skill development.",
  "Utilized my position as a Campus Ambassador to foster a collaborative learning environment within the club and across the campus."
];
