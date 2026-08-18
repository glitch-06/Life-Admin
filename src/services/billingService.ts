import type { Plan } from "@/lib/types";

const delay = (ms = 250) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export interface Subscription {
  plan: Plan;
  priceMonthly: number;
  documentsUsed: number;
  documentsIncluded: number | null;
}

export const proFeatures = [
  "Unlimited documents",
  "Unlimited reminders",
  "Smart search",
  "Email forwarding",
  "Automatic detection",
  "Advanced organization",
];

export const freeFeatures = [
  "10 documents",
  "Basic analysis",
  "3 active reminders",
  "Basic search",
  "Manual upload",
];

/** Mock billing. Replace with POST /api/billing/create-checkout + provider webhooks. */
export const billingService = {
  async getSubscription(): Promise<Subscription> {
    await delay();
    return { plan: "free", priceMonthly: 0, documentsUsed: 7, documentsIncluded: 10 };
  },
};
