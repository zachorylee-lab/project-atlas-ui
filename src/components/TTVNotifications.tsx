import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Clock, Target } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { portfolioMilestones, type TTVStatus } from "@/lib/portfolioTTV";

const statusMeta: Record<TTVStatus, { label: string; cls: string; icon: typeof Bell }> = {
  "at-risk": { label: "At Risk", cls: "bg-warning/10 text-warning border-warning/30", icon: AlertTriangle },
  "in-progress": { label: "Due Soon", cls: "bg-primary/10 text-primary border-primary/30", icon: Clock },
  "upcoming": { label: "Upcoming", cls: "bg-muted text-muted-foreground border-border", icon: Target },
  "done": { label: "Complete", cls: "bg-success/10 text-success border-success/30", icon: Target },
};

export function TTVNotifications() {
  const items = [...portfolioMilestones]
    .filter((m) => m.status !== "done" && m.daysOut <= 31)
    .sort((a, b) => {
      const rank = (s: TTVStatus) => (s === "at-risk" ? 0 : s === "in-progress" ? 1 : 2);
      return rank(a.status) - rank(b.status) || a.daysOut - b.daysOut;
    })
    .slice(0, 6);

  const atRiskCount = portfolioMilestones.filter((m) => m.status === "at-risk").length;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Implementation Timeline Notifications
          </CardTitle>
          <Badge variant="outline" className="text-[10px] bg-warning/10 text-warning border-warning/30">
            {atRiskCount} at risk
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Upcoming and at-risk milestones across the active Red Oak portfolio
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2.5">
          {items.map((m, i) => {
            const meta = statusMeta[m.status];
            const Icon = meta.icon;
            const dueLabel =
              m.daysOut < 0 ? `${Math.abs(m.daysOut)}d overdue`
              : m.daysOut === 0 ? "Today"
              : m.daysOut === 1 ? "Tomorrow"
              : `In ${m.daysOut}d`;
            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-3",
                  m.status === "at-risk" && "border-warning/30 bg-warning/[0.03]"
                )}
              >
                <div className={cn("h-7 w-7 shrink-0 rounded-full flex items-center justify-center border", meta.cls)}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-tight truncate">
                      {m.project} <span className="text-muted-foreground font-normal">· {m.milestone}</span>
                    </p>
                    <Badge variant="outline" className={cn("text-[10px] shrink-0", meta.cls)}>{meta.label}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground mt-0.5">
                    <span>{m.owner}</span>
                    <span>·</span>
                    <span>{m.date}</span>
                    <span>·</span>
                    <span className={cn(m.status === "at-risk" && "text-warning font-medium", m.daysOut <= 3 && m.status !== "at-risk" && "text-primary font-medium")}>
                      {dueLabel}
                    </span>
                  </div>
                  {m.note && <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{m.note}</p>}
                </div>
              </motion.li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
