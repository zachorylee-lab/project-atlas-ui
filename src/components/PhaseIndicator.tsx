import { PHASES } from "@/lib/phases";
import { cn } from "@/lib/utils";

interface PhaseIndicatorProps {
  currentPhase: number;
  compact?: boolean;
}

export function PhaseIndicator({ currentPhase, compact }: PhaseIndicatorProps) {
  return (
    <div className="flex items-center gap-1">
      {PHASES.map((phase, i) => (
        <div key={phase.id} className="flex items-center">
          <div
            className={cn(
              "rounded-full transition-all",
              compact ? "h-2 w-2" : "h-3 w-3",
              i < currentPhase ? `${phase.color} opacity-100` : "bg-muted",
              i === currentPhase && "ring-2 ring-offset-1 ring-primary"
            )}
            title={phase.label}
          />
          {!compact && i < PHASES.length - 1 && (
            <div className={cn("h-px w-3 mx-0.5", i < currentPhase ? "bg-primary/40" : "bg-muted")} />
          )}
        </div>
      ))}
    </div>
  );
}
