import React from "react";
import { Github } from "lucide-react";
import profile from "@/data/profile";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-black bg-[linear-gradient(to_bottom,transparent,rgb(0,0,0))]">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-20 space-y-4">
          <h1 className="animate-fade-in-up bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-center text-5xl font-bold text-transparent sm:text-6xl md:text-7xl">
            Portfolio Evolution
          </h1>
          <p className="animate-fade-in-up text-center text-lg text-gray-400 delay-200 sm:text-xl">
            A journey through my web design iterations
          </p>
        </div>

        {/* Portfolio Cards */}
        <div className="mx-auto max-w-5xl space-y-12">
          {profile.portfolioIndex.map((item, index) => {
            const githubLink = `https://github.com/${profile.githubUserName}/${item.link}`;
            return (
              <div
                key={index}
                className="animate-slide-in-up group relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900 to-black p-1"
              >
                <div className="relative rounded-xl bg-gray-900/90 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-gray-900/70">
                  {/* Portfolio Image */}
                  <div className="relative mb-6 overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      width={1200}
                      height={800}
                      alt={`Portfolio v${index + 1}`}
                      className="w-full scale-110 transform object-cover transition duration-700 group-hover:rotate-0 group-hover:scale-100"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      priority={index === 0}
                      fetchPriority="high"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                  </div>

                  <Link
                    href={`http://${item.link}`}
                    className="mb-2 flex transform items-center justify-center rounded-lg px-6 py-3 text-lg font-semibold sm:text-base md:text-xl lg:text-2xl"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.link}
                  </Link>
                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href={`http://${item.link}`}
                      className="inline-flex transform items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-105 hover:bg-gray-100 sm:text-base"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Site
                    </Link>
                    <Link
                      href={githubLink}
                      className="inline-flex transform items-center rounded-lg bg-gray-800 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-gray-700 sm:text-base"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-5 w-5" />
                      GitHub
                    </Link>
                  </div>
                </div>

                {/* Animated Border Gradient */}
                <div className="animate-gradient-x absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/40 via-cyan-500/40 to-purple-500/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
