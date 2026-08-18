/**
 * Frontend service layer.
 *
 * Every service returns a promise so that the mock implementations below can be
 * swapped for real API / Supabase calls without touching any UI component.
 * Conceptual backend contract (not yet implemented):
 *   GET/POST /api/documents, GET /api/documents/:id, POST /api/process-document,
 *   GET/POST/PATCH /api/tasks, GET/POST /api/reminders, POST /api/search,
 *   GET /api/categories, GET /api/integrations, GET /api/billing/subscription
 */
export * from "./authService";
export * from "./documentService";
export * from "./taskService";
export * from "./searchService";
export * from "./reminderService";
export * from "./billingService";
