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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mb-16 text-center lg:text-left">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
          <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Events
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 lg:mx-0 lg:text-xl dark:text-gray-300">
          Explore the moments that shaped my journey
        </p>
      </div>

      <div className="space-y-8 lg:space-y-12">
        {events.map((event, index) => (
          <article
            key={index}
            className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:shadow-gray-900/20"
            id={key + "-" + event.slug}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-teal-50/30 dark:from-emerald-950/20 dark:via-transparent dark:to-teal-950/10" />

            <div className="relative grid gap-0 lg:min-h-[400px] lg:grid-cols-5">
              <div className="relative lg:col-span-3">
                <div className="aspect-[16/10] lg:aspect-auto lg:h-full">
                  <ImageFader images={event.images} alt={event.name} />
                </div>
              </div>

              <div className="relative flex flex-col justify-between p-6 sm:p-8 lg:col-span-2 lg:p-10">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-2xl leading-tight font-bold text-gray-900 sm:text-3xl lg:text-2xl xl:text-3xl dark:text-white">
                      {event.name}
                    </h2>

                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={event.date.toISOString()}>
                        {event.date.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </time>
                    </div>
                  </div>

                  <p className="text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-300">
                    {event.tagline}
                  </p>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <PreFetchUrl
                      href={`/events/${event.slug}`}
                      className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-900"
                    >
                      View Details
                    </PreFetchUrl>

                    {event.link && (
                      <Link
                        href={event.link}
                        target="_blank"
                        className="group inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-emerald-400 dark:focus:ring-offset-gray-900"
                      >
                        Post Link
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <JumpLink
                      path="/events"
                      url={{ key, id: event.slug }}
                      className={{
                        master: "opacity-60 transition-opacity group-hover:opacity-100",
                        child: "h-5 w-5 text-gray-400 dark:text-gray-500"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {events.length === 0 && (
        <div className="py-24 text-center">
          <Calendar className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No events yet</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Check back later for upcoming events and activities.</p>
        </div>
      )}
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
