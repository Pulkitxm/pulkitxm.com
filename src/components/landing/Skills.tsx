import { Separator } from "@/components/ui/separator";

const skillsData = {
  Languages: ["JavaScript", "TypeScript", "Python", "Java", "SQL"],
  "Libraries & Frameworks": [
    "React",
    "NextJS",
    "Express",
    "Fast Api",
    "HonoJs (Serverless)",
    "NodeJs",
    "React Native",
    "Tailwind CSS",
    "Bootstrap",
    "Material UI",
    "Jest",
    "Cypress",
    "React Query",
    "GraphQL",
    "Redux",
    "Recoil",
  ],
  "Databases & ORMs": [
    "MongoDB",
    "Postgres",
    "SqlAlchemy",
    "Redis",
    "Alembic",
    "MySQL",
    "Prisma",
    "PyScopG2",
  ],
  "Tools & Platforms": [
    "GitHub Actions",
    "Serverless",
    "ESLint",
    "AWS S3",
    "AWS EC2",
    "AWS CloudFront",
    "Azure VM",
    "Docker",
    "Mapbox",
  ],
};

export default function Component() {
  return (
    <section className="w-full bg-background py-12" id="skills">
      <div className="container pr-4 md:pr-6">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Skills
        </h1>
        <div className="space-y-8">
          {Object.entries(skillsData).map(([category, skills]) => (
            <div key={category}>
              <h3 className="mb-2 text-lg font-medium text-muted-foreground">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="text-sm text-foreground">
                    {skill},
                  </span>
                ))}
              </div>
              <Separator className="mt-4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
