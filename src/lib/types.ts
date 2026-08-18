/**
 * Core domain types for Life Admin.
 *
 * These are intentionally backend-agnostic: they map cleanly onto future
 * Supabase tables (users, documents, events, reminders, categories) without
 * depending on the shape of the current mock data.
 */

export type Plan = "free" | "pro";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  plan: Plan;
  createdAt: string;
}

export type CategoryId =
  | "home"
  | "car"
  | "money"
  | "purchases"
  | "insurance"
  | "subscriptions"
  | "contracts"
  | "government"
  | "other";

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
}

export type DocumentType =
  | "bill"
  | "insurance"
  | "contract"
  | "receipt"
  | "warranty"
  | "government"
  | "other";

export type DocumentSource = "email" | "upload" | "photo" | "text" | "forward";

export type DocumentStatus = "needs_review" | "processed" | "handled" | "ignored";

export interface LifeDocument {
  id: string;
  userId: string;
  title: string;
  type: DocumentType;
  category: CategoryId;
  company: string;
  source: DocumentSource;
  fileUrl: string | null;
  fileName: string;
  receivedAt: string;
  status: DocumentStatus;
  summary: string;
  meaning: string;
  whatChanged?: { label: string; previous: string; current: string; delta: string };
  requiredAction?: string;
  ifYouDoNothing?: string;
}

export type Priority = "high" | "medium" | "low";
export type EventStatus = "open" | "handled" | "snoozed";

export interface LifeEvent {
  id: string;
  documentId: string | null;
  userId: string;
  title: string;
  description: string;
  deadline: string | null;
  priority: Priority;
  amount: number | null;
  previousAmount: number | null;
  status: EventStatus;
  category: CategoryId;
  sourceLabel: string;
}

export type ReminderChannel = "email" | "browser";
export type ReminderStatus = "scheduled" | "sent" | "cancelled";

export interface Reminder {
  id: string;
  eventId: string;
  userId: string;
  reminderDate: string;
  channel: ReminderChannel;
  status: ReminderStatus;
}

export type InboxStatus = "needs_review" | "processed" | "ignored";

export interface InboxItem {
  id: string;
  userId: string;
  title: string;
  source: DocumentSource;
  detected: string;
  status: InboxStatus;
  receivedAt: string;
  preview: string;
  documentId: string | null;
}

export interface SearchAnswer {
  question: string;
  answer: string[];
  sources: { documentId: string; label: string }[];
}

export interface NotificationSettings {
  emailReminders: boolean;
  browserNotifications: boolean;
  leadTimes: { days: number; enabled: boolean }[];
  priorityAlerts: "high" | "high_medium" | "all";
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
}
