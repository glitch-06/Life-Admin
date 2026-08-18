import type { ReactNode } from "react";
import { AlertCircle, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="surface-card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong.",
  description = "We couldn't load this right now. Nothing has been lost.",
  onRetry,
  onBack,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  onBack?: () => void;
}) {
  return (
    <div
      role="alert"
      className="surface-card flex flex-col items-center gap-3 px-6 py-14 text-center"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-high-soft text-high">
        <AlertCircle className="size-5" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      <div className="mt-2 flex gap-2">
        {onRetry ? <Button onClick={onRetry}>Try again</Button> : null}
        {onBack ? (
          <Button variant="outline" onClick={onBack}>
            Go back
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function CardSkeleton({ lines = 2 }: { lines?: number }) {
  return (
    <div className="surface-card space-y-3 p-5">
      <Skeleton className="h-4 w-1/3" />
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className={cn("h-3", index % 2 ? "w-2/3" : "w-5/6")} />
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 3, lines = 2 }: { count?: number; lines?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} lines={lines} />
      ))}
    </div>
  );
}
