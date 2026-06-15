import type { Event } from '@/types';

let cachedEvents: Event[] | null = null;

export async function loadEvents(): Promise<Event[]> {
  if (cachedEvents !== null) return cachedEvents;
  const response = await fetch('/data/events.json');
  const data = await response.json();
  cachedEvents = data.map((e: any) => ({
    ...e,
    date: new Date(e.date),
    endDate: e.endDate ? new Date(e.endDate) : undefined,
    images: e.images || ['/images/events/default-event.jpg'],
    coordinates: e.coordinates && Array.isArray(e.coordinates) && e.coordinates.length === 2
      ? ([e.coordinates[0], e.coordinates[1]] as [number, number])
      : (e.latitude && e.longitude ? [e.latitude, e.longitude] as [number, number] : undefined),
  }));
  return cachedEvents || [];
}

export function getEventsSync(): Event[] {
  return cachedEvents || [];
}

export function getEventBySlug(slug: string): Event | undefined {
  return cachedEvents?.find(e => e.slug === slug);
}

export function getEventsByYear(year: number): Event[] {
  return cachedEvents?.filter(e => e.date.getFullYear() === year) || [];
}

export function getEventsByType(type: string): Event[] {
  return cachedEvents?.filter(e => e.type === type) || [];
}

export function getEventsInRange(start: Date, end: Date): Event[] {
  return cachedEvents?.filter(e => e.date >= start && e.date <= end) || [];
}

export function getDateRange(events: Event[]): { min: Date; max: Date } {
  if (!events.length) return { min: new Date('1941-06-22'), max: new Date('1945-09-02') };
  return {
    min: new Date(Math.min(...events.map(e => e.date.getTime()))),
    max: new Date(Math.max(...events.map(e => e.date.getTime()))),
  };
}
