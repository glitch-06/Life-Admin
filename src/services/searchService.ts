import type { SearchAnswer } from "@/lib/types";

const delay = (ms = 700) => new Promise<void>((resolve) => setTimeout(resolve, ms));

interface Rule {
  keywords: string[];
  answer: string[];
  sources: { documentId: string; label: string }[];
}

const rules: Rule[] = [
  {
    keywords: ["insurance", "expire", "renew", "premium", "increase"],
    answer: [
      "Your current policy is scheduled to renew on September 14, 2026.",
      "Your renewal decision deadline is September 10, 2026.",
      "Your premium increased by $253, from $1,420 to $1,673.",
    ],
    sources: [{ documentId: "doc_insurance_renewal", label: "Car Insurance Renewal.pdf" }],
  },
  {
    keywords: ["bill", "due", "pay", "month"],
    answer: [
      "You have one bill due this month: electricity, $124, due August 19, 2026.",
      "Your amount went up by $15 compared with July.",
    ],
    sources: [{ documentId: "doc_electricity_bill", label: "Northline August Statement.pdf" }],
  },
  {
    keywords: ["warranty", "coverage", "covered"],
    answer: [
      "One warranty is active: your laptop, covered until March 14, 2027.",
      "Nothing is expiring in the next 90 days.",
    ],
    sources: [{ documentId: "doc_laptop_warranty", label: "Warranty Certificate.pdf" }],
  },
  {
    keywords: ["apartment", "lease", "rent", "home", "landlord"],
    answer: [
      "Your lease renewal decision is due September 28, 2026.",
      "Monthly rent would go from $1,950 to $2,040.",
      "Your electricity bill for August is $124, due August 19.",
    ],
    sources: [
      { documentId: "doc_apartment_lease", label: "Lease Renewal Notice.pdf" },
      { documentId: "doc_electricity_bill", label: "Northline August Statement.pdf" },
    ],
  },
  {
    keywords: ["subscription", "streaming", "recurring"],
    answer: [
      "One subscription renews next month: Lumen Stream on September 3, 2026, at $17.99/month.",
    ],
    sources: [{ documentId: "doc_streaming_subscription", label: "Lumen Stream Renewal.pdf" }],
  },
  {
    keywords: ["return", "refund", "headphones", "order"],
    answer: [
      "Your headphones return window closes on August 20, 2026 — that's 2 days away.",
      "You can still return them for a full refund until then.",
    ],
    sources: [{ documentId: "doc_amazon_order", label: "Order 114-2938471.pdf" }],
  },
  {
    keywords: ["car", "vehicle", "registration", "dmv"],
    answer: [
      "Your vehicle registration expires October 2, 2026.",
      "Your car insurance renewal decision is due September 10, 2026.",
    ],
    sources: [
      { documentId: "doc_vehicle_registration", label: "Vehicle Registration.pdf" },
      { documentId: "doc_insurance_renewal", label: "Car Insurance Renewal.pdf" },
    ],
  },
];

/** Mock answer engine. Replace with POST /api/search backed by real retrieval. */
export const searchService = {
  async ask(question: string): Promise<SearchAnswer> {
    await delay();
    const q = question.toLowerCase();
    let best: Rule | null = null;
    let bestScore = 0;
    for (const rule of rules) {
      const score = rule.keywords.filter((keyword) => q.includes(keyword)).length;
      if (score > bestScore) {
        best = rule;
        bestScore = score;
      }
    }
    if (!best) {
      return {
        question,
        answer: [
          "We couldn't find anything saved that answers that yet.",
          "Try asking about your insurance, bills, lease, warranties, returns or subscriptions.",
        ],
        sources: [],
      };
    }
    return { question, answer: best.answer, sources: best.sources };
  },
};
