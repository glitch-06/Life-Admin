import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bell, Check, FileText } from "lucide-react";
import { toast } from "sonner";
import { PriorityChip } from "@/components/Priority";
import { ErrorState } from "@/components/States";
import { ReminderModal } from "@/components/modals";
import { Button } from "@/components/ui/button";
import { deadlineBadge, formatCurrency, formatLong } from "@/lib/dates";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/app/tasks/$id")({
  head: () => ({
    meta: [
      { title: "Task — Life Admin" },
      { name: "description", content: "What this task is, when it's due and what happens next." },
      { property: "og:title", content: "Task — Life Admin" },
      { property: "og:description", content: "What this task is and when it's due." },
    ],
  }),
  component: TaskDetail,
});

function TaskDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { events, documents, setEventStatus } = useAppStore();
  const [reminderOpen, setReminderOpen] = useState(false);

  const event = events.find((item) => item.id === id);

  if (!event) {
    return (
      <ErrorState
        title="We couldn't find that task."
        description="It may have been completed or deleted."
        onBack={() => navigate({ to: "/app/tasks" })}
      />
    );
  }

  const document = documents.find((doc) => doc.id === event.documentId);

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/app/tasks">
          <ArrowLeft aria-hidden="true" />
          Back to tasks
        </Link>
      </Button>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <PriorityChip priority={event.priority} />
          {event.deadline ? (
            <span className="rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              {deadlineBadge(event.deadline)}
            </span>
          ) : null}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{event.title}</h1>
        <p className="text-[15px] text-muted-foreground">{event.description}</p>
      </header>

      <dl className="surface-card grid gap-4 p-5 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-muted-foreground">Deadline</dt>
          <dd className="font-medium">
            {event.deadline ? formatLong(event.deadline) : "No deadline"}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Where this came from</dt>
          <dd className="font-medium">{event.sourceLabel}</dd>
        </div>
        {event.amount ? (
          <div>
            <dt className="text-sm text-muted-foreground">Amount</dt>
            <dd className="font-medium tabular-nums">{formatCurrency(event.amount)}</dd>
          </div>
        ) : null}
        {event.previousAmount ? (
          <div>
            <dt className="text-sm text-muted-foreground">Previously</dt>
            <dd className="font-medium tabular-nums">{formatCurrency(event.previousAmount)}</dd>
          </div>
        ) : null}
      </dl>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setReminderOpen(true)} variant="outline">
          <Bell aria-hidden="true" />
          Set reminder
        </Button>
        <Button
          onClick={() => {
            setEventStatus(event.id, event.status === "handled" ? "open" : "handled");
            toast.success(event.status === "handled" ? "Task reopened." : "Task completed.");
          }}
        >
          <Check aria-hidden="true" />
          {event.status === "handled" ? "Reopen task" : "Mark handled"}
        </Button>
        {document ? (
          <Button asChild variant="ghost">
            <Link to="/app/documents/$id" params={{ id: document.id }}>
              <FileText aria-hidden="true" />
              View document
            </Link>
          </Button>
        ) : null}
      </div>

      <ReminderModal open={reminderOpen} onOpenChange={setReminderOpen} event={event} />
    </div>
  );
}
