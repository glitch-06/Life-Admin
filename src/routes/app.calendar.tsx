import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { PriorityDot } from "@/components/Priority";
import { EmptyState } from "@/components/States";
import { Button } from "@/components/ui/button";
import { formatLong, relativeLabel, today } from "@/lib/dates";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Life Admin" },
      { name: "description", content: "See your deadlines laid out month by month." },
      { property: "og:title", content: "Calendar — Life Admin" },
      { property: "og:description", content: "See your deadlines laid out month by month." },
    ],
  }),
  component: CalendarPage,
});

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function isoDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function CalendarPage() {
  const { events } = useAppStore();
  const start = today();
  const [month, setMonth] = useState(start.getMonth());
  const [year, setYear] = useState(start.getFullYear());
  const [selected, setSelected] = useState<string | null>(null);

  const byDate = useMemo(() => {
    const map = new Map<string, typeof events>();
    for (const event of events) {
      if (!event.deadline || event.status === "handled") continue;
      const list = map.get(event.deadline) ?? [];
      list.push(event);
      map.set(event.deadline, list);
    }
    return map;
  }, [events]);

  const upcoming = useMemo(
    () =>
      events
        .filter((event) => event.deadline && event.status !== "handled")
        .sort((a, b) => (a.deadline ?? "").localeCompare(b.deadline ?? ""))
        .slice(0, 6),
    [events],
  );

  const firstDay = new Date(year, month, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(
    firstDay,
  );

  function shift(delta: number) {
    const next = new Date(year, month + delta, 1);
    setMonth(next.getMonth());
    setYear(next.getFullYear());
    setSelected(null);
  }

  const selectedEvents = selected ? (byDate.get(selected) ?? []) : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" description="Your deadlines at a glance." />

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="surface-card p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">{monthLabel}</h2>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" aria-label="Previous month" onClick={() => shift(-1)}>
                <ChevronLeft />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Next month" onClick={() => shift(1)}>
                <ChevronRight />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: offset }).map((_, index) => (
              <div key={`pad-${index}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const iso = isoDate(year, month, day);
              const dayEvents = byDate.get(iso) ?? [];
              const isToday = iso === start.toISOString().slice(0, 10);
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelected(iso)}
                  aria-label={`${formatLong(iso)}${dayEvents.length ? `, ${dayEvents.length} deadline${dayEvents.length > 1 ? "s" : ""}` : ", no deadlines"}`}
                  aria-pressed={selected === iso}
                  className={cn(
                    "flex min-h-11 flex-col items-center justify-center gap-1 rounded-lg border border-transparent p-1 text-sm transition-colors hover:bg-accent",
                    isToday && "border-border font-semibold",
                    selected === iso && "bg-accent text-accent-foreground",
                  )}
                >
                  <span>{day}</span>
                  <span className="flex h-2 gap-0.5">
                    {dayEvents.slice(0, 3).map((event) => (
                      <PriorityDot key={event.id} priority={event.priority} />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="space-y-4">
          <section className="surface-card space-y-3 p-5">
            <h2 className="text-base font-semibold">
              {selected ? formatLong(selected) : "Pick a date"}
            </h2>
            {selected && selectedEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing due on this day.</p>
            ) : null}
            {!selected ? (
              <p className="text-sm text-muted-foreground">
                Select a day to see what's due.
              </p>
            ) : null}
            <ul className="space-y-2">
              {selectedEvents.map((event) => (
                <li key={event.id} className="flex items-center gap-2 text-sm">
                  <PriorityDot priority={event.priority} />
                  <Link to="/app/tasks/$id" params={{ id: event.id }} className="hover:underline">
                    {event.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">Upcoming deadlines</h2>
            {upcoming.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="Your calendar is clear."
                description="No upcoming deadlines right now."
              />
            ) : (
              <ul className="space-y-2">
                {upcoming.map((event) => (
                  <li key={event.id} className="surface-card flex items-center gap-3 p-4">
                    <PriorityDot priority={event.priority} />
                    <div className="min-w-0 flex-1">
                      <Link
                        to="/app/tasks/$id"
                        params={{ id: event.id }}
                        className="block truncate text-sm font-medium hover:underline"
                      >
                        {event.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {event.deadline
                          ? `${formatLong(event.deadline)} · ${relativeLabel(event.deadline)}`
                          : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
