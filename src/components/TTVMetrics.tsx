import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, LineChart, Target, AlertTriangle, Clock, Handshake } from "lucide-react";
import { motion } from "framer-motion";
import { ttvKPIs } from "@/lib/portfolioTTV";

const tiles = [
  { label: "Avg Time to First Review", value: `${ttvKPIs.avgTimeToFirstSchedule}d`, target: "Target: 21d", progress: Math.round((1 - ttvKPIs.avgTimeToFirstSchedule / 30) * 100), icon: CalendarCheck, tone: "text-primary" },
  { label: "Avg Time to First Approved Piece", value: `${ttvKPIs.avgTimeToFirstForecast}d`, target: "Target: 35d", progress: Math.round((1 - ttvKPIs.avgTimeToFirstForecast / 45) * 100), icon: LineChart, tone: "text-accent" },
  { label: "Milestones On-Time", value: `${ttvKPIs.milestonesOnTimePct}%`, target: "Target: 85%", progress: ttvKPIs.milestonesOnTimePct, icon: Target, tone: "text-success" },
  { label: "Milestones At Risk", value: `${ttvKPIs.milestonesAtRisk}`, target: "Across portfolio", progress: 100 - ttvKPIs.milestonesAtRisk * 15, icon: AlertTriangle, tone: "text-warning" },
  { label: "Due This Week", value: `${ttvKPIs.milestonesThisWeek}`, target: "Next 7 days", progress: 60, icon: Clock, tone: "text-primary" },
  { label: "CSM Handovers (Q2)", value: `${ttvKPIs.csmTransitionsQ2}`, target: "Adoption exits", progress: 75, icon: Handshake, tone: "text-accent" },
];

export function TTVMetrics() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Time-to-Value Metrics</CardTitle>
          <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">Portfolio</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Pace of milestones from kickoff to CSM handover. Customer CSAT ≥ 4.5 and RM adoption ≥ 80% are the gateway to a successful handover to Customer Success.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {tiles.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-lg border p-3"
            >
              <div className="flex items-start justify-between mb-1.5">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider leading-tight">{t.label}</p>
                <t.icon className={`h-4 w-4 shrink-0 ${t.tone}`} />
              </div>
              <p className="text-xl font-semibold">{t.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{t.target}</p>
              <Progress value={Math.max(0, Math.min(100, t.progress))} className="h-1 mt-2" />
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
