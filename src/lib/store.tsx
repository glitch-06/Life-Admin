import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultNotificationSettings,
  demoDocuments,
  demoEvents,
  demoInbox,
  demoIntegrations,
  demoReminders,
  demoUser,
} from "./mock-data";
import { supabase } from "./supabase";
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
  addReminder: (
    reminder: Omit<Reminder, "id" | "status" | "userId">
  ) => void;
  setNotifications: (patch: Partial<NotificationSettings>) => void;
  updateUser: (patch: Partial<User>) => void;
}

const AppStoreContext = createContext<AppState | null>(null);

async function loadAuthenticatedUser(): Promise<User | null> {
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("Failed to get authenticated user:", authError);
    return null;
  }

  if (!authUser) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, name, email, avatar, plan, created_at")
    .eq("id", authUser.id)
    .single();

  if (profileError) {
    console.error("Failed to load user profile:", profileError);

    return {
      id: authUser.id,
      name:
        authUser.user_metadata?.name ||
        authUser.email?.split("@")[0] ||
        "User",
      email: authUser.email || "",
      avatar: authUser.user_metadata?.avatar_url || null,
      plan: "free",
      createdAt: authUser.created_at,
    };
  }

  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    avatar: profile.avatar || null,
    plan: profile.plan === "pro" ? "pro" : "free",
    createdAt: profile.created_at,
  };
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(demoUser);

  const [documents, setDocuments] =
    useState<LifeDocument[]>(demoDocuments);

  const [events, setEvents] =
    useState<LifeEvent[]>(demoEvents);

  const [inbox, setInbox] =
    useState<InboxItem[]>(demoInbox);

  const [reminders, setReminders] =
    useState<Reminder[]>(demoReminders);

  const [integrations] =
    useState<Integration[]>(demoIntegrations);

  const [notifications, setNotificationsState] =
    useState<NotificationSettings>(
      defaultNotificationSettings,
    );

  useEffect(() => {
    let mounted = true;

    async function initializeUser() {
      const authenticatedUser = await loadAuthenticatedUser();

      if (mounted && authenticatedUser) {
        setUser(authenticatedUser);
      }
    }

    void initializeUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_OUT" || !session?.user) {
        setUser(demoUser);
        return;
      }

      const authenticatedUser = await loadAuthenticatedUser();

      if (mounted && authenticatedUser) {
        setUser(authenticatedUser);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const setEventStatus = useCallback(
    (id: string, status: LifeEvent["status"]) => {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === id ? { ...event, status } : event,
        ),
      );
    },
    [],
  );

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) =>
      prev.filter((event) => event.id !== id),
    );
  }, []);

  const updateEvent = useCallback(
    (id: string, patch: Partial<LifeEvent>) => {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === id
            ? { ...event, ...patch }
            : event,
        ),
      );
    },
    [],
  );

  const addDocument = useCallback(
    (doc: LifeDocument, newEvents: LifeEvent[] = []) => {
      setDocuments((prev) => [doc, ...prev]);

      if (newEvents.length) {
        setEvents((prev) => [...newEvents, ...prev]);
      }
    },
    [],
  );

  const setInboxStatus = useCallback(
    (id: string, status: InboxStatus) => {
      setInbox((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status } : item,
        ),
      );
    },
    [],
  );

  const addReminder = useCallback(
    (
      reminder: Omit<Reminder, "id" | "status" | "userId">,
    ) => {
      setReminders((prev) => [
        ...prev,
        {
          ...reminder,
          id: `rem_${prev.length + 1}_${reminder.eventId}`,
          status: "scheduled",
          userId: user.id,
        },
      ]);
    },
    [user.id],
  );

  const setNotifications = useCallback(
    (patch: Partial<NotificationSettings>) => {
      setNotificationsState((prev) => ({
        ...prev,
        ...patch,
      }));
    },
    [],
  );

  const updateUser = useCallback(
    (patch: Partial<User>) => {
      setUser((prev) => ({
        ...prev,
        ...patch,
      }));
    },
    [],
  );

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

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore(): AppState {
  const context = useContext(AppStoreContext);

  if (!context) {
    throw new Error(
      "useAppStore must be used inside AppStoreProvider",
    );
  }

  return context;
}