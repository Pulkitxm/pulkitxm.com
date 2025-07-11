import { Experience, Event } from "@/types/profile";

let cachedExperience: Experience[] | null = null;
let cachedEvents: Event[] | null = null;

export async function getExperienceData(): Promise<Experience[]> {
  if (cachedExperience) return cachedExperience;

  try {
    const { experience } = await import("@/data/profile/experience");
    cachedExperience = experience;
    return experience;
  } catch (error) {
    console.error("Failed to load experience data:", error);
    return [];
  }
}

export async function getEventsData(): Promise<Event[]> {
  if (cachedEvents) return cachedEvents;

  try {
    const { events } = await import("@/data/profile/events");
    cachedEvents = events;
    return events;
  } catch (error) {
    console.error("Failed to load events data:", error);
    return [];
  }
}

export async function getExperienceBySlug(slug: string): Promise<Experience | null> {
  const experiences = await getExperienceData();
  return experiences.find((e) => e.slug === slug) || null;
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const events = await getEventsData();
  return events.find((e) => e.slug === slug) || null;
}
