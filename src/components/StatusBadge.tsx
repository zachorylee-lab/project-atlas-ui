import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "on-track" | "at-risk" | "delayed" | "completed" | "not-started";
  className?: string;
}

const statusConfig = {
  "on-track": { label: "On Track", classes: "bg-success/10 text-success" },
  "at-risk": { label: "At Risk", classes: "bg-warning/10 text-warning" },
  "delayed": { label: "Delayed", classes: "bg-destructive/10 text-destructive" },
  "completed": { label: "Completed", classes: "bg-primary/10 text-primary" },
  "not-started": { label: "Not Started", classes: "bg-muted text-muted-foreground" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", config.classes, className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
