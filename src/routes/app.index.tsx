import { useEffect, useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, Lock, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { PriorityCard, StatCard } from "@/components/cards";
import { PriorityDot } from "@/components/Priority";
import { EmptyState, ListSkeleton } from "@/components/States";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddModal } from "@/lib/add-modal";
import { daysUntil, formatCurrency, relativeLabel } from "@/lib/dates";
import { useAppStore } from "@/lib/store";
import type { LifeEvent } from "@/lib/types";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Overview — Life Admin" },
      { name: "description", content: "See what needs your attention today, and what's coming up." },
      { property: "og:title", content: "Overview — Life Admin" },
      { property: "og:description", content: "See what needs your attention today." },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { user, events, setEventStatus } = useAppStore();
  const { open } = useAddModal();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  const openEvents = useMemo(
    () =>
      events
        .filter((event) => event.status === "open")
        .sort((a, b) => (a.deadline ?? "").localeCompare(b.deadline ?? "")),
    [events],
  );

  const needsAttention = openEvents.filter(
    (event) => event.priority === "high" || (event.deadline && daysUntil(event.deadline) <= 7),
  );
  const comingUp = openEvents.filter((event) => !needsAttention.includes(event));
  const completed = events.filter((event) => event.status === "handled").length + 10;

  function handleHandled(event: LifeEvent) {
    setEventStatus(event.id, "handled");
    toast.success(`"${event.title}" marked as handled.`);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Good morning, ${user.name.split(" ")[0]}`}
        description="Here's what needs your attention."
        actions={
          <Button onClick={open} className="sm:hidden">
            <Plus aria-hidden="true" />
            Add something
          </Button>
        }
      />

      <section aria-label="Summary" className="grid gap-3 sm:grid-cols-3">
        {loading ? (
          <>
            <Skeleton className="h-[74px] rounded-xl" />
            <Skeleton className="h-[74px] rounded-xl" />
            <Skeleton className="h-[74px] rounded-xl" />
          </>
        ) : (
          <>
            <StatCard label="Needs attention" value={needsAttention.length} tone="high" />
            <StatCard label="Coming up" value={comingUp.length} tone="medium" />
            <StatCard label="Completed" value={completed} tone="success" />
          </>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          {needsAttention.length === 0
            ? "Nothing needs your attention"
            : `You have ${needsAttention.length} ${needsAttention.length === 1 ? "thing" : "things"} to deal with`}
        </h2>
        {loading ? (
          <ListSkeleton count={3} lines={3} />
        ) : needsAttention.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="You're all caught up."
            description="Nothing needs your attention right now. We'll tell you when something does."
          />
        ) : (
          <div className="space-y-3">
            {needsAttention.map((event) => (
              <PriorityCard key={event.id} event={event} onHandled={handleHandled} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upcoming</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/calendar">View calendar</Link>
          </Button>
        </div>
        {loading ? (
          <ListSkeleton count={3} lines={1} />
        ) : comingUp.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Your calendar is clear."
            description="No upcoming deadlines. Add something and we'll keep track of the dates."
          />
        ) : (
          <ol className="space-y-3">
            <li className="surface-card flex items-baseline gap-4 p-4">
              <span className="w-24 shrink-0 text-sm font-medium text-muted-foreground">Today</span>
              <span className="text-sm text-muted-foreground">Nothing urgent.</span>
            </li>
            {comingUp.map((event) => (
              <li key={event.id} className="surface-card flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:gap-4">
                <span className="w-24 shrink-0 text-sm font-medium text-muted-foreground">
                  {event.deadline ? relativeLabel(event.deadline) : "No date"}
                </span>
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <PriorityDot priority={event.priority} />
                  <Link
                    to="/app/tasks/$id"
                    params={{ id: event.id }}
                    className="truncate text-sm font-medium hover:underline"
                  >
                    {event.title}
                  </Link>
                </span>
                <span className="text-sm text-muted-foreground">
                  {event.amount ? formatCurrency(event.amount) : event.description}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="size-3.5" aria-hidden="true" />
        Your documents are private to your account.
      </p>
    </div>
  );
}
