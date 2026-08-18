import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
        aria-hidden="true"
      >
        LA
      </span>
      {compact ? null : (
        <span className="text-[15px] font-semibold tracking-tight">Life Admin</span>
      )}
    </span>
  );
}
