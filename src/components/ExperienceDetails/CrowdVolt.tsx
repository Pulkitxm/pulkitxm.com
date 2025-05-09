import { ExternalLink } from "lucide-react";
import Link from "next/link";

import assets from "@/assets";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Experience } from "@/types/profile";

const crowdVoltExp = {
  docLink: assets.proffessionalThings.crowdVolt.crowdVoltOfferLetter,
  skills: ["NextJs", "TypeScript", "React", "TailwindCSS", "ESLint", "Prettier", "Git"],
  image: assets.proffessionalThings.crowdVolt.website
};

export default function CrowdVoltExperience({ exp }: { exp: Experience }) {
  return (
    <div className="space-y-8">
      <h1 className="text-primary text-lg font-bold md:text-xl lg:text-2xl">
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

      <section>
        <p className="text-muted-foreground mb-6 text-lg">
          At CrowdVolt, I focused on maintaining and enhancing their web platform, resolving critical bugs, implementing
          new features, and improving the overall user experience. I introduced clean code practices by implementing
          ESLint and Prettier configurations, significantly improving code quality and consistency. Additionally, I
          optimized website performance through code refactoring and asset optimization.
        </p>

        <div className="mb-8 overflow-hidden rounded-lg shadow-lg">
          <img
            src={crowdVoltExp.image.src}
            width={1200}
            height={800}
            alt="CrowdVolt Website"
            className="w-full object-cover object-center"
          />
        </div>
      </section>

      <section>
        <h3 className="text-primary mb-4 text-2xl font-bold sm:text-3xl">Technologies and Tools</h3>
        <p className="text-muted-foreground mb-4">
          My work involved a diverse set of technologies and tools essential for modern web development:
        </p>
        <div className="flex flex-wrap gap-2">
          {crowdVoltExp.skills.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-sm">
              {tech}
            </Badge>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-primary mb-4 text-2xl font-bold sm:text-3xl">Key Contributions</h3>
        <ul className="text-muted-foreground space-y-2">
          <li>• Implemented code quality tools (ESLint, Prettier) to enforce consistent coding standards</li>
          <li>• Resolved critical bugs affecting user experience and platform stability</li>
          <li>• Enhanced website performance through code optimization and lazy loading techniques</li>
          <li>• Collaborated with design team to improve UX across the platform</li>
          <li>• Developed new features based on user feedback and business requirements</li>
        </ul>
      </section>

      <section>
        <h3 className="text-primary mb-4 text-2xl font-bold sm:text-3xl">Conclusion</h3>
        <p className="text-muted-foreground">
          My experience at CrowdVolt equipped me with valuable insights into maintaining and improving production-level
          web applications. Working with a YC-backed startup provided exposure to fast-paced development cycles and the
          importance of balancing technical excellence with business objectives.
          <br />
          While my journey at CrowdVolt came to an unexpected end, I deeply value the experience and the lessons I
          learned. Every challenge was an opportunity to grow, and this experience reinforced my adaptability and
          problem-solving skills. I’m grateful for the chance to work in a fast-paced, YC-backed startup environment,
          and I look forward to applying these learnings in my next role.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            Offer Letter
            <Link href={crowdVoltExp.docLink} target="_blank" rel="noopener noreferrer" aria-label="Open document">
              <ExternalLink className="ml-2 h-5 w-5" />
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <iframe
            src={crowdVoltExp.docLink}
            title="CrowdVolt Offer Letter"
            className="h-60 w-full rounded-md border-0 lg:h-96"
          />
        </CardContent>
      </Card>
    </div>
  );
}
