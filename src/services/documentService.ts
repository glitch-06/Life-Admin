import { categories, categoryItemCounts, demoDocuments, demoInbox } from "@/lib/mock-data";
import type { Category, InboxItem, LifeDocument } from "@/lib/types";

const delay = (ms = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export interface ProcessingStep {
  id: string;
  label: string;
}

export const processingSteps: ProcessingStep[] = [
  { id: "read", label: "Reading document" },
  { id: "type", label: "Identifying document type" },
  { id: "dates", label: "Finding important dates" },
  { id: "actions", label: "Looking for required actions" },
  { id: "reminders", label: "Creating reminders" },
];

/** Mock document API. Replace with Supabase Storage + PostgreSQL queries. */
export const documentService = {
  async list(): Promise<LifeDocument[]> {
    await delay();
    return demoDocuments;
  },
  async get(id: string): Promise<LifeDocument | undefined> {
    await delay(200);
    return demoDocuments.find((doc) => doc.id === id);
  },
  async listInbox(): Promise<InboxItem[]> {
    await delay();
    return demoInbox;
  },
  async listCategories(): Promise<Category[]> {
    await delay(150);
    return categories;
  },
  async categoryCounts(): Promise<Record<string, number>> {
    await delay(150);
    return categoryItemCounts;
  },
};
