import { Separator } from "@/components/ui/separator";
import profile from "@/data/profile";

export default function Component() {
  return (
    <section className="w-full bg-background py-12" id="skills">
      <div className="container pr-4 md:pr-6">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Skills</h2>
        <div className="space-y-4">
          {Object.entries(profile.skills).map(([category, skills]) => (
            <div key={category}>
              <h3 className="mb-2 text-lg font-medium text-muted-foreground">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={skill} className="text-sm text-foreground">
                    {skill}
                    {index === skills.length - 1 ? "" : ","}
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
