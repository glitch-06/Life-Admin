import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { FileText, Loader2, Search as SearchIcon, Sparkle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ErrorState } from "@/components/States";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { searchService } from "@/services";
import { suggestedQuestions } from "@/lib/mock-data";
import type { SearchAnswer } from "@/lib/types";

export const Route = createFileRoute("/app/search")({
  head: () => ({
    meta: [
      { title: "Search — Life Admin" },
      { name: "description", content: "Ask anything about your bills, policies and paperwork." },
      { property: "og:title", content: "Search — Life Admin" },
      { property: "og:description", content: "Ask anything about your saved information." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [answer, setAnswer] = useState<SearchAnswer | null>(null);

  async function ask(question: string) {
    if (question.trim().length === 0) return;
    setQuery(question);
    setStatus("loading");
    try {
      const result = await searchService.ask(question);
      setAnswer(result);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Search" description="Ask about anything you've saved." />

      <form
        className="mx-auto w-full max-w-2xl space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void ask(query);
        }}
      >
        <div className="relative">
          <SearchIcon
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            className="h-14 pl-12 pr-28 text-base"
            placeholder="Ask anything about your life admin..."
            aria-label="Ask anything about your life admin"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            disabled={query.trim().length === 0 || status === "loading"}
          >
            {status === "loading" ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
            Ask
          </Button>
        </div>
      </form>

      {status === "idle" ? (
        <section className="mx-auto w-full max-w-2xl space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">Try asking</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {suggestedQuestions.map((question) => (
              <li key={question}>
                <button
                  type="button"
                  onClick={() => void ask(question)}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-left text-sm transition-colors hover:border-ring hover:bg-accent"
                >
                  {question}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {status === "loading" ? (
        <div className="mx-auto w-full max-w-2xl space-y-3" aria-busy="true">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ) : null}

      {status === "error" ? (
        <div className="mx-auto w-full max-w-2xl">
          <ErrorState
            title="Something went wrong."
            description="We couldn't answer that just now."
            onRetry={() => void ask(query)}
          />
        </div>
      ) : null}

      {status === "done" && answer ? (
        <section className="mx-auto w-full max-w-2xl space-y-4 animate-rise">
          <h2 className="text-lg font-semibold">{answer.question}</h2>
          <div className="surface-card space-y-3 p-5">
            {answer.answer.map((line) => (
              <p key={line} className="text-[15px]">
                {line}
              </p>
            ))}
            <p className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
              <Sparkle className="size-3" aria-hidden="true" />
              Based on your saved information
            </p>
          </div>
          {answer.sources.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Sources</h3>
              <ul className="space-y-2">
                {answer.sources.map((source) => (
                  <li key={source.documentId}>
                    <Link
                      to="/app/documents/$id"
                      params={{ id: source.documentId }}
                      className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm hover:bg-accent"
                    >
                      <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
                      {source.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
