import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  FileText,
  Inbox,
  Search,
  ShieldCheck,
  Sparkle,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Life Admin — Never miss a deadline again" },
      {
        name: "description",
        content:
          "Life Admin reads your bills, contracts and letters, explains what they mean and reminds you before anything is due.",
      },
      { property: "og:title", content: "Life Admin — Never miss a deadline again" },
      {
        property: "og:description",
        content:
          "Forward the paperwork. Life Admin explains what it means and reminds you before it's due.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Inbox,
    title: "One place for the paperwork",
    body: "Forward an email or drop in a photo. Everything lands in one calm inbox instead of five apps.",
  },
  {
    icon: Sparkle,
    title: "Plain-English explanations",
    body: "We read the fine print and tell you what changed, what you need to do, and what happens if you don't.",
  },
  {
    icon: Bell,
    title: "Reminders that arrive in time",
    body: "Renewal in 12 days? You'll hear about it a week before, not the morning after.",
  },
  {
    icon: CalendarDays,
    title: "Every deadline on one calendar",
    body: "Insurance, returns, warranties and renewals laid out so nothing sneaks up on you.",
  },
  {
    icon: Search,
    title: "Ask instead of digging",
    body: "\"When does my car insurance expire?\" Get the answer and the document it came from.",
  },
  {
    icon: ShieldCheck,
    title: "Yours and only yours",
    body: "Your documents stay private. Delete anything, or everything, whenever you like.",
  },
];

const steps = [
  { title: "Add it", body: "Forward an email, upload a PDF or snap a photo of a letter." },
  { title: "We read it", body: "We pull out the dates, amounts and what's actually being asked." },
  { title: "You stay ahead", body: "A short summary, a deadline and a reminder before it matters." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/signup">Get started</Link>
          </Button>
        </nav>
      </header>

      <main>
        <section className="mx-auto w-full max-w-6xl px-5 pb-16 pt-12 sm:pt-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <Sparkle className="size-3" aria-hidden="true" />
              Your personal admin assistant
            </p>
            <h1 className="text-balance-tight mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
              Never miss another deadline
            </h1>
            <p className="text-balance-tight mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              Life Admin reads your bills, policies and letters, tells you what they actually mean,
              and reminds you before anything is due.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/signup">
                  Get started free
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/app">See the demo</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Free for your first 10 documents a month. No card needed.
            </p>
          </div>

          <div className="surface-card mx-auto mt-14 max-w-3xl space-y-3 p-5 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Needs your attention
            </p>
            {[
              {
                title: "Car insurance renews in 12 days",
                body: "Your premium is going up by $180. Switching now would keep it flat.",
                tone: "text-high",
              },
              {
                title: "Return window closes Wednesday",
                body: "The headphones you kept meaning to send back are still returnable.",
                tone: "text-medium",
              },
              {
                title: "Streaming plan renews next month",
                body: "$139 for the year. Nothing to do unless you'd rather cancel.",
                tone: "text-low",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 rounded-xl bg-muted/50 p-4 text-left">
                <span className={`mt-1.5 size-2 shrink-0 rounded-full bg-current ${item.tone}`} />
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-card/50 py-16">
          <div className="mx-auto w-full max-w-6xl px-5">
            <h2 className="text-center text-3xl font-semibold tracking-tight">How it works</h2>
            <ol className="mt-10 grid gap-6 sm:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title} className="space-y-2">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-medium">{step.title}</h3>
                  <p className="text-[15px] text-muted-foreground">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-5 py-16">
          <h2 className="text-center text-3xl font-semibold tracking-tight">
            Everything in one calm place
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="surface-card space-y-2 p-5">
                <feature.icon className="size-5 text-muted-foreground" aria-hidden="true" />
                <h3 className="text-base font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-border py-16">
          <div className="mx-auto w-full max-w-2xl px-5 text-center">
            <FileText className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-balance-tight mt-4 text-3xl font-semibold tracking-tight">
              Stop keeping it all in your head
            </h2>
            <p className="mt-3 text-[15px] text-muted-foreground">
              Add the first thing that's been nagging you and see what Life Admin makes of it.
            </p>
            <Button asChild size="lg" className="mt-7">
              <Link to="/signup">
                Get started free
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-5 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <Logo compact />
          <p>© 2026 Life Admin. A demo product.</p>
        </div>
      </footer>
    </div>
  );
}
