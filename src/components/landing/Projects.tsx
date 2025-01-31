import Image from "next/image";
import Link from "next/link";

import profile from "@/data/profile";
import { Project as ProjectType } from "@/types/profile";

import JumpLink from "../JumpLink";

export default async function Projects() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Projects</h1>
      <p className="text-sm text-gray-400">Some of my cool side projects</p>

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
      className="group flex w-full flex-col rounded-lg border border-gray-700 p-3"
      rel="noopener noreferrer"
      id={key + "-" + project.slug}
    >
      <div className="w-full flex-grow overflow-hidden rounded-lg brightness-90">
        <Image
          src={project.image}
          className="h-full w-full scale-110 rounded-lg object-contain brightness-90 transition-transform duration-300 group-hover:scale-100"
          width={500}
          height={300}
          alt={project.name}
          fetchPriority="high"
          loading="eager"
        />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="mt-2 text-lg font-bold text-gray-200">{project.name}</p>
          <p className="text-sm text-gray-300">{project.tagline}</p>
        </div>
        <JumpLink
          path="/"
          url={{ key, id: project.slug }}
          className={{
            master: "opacity-0 group-hover:opacity-100",
            child: "h-5 w-5 text-muted-foreground"
          }}
        />
      </div>
    </Link>
  );
}
