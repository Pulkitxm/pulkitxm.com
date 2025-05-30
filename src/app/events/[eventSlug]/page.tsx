import { notFound } from "next/navigation";

import profile from "@/data/profile";

import EventGalleryPage from "./EventPage";

export default async function EventPage({ params }: { params: Promise<{ eventSlug: string }> }) {
  const { eventSlug } = await params;

  const eventWithSlug = profile.events.find((e) => e.slug === eventSlug);

  if (!eventWithSlug) {
    return notFound();
  }

  return <EventGalleryPage eventWithSlug={eventWithSlug} />;
}
