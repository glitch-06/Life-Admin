import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { UpgradeModal } from "@/components/modals";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/billing")({
  head: () => ({
    meta: [
      { title: "Plans & billing — Life Admin" },
      { name: "description", content: "Compare the Free and Pro plans and see your usage." },
      { property: "og:title", content: "Plans & billing — Life Admin" },
      { property: "og:description", content: "Compare plans and see your usage." },
    ],
  }),
  component: BillingPage,
});

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "Enough to keep the essentials from slipping.",
    features: [
      "10 documents per month",
      "Deadline reminders by email",
      "Categories and search",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$7",
    cadence: "per month",
    description: "For everything life throws at you.",
    features: [
      "Unlimited documents",
      "Unlimited reminders and lead times",
      "Smart search across everything",
      "Email and calendar connections",
    ],
  },
];

function BillingPage() {
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const used = 7;
  const included = 10;

  return (
    <div className="space-y-6">
      <PageHeader title="Plans & billing" description="You're currently on the Free plan." />

      <section className="surface-card space-y-3 p-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-base font-semibold">Documents this month</h2>
          <p className="text-sm tabular-nums text-muted-foreground">
            {used} of {included}
          </p>
        </div>
        <Progress value={(used / included) * 100} aria-label="Documents used this month" />
        <p className="text-sm text-muted-foreground">
          {included - used} documents left before your monthly limit resets.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => {
          const isCurrent = plan.id === "free";
          return (
            <section
              key={plan.id}
              className={cn(
                "surface-card flex flex-col gap-4 p-6",
                !isCurrent && "ring-1 ring-ring",
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">{plan.name}</h2>
                  {isCurrent ? (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      Current plan
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <p className="flex items-baseline gap-1">
                <span className="text-3xl font-semibold tracking-tight">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.cadence}</span>
              </p>
              <ul className="flex-1 space-y-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-low" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <Button variant="outline" disabled>
                  Your current plan
                </Button>
              ) : (
                <Button onClick={() => setUpgradeOpen(true)}>Upgrade to Pro</Button>
              )}
            </section>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground">
        Payments aren't switched on yet — nothing will be charged.
      </p>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </div>
  );
}
