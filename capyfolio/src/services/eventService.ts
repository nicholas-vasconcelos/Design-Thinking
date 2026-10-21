import type { Event } from '../types';
import eventsData from '../data/events.json';

const STORAGE_KEY = 'capyfolio_events';

const readEvents = async (): Promise<Event[]> => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    return JSON.parse(raw) as Event[];
  }
  const seeded = eventsData as Event[];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
};

export const eventService = {
  async list(): Promise<Event[]> {
    return readEvents();
  },

  async getById(id: string): Promise<Event | undefined> {
    const events = await readEvents();
    return events.find((event) => event.id === id);
  },

  async update(event: Event): Promise<Event> {
    const events = await readEvents();
    const idx = events.findIndex((entry) => entry.id === event.id);
    if (idx === -1) return event;
    events[idx] = event;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return event;
  },
};
