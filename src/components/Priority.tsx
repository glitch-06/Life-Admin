import { AlertTriangle, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Priority } from "@/lib/types";

const config: Record<
  Priority,
  { label: string; dot: string; chip: string; Icon: typeof Info }
> = {
  high: {
    label: "High priority",
    dot: "bg-high",
    chip: "bg-high-soft text-high border-high/25",
    Icon: AlertTriangle,
  },
  medium: {
    label: "Upcoming",
    dot: "bg-medium",
    chip: "bg-medium-soft text-medium-foreground border-medium/35",
    Icon: Clock,
  },
  low: {
    label: "Informational",
    dot: "bg-low",
    chip: "bg-low-soft text-muted-foreground border-border",
    Icon: Info,
  },
};

export function PriorityDot({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn("inline-block size-2.5 shrink-0 rounded-full", config[priority].dot)}
      aria-hidden="true"
    />
  );
}

export function PriorityChip({
  priority,
  label,
  className,
}: {
  priority: Priority;
  label?: string;
  className?: string;
}) {
  const { chip, Icon, label: fallback } = config[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide",
        chip,
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {label ?? fallback}
    </span>
  );
}

export function priorityLabel(priority: Priority) {
  return config[priority].label;
}
