import { demoReminders } from "@/lib/mock-data";
import type { Reminder } from "@/lib/types";

const delay = (ms = 250) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Mock reminder API. Replace with GET/POST /api/reminders + scheduling worker. */
export const reminderService = {
  async list(): Promise<Reminder[]> {
    await delay();
    return demoReminders;
  },
  async create(input: Omit<Reminder, "id" | "status">): Promise<Reminder> {
    await delay();
    return { ...input, id: `rem_${Date.now()}`, status: "scheduled" };
  },
};
