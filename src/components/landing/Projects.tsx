"use client";

import profile from "@/data/profile";
import Image from "next/image";
import Link from "next/link";

export default function Projects() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
        Projects
      </h1>
      <p className="text-sm text-gray-400">Some of my cool side projects</p>

      <div className="grid w-full gap-4 p-2 sm:grid-cols-2">
        {profile.projects.map((project, index) => (
          <Link
            href={project.url}
            key={index}
            target="_blank"
            className="group flex w-full flex-col rounded-lg border border-gray-700 p-3"
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
            <p className="mt-2 text-lg font-bold text-gray-200">
              {project.name}
            </p>
            <p className="text-sm text-gray-300">{project.tagline}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
