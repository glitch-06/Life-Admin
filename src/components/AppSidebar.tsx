import { Link } from "@tanstack/react-router";
import {
  CalendarDays,
  ChevronsLeft,
  CreditCard,
  FileText,
  HelpCircle,
  Inbox,
  LayoutDashboard,
  ListChecks,
  Search,
  Settings,
  Shapes,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const primaryNav: NavItem[] = [
  { to: "/app", label: "Overview", icon: LayoutDashboard },
  { to: "/app/inbox", label: "Inbox", icon: Inbox },
  { to: "/app/tasks", label: "Tasks", icon: ListChecks },
  { to: "/app/documents", label: "Documents", icon: FileText },
  { to: "/app/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/app/search", label: "Search", icon: Search },
  { to: "/app/categories", label: "Categories", icon: Shapes },
];

export const secondaryNav: NavItem[] = [
  { to: "/app/settings", label: "Settings", icon: Settings },
  { to: "/app/billing", label: "Billing", icon: CreditCard },
];

function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const link = (
    <Link
      to={item.to}
      activeOptions={{ exact: item.to === "/app" }}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        collapsed && "justify-center px-0",
      )}
      activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
    >
      <item.icon className="size-4 shrink-0" aria-hidden="true" />
      {collapsed ? <span className="sr-only">{item.label}</span> : <span>{item.label}</span>}
    </Link>
  );

  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

export function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { user } = useAppStore();
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:flex",
        collapsed ? "w-[76px]" : "w-64",
      )}
    >
      <div className={cn("flex h-16 items-center px-4", collapsed && "justify-center px-0")}>
        <Link to="/app" className="rounded-md">
          <Logo compact={collapsed} />
          <span className="sr-only">Life Admin overview</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4" aria-label="Main">
        {primaryNav.map((item) => (
          <NavLink key={item.to} item={item} collapsed={collapsed} />
        ))}
        <div className="my-3 border-t border-sidebar-border" />
        {secondaryNav.map((item) => (
          <NavLink key={item.to} item={item} collapsed={collapsed} />
        ))}
        <NavLink
          item={{ to: "/app/help", label: "Help", icon: HelpCircle }}
          collapsed={collapsed}
        />
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
            aria-hidden="true"
          >
            {initials}
          </span>
          {collapsed ? null : (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="text-xs capitalize text-muted-foreground">{user.plan} plan</p>
            </div>
          )}
        </div>
        {collapsed ? null : (
          <Button asChild variant="outline" size="sm" className="mt-3 w-full">
            <Link to="/app/billing">Upgrade</Link>
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn("mt-2 w-full justify-start gap-2", collapsed && "justify-center")}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronsLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
          {collapsed ? null : "Collapse"}
        </Button>
      </div>
    </aside>
  );
}
