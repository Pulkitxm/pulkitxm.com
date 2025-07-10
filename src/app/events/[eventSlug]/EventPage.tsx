import { notFound } from "next/navigation";

import ImageGallery from "@/components/ImageGallery";
import { Event } from "@/types/profile";

export default function EventGalleryPage({ eventWithSlug }: { eventWithSlug: Event }) {
  if (eventWithSlug === undefined) {
    return notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pt-10 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{eventWithSlug.name} Gallery</h1>
        <p className="mb-8 text-lg text-gray-600 sm:text-xl">{eventWithSlug.tagline}</p>
      </div>
      <ImageGallery images={eventWithSlug.images} />
    </div>
  );
}
