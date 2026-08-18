import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  defaultNotificationSettings,
  demoDocuments,
  demoEvents,
  demoInbox,
  demoIntegrations,
  demoReminders,
  demoUser,
} from "./mock-data";
import type {
  InboxItem,
  InboxStatus,
  Integration,
  LifeDocument,
  LifeEvent,
  NotificationSettings,
  Reminder,
  User,
} from "./types";

/**
 * Client-side application state backed by mock data.
 * All mutations are local; each one maps to a future API call.
 */
interface AppState {
  user: User;
  documents: LifeDocument[];
  events: LifeEvent[];
  inbox: InboxItem[];
  reminders: Reminder[];
  integrations: Integration[];
  notifications: NotificationSettings;
  setEventStatus: (id: string, status: LifeEvent["status"]) => void;
  deleteEvent: (id: string) => void;
  updateEvent: (id: string, patch: Partial<LifeEvent>) => void;
  addDocument: (doc: LifeDocument, events?: LifeEvent[]) => void;
  setInboxStatus: (id: string, status: InboxStatus) => void;
  addReminder: (reminder: Omit<Reminder, "id" | "status" | "userId">) => void;
  setNotifications: (patch: Partial<NotificationSettings>) => void;
  updateUser: (patch: Partial<User>) => void;
}

const AppStoreContext = createContext<AppState | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(demoUser);
  const [documents, setDocuments] = useState<LifeDocument[]>(demoDocuments);
  const [events, setEvents] = useState<LifeEvent[]>(demoEvents);
  const [inbox, setInbox] = useState<InboxItem[]>(demoInbox);
  const [reminders, setReminders] = useState<Reminder[]>(demoReminders);
  const [integrations] = useState<Integration[]>(demoIntegrations);
  const [notifications, setNotificationsState] = useState<NotificationSettings>(
    defaultNotificationSettings,
  );

  const setEventStatus = useCallback((id: string, status: LifeEvent["status"]) => {
    setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, status } : event)));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }, []);

  const updateEvent = useCallback((id: string, patch: Partial<LifeEvent>) => {
    setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, ...patch } : event)));
  }, []);

  const addDocument = useCallback((doc: LifeDocument, newEvents: LifeEvent[] = []) => {
    setDocuments((prev) => [doc, ...prev]);
    if (newEvents.length) setEvents((prev) => [...newEvents, ...prev]);
  }, []);

  const setInboxStatus = useCallback((id: string, status: InboxStatus) => {
    setInbox((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  }, []);

  const addReminder = useCallback((reminder: Omit<Reminder, "id" | "status" | "userId">) => {
    setReminders((prev) => [
      ...prev,
      { ...reminder, id: `rem_${prev.length + 1}_${reminder.eventId}`, status: "scheduled", userId: demoUser.id },
    ]);
  }, []);

  const setNotifications = useCallback((patch: Partial<NotificationSettings>) => {
    setNotificationsState((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo<AppState>(
    () => ({
      user,
      documents,
      events,
      inbox,
      reminders,
      integrations,
      notifications,
      setEventStatus,
      deleteEvent,
      updateEvent,
      addDocument,
      setInboxStatus,
      addReminder,
      setNotifications,
      updateUser,
    }),
    [
      user,
      documents,
      events,
      inbox,
      reminders,
      integrations,
      notifications,
      setEventStatus,
      deleteEvent,
      updateEvent,
      addDocument,
      setInboxStatus,
      addReminder,
      setNotifications,
      updateUser,
    ],
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): AppState {
  const context = useContext(AppStoreContext);
  if (!context) throw new Error("useAppStore must be used inside AppStoreProvider");
  return context;
}
