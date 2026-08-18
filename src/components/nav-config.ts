import {
  CalendarDays,
  CreditCard,
  FileText,
  Inbox,
  LayoutDashboard,
  ListChecks,
  Search,
  Settings,
  Shapes,
  type LucideIcon,
} from "lucide-react";

export const primaryNav = [
  { to: "/app", label: "Overview", icon: LayoutDashboard },
  { to: "/app/inbox", label: "Inbox", icon: Inbox },
  { to: "/app/tasks", label: "Tasks", icon: ListChecks },
  { to: "/app/documents", label: "Documents", icon: FileText },
  { to: "/app/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/app/search", label: "Search", icon: Search },
  { to: "/app/categories", label: "Categories", icon: Shapes },
] as const;

export const secondaryNav = [
  { to: "/app/settings", label: "Settings", icon: Settings },
  { to: "/app/billing", label: "Billing", icon: CreditCard },
] as const;

export type NavItem = { to: string; label: string; icon: LucideIcon };
