import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Car,
  Check,
  FileSignature,
  Folder,
  Home,
  Landmark,
  Repeat,
  ShieldCheck,
  ShoppingBag,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriorityChip, PriorityDot } from "@/components/Priority";
import { deadlineBadge, formatCurrency, formatLong, relativeLabel } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { Category, LifeDocument, LifeEvent } from "@/lib/types";

export const categoryIcons: Record<string, LucideIcon> = {
  home: Home,
  car: Car,
  money: Wallet,
  purchases: ShoppingBag,
  insurance: ShieldCheck,
  subscriptions: Repeat,
  contracts: FileSignature,
  government: Landmark,
  other: Folder,
};

export function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "high" | "medium" | "success";
}) {
  const dot =
    tone === "high" ? "bg-high" : tone === "medium" ? "bg-medium" : "bg-success";
  return (
    <div className="surface-card flex items-center gap-3 px-4 py-3.5 sm:px-5">
      <span className={cn("size-2.5 rounded-full", dot)} aria-hidden="true" />
      <div className="min-w-0">
        <p className="truncate text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
      </div>
    </div>
  );
}

export function PriorityCard({
  event,
  onHandled,
}: {
  event: LifeEvent;
  onHandled: (event: LifeEvent) => void;
}) {
  const detailTo = event.documentId ? "/app/documents/$id" : "/app/tasks/$id";
  const detailParams = event.documentId ? { id: event.documentId } : { id: event.id };

  return (
    <article
      className={cn(
        "surface-card group relative overflow-hidden p-5 transition-shadow hover:shadow-lift",
      )}
    >
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-1",
          event.priority === "high" ? "bg-high" : event.priority === "medium" ? "bg-medium" : "bg-low",
        )}
        aria-hidden="true"
      />
      <div className="flex flex-col gap-4 pl-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <PriorityDot priority={event.priority} />
            <h3 className="text-base font-semibold">{event.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{event.description}</p>
          {event.deadline ? (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{formatLong(event.deadline)}</span>{" "}
              · {relativeLabel(event.deadline)}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
          {event.priority === "high" ? (
            <PriorityChip priority="high" label="HIGH PRIORITY" />
          ) : event.deadline ? (
            <PriorityChip priority={event.priority} label={deadlineBadge(event.deadline)} />
          ) : (
            <PriorityChip priority={event.priority} />
          )}

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to={detailTo} params={detailParams}>
                View details
              </Link>
            </Button>
            <Button size="sm" onClick={() => onHandled(event)}>
              <Check aria-hidden="true" />
              Mark handled
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function DeadlineCard({ event }: { event: LifeEvent }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
      <PriorityDot priority={event.priority} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{event.title}</p>
        <p className="text-sm text-muted-foreground">{event.description}</p>
      </div>
      {event.amount ? (
        <span className="shrink-0 text-sm font-semibold tabular-nums">
          {formatCurrency(event.amount)}
        </span>
      ) : null}
    </div>
  );
}

export function DocumentCard({ document }: { document: LifeDocument }) {
  const Icon = categoryIcons[document.category] ?? Folder;
  return (
    <Link
      to="/app/documents/$id"
      params={{ id: document.id }}
      className="surface-card block p-5 transition-shadow hover:shadow-lift focus-visible:shadow-lift"
    >
      <div className="flex items-start gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="truncate text-sm font-semibold">{document.title}</h3>
            <span className="rounded-full border border-border px-2 py-0.5 text-xs capitalize text-muted-foreground">
              {document.type}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{document.company}</p>
          <p className="text-sm text-muted-foreground">{document.summary}</p>
          <p className="text-xs text-muted-foreground">
            Added {formatLong(document.receivedAt)}
          </p>
        </div>
        <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </div>
    </Link>
  );
}

export function CategoryCard({ category, count }: { category: Category; count: number }) {
  const Icon = categoryIcons[category.id] ?? Folder;
  return (
    <Link
      to="/app/categories/$category"
      params={{ category: category.id }}
      className="surface-card flex items-center gap-4 p-5 transition-shadow hover:shadow-lift"
    >
      <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="font-semibold">{category.name}</p>
        <p className="text-sm text-muted-foreground">{count} items</p>
      </div>
    </Link>
  );
}
