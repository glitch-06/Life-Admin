import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";
import { PriorityDot } from "@/components/Priority";
import { DocumentCard, categoryIcons } from "@/components/cards";
import { EmptyState, ErrorState } from "@/components/States";
import { Button } from "@/components/ui/button";
import { formatLong, relativeLabel } from "@/lib/dates";
import { categories } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/app/categories/$category")({
  head: () => ({
    meta: [
      { title: "Category — Life Admin" },
      { name: "description", content: "Everything saved in this part of your life." },
      { property: "og:title", content: "Category — Life Admin" },
      { property: "og:description", content: "Everything saved in this part of your life." },
    ],
  }),
  component: CategoryDetail,
});

function CategoryDetail() {
  const { category: categoryId } = Route.useParams();
  const navigate = useNavigate();
  const { documents, events } = useAppStore();

  const category = categories.find((item) => item.id === categoryId);

  if (!category) {
    return (
      <ErrorState
        title="We couldn't find that category."
        description="Try picking one from the categories list."
        onBack={() => navigate({ to: "/app/categories" })}
      />
    );
  }

  const Icon = categoryIcons[category.id] ?? FileText;
  const categoryDocs = documents.filter((doc) => doc.category === category.id);
  const categoryEvents = events.filter(
    (event) => event.category === category.id && event.status !== "handled",
  );
  const important = categoryEvents.filter((event) => event.priority !== "low");
  const upcoming = categoryEvents.filter((event) => event.priority === "low");

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/app/categories">
          <ArrowLeft aria-hidden="true" />
          All categories
        </Link>
      </Button>

      <header className="flex items-start gap-4">
        <span className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{category.name}</h1>
          <p className="text-[15px] text-muted-foreground">{category.description}</p>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Important</h2>
        {important.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing needs attention here.</p>
        ) : (
          <ul className="space-y-2">
            {important.map((event) => (
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
                    {event.deadline ? formatLong(event.deadline) : "No date"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Documents</h2>
        {categoryDocs.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Nothing here yet."
            description="Anything you add in this area will show up here."
          />
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {categoryDocs.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        )}
      </section>

      {upcoming.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Upcoming</h2>
          <ul className="space-y-2">
            {upcoming.map((event) => (
              <li key={event.id} className="surface-card p-4 text-sm">
                <span className="font-medium">{event.title}</span>{" "}
                <span className="text-muted-foreground">
                  {event.deadline
                    ? `— ${formatLong(event.deadline)} (${relativeLabel(event.deadline)})`
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
