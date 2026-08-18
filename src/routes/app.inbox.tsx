import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Inbox as InboxIcon, Mail, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState, ListSkeleton } from "@/components/States";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAddModal } from "@/lib/add-modal";
import { relativeLabel } from "@/lib/dates";
import { useAppStore } from "@/lib/store";
import type { InboxStatus } from "@/lib/types";

export const Route = createFileRoute("/app/inbox")({
  head: () => ({
    meta: [
      { title: "Inbox — Life Admin" },
      {
        name: "description",
        content: "Things Life Admin has found that may need your attention.",
      },
      { property: "og:title", content: "Inbox — Life Admin" },
      { property: "og:description", content: "Review what we found before it becomes urgent." },
    ],
  }),
  component: InboxPage,
});

const tabs: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "needs_review", label: "Needs review" },
  { value: "processed", label: "Processed" },
  { value: "ignored", label: "Ignored" },
];

const statusLabels: Record<InboxStatus, string> = {
  needs_review: "Needs review",
  processed: "Processed",
  ignored: "Ignored",
};

function InboxPage() {
  const { inbox, setInboxStatus } = useAppStore();
  const { open } = useAddModal();
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const items = inbox.filter((item) => (tab === "all" ? true : item.status === tab));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inbox"
        description="Things Life Admin has found that may need your attention."
        actions={
          <Button onClick={open}>
            <Plus aria-hidden="true" />
            Add something
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          {tabs.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {loading ? (
        <ListSkeleton count={4} lines={2} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={InboxIcon}
          title="Your inbox is clean."
          description="Nothing is waiting for review. Anything new will show up here."
          action={<Button onClick={open}>Add something</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="surface-card p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-xs capitalize text-muted-foreground">
                      {item.source === "email" ? (
                        <Mail className="size-3" aria-hidden="true" />
                      ) : (
                        <Upload className="size-3" aria-hidden="true" />
                      )}
                      {item.source}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {item.detected}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {statusLabels[item.status]}
                    </span>
                  </div>
                  <h2 className="text-sm font-semibold">{item.title}</h2>
                  <p className="text-sm text-muted-foreground">{item.preview}</p>
                  <p className="text-xs text-muted-foreground">{relativeLabel(item.receivedAt)}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {item.documentId ? (
                    <Button asChild variant="outline" size="sm">
                      <Link to="/app/documents/$id" params={{ id: item.documentId }}>
                        Review
                      </Link>
                    </Button>
                  ) : null}
                  {item.status !== "ignored" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setInboxStatus(item.id, "ignored");
                        toast("Document moved to ignored.");
                      }}
                    >
                      Ignore
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setInboxStatus(item.id, "needs_review");
                        toast("Moved back to needs review.");
                      }}
                    >
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
