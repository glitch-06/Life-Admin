import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bell, Check, FileText, MessageCircleQuestion } from "lucide-react";
import { toast } from "sonner";
import { ErrorState } from "@/components/States";
import { ReminderModal } from "@/components/modals";
import { Button } from "@/components/ui/button";
import { daysUntil, formatLong } from "@/lib/dates";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/app/documents/$id")({
  head: () => ({
    meta: [
      { title: "Document — Life Admin" },
      { name: "description", content: "What this document means and what you need to do." },
      { property: "og:title", content: "Document — Life Admin" },
      { property: "og:description", content: "What this document means and what to do next." },
    ],
  }),
  component: DocumentDetail,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="surface-card space-y-2 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <div className="text-[15px]">{children}</div>
    </section>
  );
}

function DocumentDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { documents, events, setEventStatus } = useAppStore();
  const [reminderOpen, setReminderOpen] = useState(false);

  const document = documents.find((doc) => doc.id === id);

  if (!document) {
    return (
      <ErrorState
        title="We couldn't find that document."
        description="It may have been removed from your account."
        onBack={() => navigate({ to: "/app/documents" })}
      />
    );
  }

  const relatedEvent = events.find((event) => event.documentId === document.id);
  const deadline = relatedEvent?.deadline ?? null;

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/app/documents">
          <ArrowLeft aria-hidden="true" />
          Back to documents
        </Link>
      </Button>

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{document.title}</h1>
        <p className="text-[15px] text-muted-foreground">
          {document.company} · <span className="capitalize">{document.type}</span> · Received{" "}
          {formatLong(document.receivedAt)}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <Section title="What this means">
            <p>{document.meaning}</p>
          </Section>

          {document.whatChanged ? (
            <Section title="What changed">
              <dl className="grid gap-3 sm:grid-cols-3">
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Previous {document.whatChanged.label.toLowerCase()}
                  </dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {document.whatChanged.previous}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    New {document.whatChanged.label.toLowerCase()}
                  </dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {document.whatChanged.current}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Increase</dt>
                  <dd className="text-lg font-semibold tabular-nums text-high">
                    {document.whatChanged.delta}
                  </dd>
                </div>
              </dl>
            </Section>
          ) : null}

          {document.requiredAction ? (
            <Section title="What you need to do">
              <p>{document.requiredAction}</p>
            </Section>
          ) : null}

          {document.ifYouDoNothing ? (
            <Section title="If you do nothing">
              <p className="text-muted-foreground">{document.ifYouDoNothing}</p>
            </Section>
          ) : null}
        </div>

        <div className="space-y-4">
          {deadline ? (
            <Section title="Deadline">
              <p className="text-lg font-semibold">{formatLong(deadline)}</p>
              <p className="text-sm text-muted-foreground">
                {Math.max(daysUntil(deadline), 0)} days remaining.
              </p>
            </Section>
          ) : null}

          <div className="surface-card space-y-2 p-5">
            <Button className="w-full" variant="outline" onClick={() => setReminderOpen(true)} disabled={!relatedEvent}>
              <Bell aria-hidden="true" />
              Set reminder
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                if (relatedEvent) setEventStatus(relatedEvent.id, "handled");
                toast.success("Marked as handled.");
              }}
            >
              <Check aria-hidden="true" />
              Mark handled
            </Button>
            <Button
              className="w-full"
              variant="ghost"
              onClick={() => toast("The original file viewer is coming soon.")}
            >
              <FileText aria-hidden="true" />
              View original document
            </Button>
            <Button asChild className="w-full" variant="ghost">
              <Link to="/app/search">
                <MessageCircleQuestion aria-hidden="true" />
                Ask about this document
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Saved as <span className="font-medium text-foreground">{document.fileName}</span>
          </p>
        </div>
      </div>

      <ReminderModal
        open={reminderOpen}
        onOpenChange={setReminderOpen}
        event={relatedEvent ?? null}
      />
    </div>
  );
}
