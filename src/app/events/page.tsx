import { Calendar, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { ImageFader } from "@/components/ImageCarousel";
import profile from "@/data/profile";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-12 lg:mb-16">
          <h1 className="mb-4 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            Events
          </h1>
          <p className="max-w-2xl text-base text-gray-400/80 sm:text-lg lg:text-xl">
            Explore the moments that shaped my journey
          </p>
        </div>

        <div className="space-y-12 sm:space-y-16 lg:space-y-24">
          {profile.events.map((event, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-sm transition-all duration-300 hover:from-gray-800/50 hover:to-gray-900/50"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 via-emerald-500/10 to-transparent" />

              <div className="relative lg:flex lg:min-h-[400px]">
                <div className="relative w-full lg:w-[60%]">
                  <ImageFader images={event.images} alt={event.name} />
                </div>

                <div className="relative flex flex-col justify-between p-6 sm:p-8 lg:w-[40%] lg:p-10">
                  <div className="space-y-6">
                    <div className="flex flex-col gap-4">
                      <h2 className="whitespace-normal break-words text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                        {event.name}
                      </h2>
                      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={event.date.toISOString()} className="font-medium">
                          {event.date.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </time>
                      </div>
                    </div>

                    <p className="text-base text-gray-300/90 sm:text-lg">{event.tagline}</p>
                  </div>

                  {event.link && (
                    <div className="mt-8">
                      <Link
                        href={event.link}
                        target="_blank"
                        className="group/btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-base font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 hover:brightness-110 sm:text-lg"
                      >
                        View More
                        <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
