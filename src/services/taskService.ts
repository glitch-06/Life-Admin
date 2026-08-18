import { demoEvents } from "@/lib/mock-data";
import type { LifeEvent } from "@/lib/types";

const delay = (ms = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Mock task/event API. Replace with GET/POST/PATCH /api/tasks. */
export const taskService = {
  async list(): Promise<LifeEvent[]> {
    await delay();
    return demoEvents;
  },
  async get(id: string): Promise<LifeEvent | undefined> {
    await delay(200);
    return demoEvents.find((event) => event.id === id);
  },
};
