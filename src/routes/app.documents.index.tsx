import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Plus, Search as SearchIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DocumentCard } from "@/components/cards";
import { EmptyState, ListSkeleton } from "@/components/States";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddModal } from "@/lib/add-modal";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { DocumentType } from "@/lib/types";

export const Route = createFileRoute("/app/documents/")({
  head: () => ({
    meta: [
      { title: "Documents — Life Admin" },
      { name: "description", content: "Everything you've added to Life Admin, in one place." },
      { property: "og:title", content: "Documents — Life Admin" },
      { property: "og:description", content: "Everything you've added to Life Admin." },
    ],
  }),
  component: DocumentsPage,
});

const filters: { value: "all" | DocumentType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "bill", label: "Bills" },
  { value: "insurance", label: "Insurance" },
  { value: "contract", label: "Contracts" },
  { value: "receipt", label: "Receipts" },
  { value: "warranty", label: "Warranties" },
  { value: "government", label: "Government" },
  { value: "other", label: "Other" },
];

function DocumentsPage() {
  const { documents } = useAppStore();
  const { open } = useAddModal();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | DocumentType>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents.filter((doc) => {
      const matchesFilter = filter === "all" || doc.type === filter;
      const matchesQuery =
        q.length === 0 ||
        doc.title.toLowerCase().includes(q) ||
        doc.company.toLowerCase().includes(q) ||
        doc.summary.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [documents, filter, query]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Everything you've added to Life Admin."
        actions={
          <Button onClick={open}>
            <Plus aria-hidden="true" />
            Add something
          </Button>
        }
      />

      <div className="space-y-3">
        <div className="relative">
          <SearchIcon
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            className="pl-9"
            placeholder="Search documents"
            aria-label="Search documents"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              aria-pressed={filter === item.value}
              className={cn(
                "shrink-0 rounded-full border border-border px-3 py-1.5 text-sm transition-colors",
                filter === item.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-accent",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <ListSkeleton count={4} lines={2} />
      ) : results.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nothing here yet."
          description="Add your first bill, contract, receipt or important document."
          action={<Button onClick={open}>Add something</Button>}
        />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {results.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      )}
    </div>
  );
}
