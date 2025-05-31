import { Calendar, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import assets from "@/assets";
import { ImageFader } from "@/components/ImageCarousel";
import JumpLink from "@/components/JumpLink";
import { PreFetchUrl } from "@/components/PreFetchUrl";
import profile from "@/data/profile";
import { createMetadata } from "@/lib/utils";

import type { Metadata } from "next";

export default function EventsPage() {
  const key = "event";
  const events = profile.events;

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mb-12 lg:mb-16">
        <h1 className="mb-4 bg-linear-to-r from-emerald-400 via-emerald-500 to-teal-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
          Events
        </h1>
        <p className="max-w-2xl text-base text-gray-400/80 sm:text-lg lg:text-xl">
          Explore the moments that shaped my journey
        </p>
      </div>

      <div className="space-y-12 sm:space-y-16 lg:space-y-24">
        {events.map((event, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl bg-linear-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-sm transition-all duration-300 hover:from-gray-800/50 hover:to-gray-900/50"
            id={key + "-" + event.slug}
          >
            <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-emerald-500/5 via-emerald-500/10 to-transparent" />

            <div className="relative lg:flex lg:min-h-[400px]">
              <div className="relative w-full lg:w-[60%]">
                <ImageFader images={event.images} alt={event.name} />
              </div>

              <div className="relative flex flex-col justify-between p-6 sm:p-8 lg:w-[40%] lg:p-10">
                <div className="space-y-6">
                  <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold tracking-tight break-words whitespace-normal text-white sm:text-2xl lg:text-3xl">
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

                <div className="mt-8 flex flex-wrap items-center gap-4 pt-2">
                  <PreFetchUrl
                    href={`/events/${event.slug}`}
                    className="inline-flex items-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 sm:px-6 sm:text-base"
                  >
                    View Details
                  </PreFetchUrl>

                  {event.link && (
                    <Link
                      href={event.link}
                      target="_blank"
                      className="group inline-flex items-center gap-1 text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300 sm:text-base"
                    >
                      Post Link
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-5 sm:w-5" />
                    </Link>
                  )}
                </div>
                <div className="flex justify-end">
                  <JumpLink
                    path="/events"
                    url={{ key, id: event.slug }}
                    className={{
                      master: "opacity-0 group-hover:opacity-100",
                      child: "text-muted-foreground h-5 w-5"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const metadata: Metadata = createMetadata({
  title: "Events",
  description: "Explore the events I have attended and organized.",
  image: assets.banner.events.src,
  path: "events",
  keywords: ["events", "talks", "workshops", "conferences", "meetups"]
});
