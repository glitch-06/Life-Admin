import { Link } from "@tanstack/react-router";
import { FileText, Home, ListChecks, Plus, Search } from "lucide-react";
import { useAddModal } from "@/lib/add-modal";

export function MobileNavigation() {
  const { open } = useAddModal();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-end justify-between px-2 py-1.5">
        <li className="flex-1">
          <Link
            to="/app"
            activeOptions={{ exact: true }}
            className="flex min-h-11 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-muted-foreground"
            activeProps={{ className: "text-primary" }}
          >
            <Home className="size-5" aria-hidden="true" />
            Home
          </Link>
        </li>
        <li className="flex-1">
          <Link
            to="/app/tasks"
            className="flex min-h-11 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-muted-foreground"
            activeProps={{ className: "text-primary" }}
          >
            <ListChecks className="size-5" aria-hidden="true" />
            Tasks
          </Link>
        </li>
        <li className="flex-1">
          <button
            type="button"
            onClick={open}
            className="mx-auto flex min-h-11 w-full flex-col items-center gap-1 px-2 py-1 text-xs font-medium text-foreground"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift">
              <Plus className="size-5" aria-hidden="true" />
            </span>
            <span className="sr-only">Add something</span>
          </button>
        </li>
        <li className="flex-1">
          <Link
            to="/app/documents"
            className="flex min-h-11 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-muted-foreground"
            activeProps={{ className: "text-primary" }}
          >
            <FileText className="size-5" aria-hidden="true" />
            Docs
          </Link>
        </li>
        <li className="flex-1">
          <Link
            to="/app/search"
            className="flex min-h-11 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-muted-foreground"
            activeProps={{ className: "text-primary" }}
          >
            <Search className="size-5" aria-hidden="true" />
            Search
          </Link>
        </li>
      </ul>
    </nav>
  );
}
