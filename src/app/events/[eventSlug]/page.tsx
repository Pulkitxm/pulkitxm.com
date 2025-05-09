import EventGalleryPage from "./EventPage";

export default async function EventPage({ params }: { params: Promise<{ eventSlug: string }> }) {
  const { eventSlug } = await params;

  return <EventGalleryPage eventSlug={eventSlug} />;
}
