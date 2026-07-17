import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { PhaseIndicator } from "@/components/PhaseIndicator";
import { TTVNotifications } from "@/components/TTVNotifications";
import { TTVMetrics } from "@/components/TTVMetrics";
import { ProductAdvocacy } from "@/components/ProductAdvocacy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  ArrowUpRight,
  AlertTriangle,
  Briefcase,
  Smile,
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Active Implementations", value: "12", change: "+4 this quarter", icon: Briefcase, trend: "up" as const },
  { label: "Time to First Review", value: "18 days", change: "Target: 21 days · TTV proxy", icon: Clock, trend: "up" as const },
  { label: "On-Time Go-Live", value: "91%", change: "TTM rolling avg", icon: Clock, trend: "up" as const },
  { label: "Customer CSAT", value: "4.7/5", change: "Post-launch · pre-CSM handover", icon: Smile, trend: "up" as const },
];

const activeProjects = [
  { name: "Plante Moran", client: "Firm-wide RM · Audit + Tax + Advisory · Workday HCM", phase: 5, status: "on-track" as const, progress: 93, owner: "E. Cicero" },
  { name: "Wolf & Company", client: "Centralized resourcing · CCH Axcess · 3-yr forecast", phase: 4, status: "on-track" as const, progress: 78, owner: "A. Piggott" },
  { name: "Bennett Thrasher", client: "Utilization + realization uplift · Practice Engine", phase: 5, status: "on-track" as const, progress: 95, owner: "S. Pickard" },
  { name: "Baker Tilly", client: "Multi-region rollout · Workday + Practice Engine", phase: 1, status: "on-track" as const, progress: 18, owner: "L. Martin" },
  { name: "Azets UK", client: "Retain migration · 6,500 staff · Sage Intacct", phase: 3, status: "at-risk" as const, progress: 47, owner: "A. Pereira" },
];

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl">
        <motion.div {...fadeUp}>
          <h1 className="text-2xl font-semibold text-foreground">Professional Services · Implementation Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Portfolio view across Red Oak implementations at large accounting and financial services firms — partnering with Solution Consultants, CSMs, and AEs to drive Time-to-Value on centralized resourcing, forecasting, utilization, and the AI Review.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} {...fadeUp} transition={{ delay: i * 0.05 }}>
              <Card className="stat-card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-semibold mt-2">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-3 w-3 text-success" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 text-warning" />
                      )}
                      <span className="text-xs text-muted-foreground">{stat.change}</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">My Active Implementations</CardTitle>
                <a href="/projects" className="text-xs font-medium text-primary hover:underline">View all →</a>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-0 divide-y">
                {activeProjects.map((project) => (
                  <div key={project.name} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{project.name}</p>
                      <p className="text-xs text-muted-foreground">{project.client} · SIC: {project.owner}</p>
                    </div>
                    <PhaseIndicator currentPhase={project.phase} compact />
                    <div className="w-24 hidden sm:block">
                      <Progress value={project.progress} className="h-1.5" />
                      <p className="text-[10px] text-muted-foreground mt-1">{project.progress}%</p>
                    </div>
                    <StatusBadge status={project.status} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.25 }}>
          <TTVMetrics />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div {...fadeUp} transition={{ delay: 0.28 }}>
            <TTVNotifications />
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.32 }}>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">This Week's Implementation Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { text: "Plante Moran — first firm-wide busy-season schedule published; auto-schedule accepted 84%", time: "1h ago" },
                    { text: "Wolf & Company — CCH Axcess engagement master data reconciled; 12,400 engagements ingested", time: "4h ago" },
                    { text: "Azets — change order logged for legacy Retain history migration scope", time: "Yesterday" },
                    { text: "Baker Tilly — kickoff scheduled with COO, Head of Resourcing, and IT leads", time: "Yesterday" },
                    { text: "Bennett Thrasher — adoption exit; handed over to Customer Success Manager", time: "2d ago" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{item.text}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div {...fadeUp} transition={{ delay: 0.35 }}>
          <ProductAdvocacy />
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.38 }}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Project Hours vs. Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Plante Moran", recovered: "412 hrs", target: "480 hrs budget", progress: 86 },
                  { label: "Wolf & Company", recovered: "680 hrs", target: "720 hrs budget", progress: 94 },
                  { label: "Bennett Thrasher", recovered: "298 hrs", target: "320 hrs budget", progress: 93 },
                  { label: "Azets UK — at risk", recovered: "240 hrs", target: "220 hrs budget", progress: 109 },
                ].map((seg) => (
                  <div key={seg.label} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{seg.label}</span>
                      <span className="text-muted-foreground">{seg.recovered} <span className="text-xs">/ {seg.target}</span></span>
                    </div>
                    <Progress value={Math.min(seg.progress, 100)} className="h-1.5" />
                  </div>
                ))}
              </div>
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
