import Link from "next/link";

import profile from "@/data/profile";
import { Project as ProjectType } from "@/types/profile";

import JumpLink from "../JumpLink";

export default async function Projects() {
  return (
    <div>
      <h1 className="text-foreground mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Projects</h1>
      <p className="text-muted-foreground text-sm">Some of my cool side projects</p>

      <div className="grid w-full gap-4 p-2 sm:grid-cols-2">
        {profile.projects.map((project, index) => (
          <Project key={index} project={project} />
        ))}
      </div>
    </div>
  );
}

function Project({ project }: { project: ProjectType }) {
  const key = "project";
  return (
    <Link
      href={project.url}
      target="_blank"
      className="group border-border flex w-full flex-col rounded-lg border p-3 shadow-lg transition-all duration-300 hover:shadow-xl"
      rel="noopener noreferrer"
      id={key + "-" + project.slug}
    >
      <div className="w-full grow overflow-hidden rounded-lg brightness-90">
        <img
          src={project.image.src}
          className="h-full w-full rounded-lg object-contain brightness-90 transition-transform duration-300"
          width={500}
          height={300}
          alt={project.name}
          loading="eager"
        />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-foreground mt-2 text-lg font-bold">{project.name}</p>
          <p className="text-muted-foreground text-sm">{project.tagline}</p>
        </div>
        <JumpLink
          path="/"
          url={{ key, id: project.slug }}
          className={{
            master: "opacity-0 group-hover:opacity-100",
            child: "text-muted-foreground h-5 w-5"
          }}
        />
      </div>
    </Link>
  );
}
