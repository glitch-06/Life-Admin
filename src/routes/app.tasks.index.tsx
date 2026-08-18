import { useEffect, useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { PriorityChip } from "@/components/Priority";
import { EmptyState, ListSkeleton } from "@/components/States";
import { ConfirmationModal, EditTaskModal } from "@/components/modals";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { daysUntil, formatLong } from "@/lib/dates";
import { useAppStore } from "@/lib/store";
import type { LifeEvent } from "@/lib/types";

export const Route = createFileRoute("/app/tasks/")({
  head: () => ({
    meta: [
      { title: "Tasks — Life Admin" },
      { name: "description", content: "Everything you need to handle, grouped by when it's due." },
      { property: "og:title", content: "Tasks — Life Admin" },
      { property: "og:description", content: "Everything you need to handle, in one list." },
    ],
  }),
  component: TasksPage,
});

function group(events: LifeEvent[]) {
  const today: LifeEvent[] = [];
  const week: LifeEvent[] = [];
  const later: LifeEvent[] = [];
  for (const event of events) {
    const days = event.deadline ? daysUntil(event.deadline) : 999;
    if (days <= 1) today.push(event);
    else if (days <= 7) week.push(event);
    else later.push(event);
  }
  return [
    { title: "Today", items: today },
    { title: "This week", items: week },
    { title: "Later", items: later },
  ];
}

function TasksPage() {
  const { events, setEventStatus, deleteEvent, updateEvent } = useAppStore();
  const [tab, setTab] = useState("open");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<LifeEvent | null>(null);
  const [deleting, setDeleting] = useState<LifeEvent | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const sorted = [...events].sort((a, b) => (a.deadline ?? "").localeCompare(b.deadline ?? ""));
    if (tab === "open") return sorted.filter((event) => event.status !== "handled");
    if (tab === "completed") return sorted.filter((event) => event.status === "handled");
    return sorted;
  }, [events, tab]);

  const groups = group(filtered);

  return (
    <div className="space-y-6">
      <PageHeader title="Tasks" description="What you need to handle, and by when." />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <ListSkeleton count={4} lines={1} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="You're all caught up."
          description="Nothing needs your attention right now."
        />
      ) : (
        <div className="space-y-8">
          {groups
            .filter((section) => section.items.length > 0)
            .map((section) => (
              <section key={section.title} className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.items.map((event) => {
                    const done = event.status === "handled";
                    return (
                      <li key={event.id} className="surface-card flex items-start gap-3 p-4">
                        <Checkbox
                          className="mt-1"
                          checked={done}
                          aria-label={`Mark "${event.title}" as complete`}
                          onCheckedChange={(checked) => {
                            setEventStatus(event.id, checked ? "handled" : "open");
                            toast.success(checked ? "Task completed." : "Task reopened.");
                          }}
                        />
                        <div className="min-w-0 flex-1 space-y-1">
                          <Link
                            to="/app/tasks/$id"
                            params={{ id: event.id }}
                            className={
                              done
                                ? "text-sm font-medium text-muted-foreground line-through"
                                : "text-sm font-medium hover:underline"
                            }
                          >
                            {event.title}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {event.deadline ? `Deadline: ${formatLong(event.deadline)}` : "No deadline"}
                          </p>
                          <p className="text-xs text-muted-foreground">Source: {event.sourceLabel}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <PriorityChip priority={event.priority} className="hidden sm:inline-flex" />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" aria-label={`Actions for ${event.title}`}>
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onSelect={() => {
                                  setEventStatus(event.id, done ? "open" : "handled");
                                  toast.success(done ? "Task reopened." : "Task completed.");
                                }}
                              >
                                {done ? "Reopen" : "Complete"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => setEditing(event)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => {
                                  updateEvent(event.id, { status: "snoozed" });
                                  toast("Snoozed. We'll bring it back later.");
                                }}
                              >
                                Snooze
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => setDeleting(event)}>
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
        </div>
      )}

      <EditTaskModal open={editing !== null} onOpenChange={(open) => !open && setEditing(null)} event={editing} />
      <ConfirmationModal
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this task?"
        description="It will be removed from your list. The original document stays saved."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (deleting) deleteEvent(deleting.id);
          setDeleting(null);
          toast.success("Task deleted.");
        }}
      />
    </div>
  );
}
