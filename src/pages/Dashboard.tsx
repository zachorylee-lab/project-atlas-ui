import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { PhaseIndicator } from "@/components/PhaseIndicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Entities Managed", value: "147", change: "+12 this quarter", icon: Users, trend: "up" as const },
  { label: "Avg. Close Cycle", value: "3.2 days", change: "-58% vs baseline", icon: Clock, trend: "up" as const },
  { label: "AI Automation Rate", value: "91%", change: "+6% vs Q3", icon: CheckCircle2, trend: "up" as const },
  { label: "Exceptions to Review", value: "7", change: "Needs attention", icon: AlertTriangle, trend: "down" as const },
];

const activeProjects = [
  { name: "Higginbotham Insurance", client: "Multi-entity · 38 entities", phase: 5, status: "on-track" as const, progress: 92, owner: "Sarah K." },
  { name: "New York Yankees", client: "Sports & Entertainment", phase: 4, status: "on-track" as const, progress: 76, owner: "Mike R." },
  { name: "Lyric Opera of Chicago", client: "Non-profit", phase: 1, status: "on-track" as const, progress: 18, owner: "Lisa M." },
  { name: "ProService Hawaii", client: "Professional Services", phase: 5, status: "on-track" as const, progress: 90, owner: "James W." },
  { name: "Asana Rebel GmbH", client: "SaaS · Multi-currency", phase: 3, status: "at-risk" as const, progress: 48, owner: "Ana P." },
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
          <h1 className="text-2xl font-semibold text-foreground">Finance Operations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time visibility across entities, close cycles, and AI-automated workflows powered by Sage Intacct.
          </p>
        </motion.div>

        {/* Stats Grid */}
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
                  <div className="rounded-lg bg-primary/8 p-2.5">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Projects Table */}
        <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Active Implementations</CardTitle>
                <a href="/projects" className="text-xs font-medium text-primary hover:underline">View all →</a>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-0 divide-y">
                {activeProjects.map((project) => (
                  <div key={project.name} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{project.name}</p>
                      <p className="text-xs text-muted-foreground">{project.client} · {project.owner}</p>
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

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div {...fadeUp} transition={{ delay: 0.3 }}>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Close Cycle Velocity by Segment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Enterprise (>$500M rev)", avg: "4.5 days", target: "5 days", progress: 100 },
                    { label: "Mid-Market", avg: "3.1 days", target: "4 days", progress: 100 },
                    { label: "Growth SaaS", avg: "2.2 days", target: "3 days", progress: 100 },
                  ].map((seg) => (
                    <div key={seg.label} className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{seg.label}</span>
                        <span className="text-muted-foreground">{seg.avg} <span className="text-xs">/ {seg.target} target</span></span>
                      </div>
                      <Progress value={seg.progress} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.35 }}>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { text: "Higginbotham completed Q4 consolidation across 38 entities", time: "2h ago" },
                    { text: "AI flagged 12 anomalies in Asana Rebel intercompany journals", time: "4h ago" },
                    { text: "ProService Hawaii Go-Live scheduled for Mar 28", time: "6h ago" },
                    { text: "Lyric Opera kickoff completed — multi-fund accounting enabled", time: "1d ago" },
                    { text: "Yankees Q3 reporting package auto-generated and shared with CFO", time: "1d ago" },
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
      </div>
    </DashboardLayout>
  );
}
