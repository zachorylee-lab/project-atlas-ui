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
  { label: "Active Onboardings", value: "24", change: "+3 this month", icon: Users, trend: "up" as const },
  { label: "Avg. Time to First Rent", value: "12 days", change: "-3 days vs Q3", icon: Clock, trend: "up" as const },
  { label: "Completion Rate", value: "94%", change: "+2% vs last quarter", icon: CheckCircle2, trend: "up" as const },
  { label: "At-Risk Accounts", value: "3", change: "Needs attention", icon: AlertTriangle, trend: "down" as const },
];

const activeProjects = [
  { name: "Greystone Properties", client: "Enterprise PM", phase: 3, status: "on-track" as const, progress: 58, owner: "Sarah K." },
  { name: "UrbanNest Rentals", client: "Mid-Market PM", phase: 4, status: "at-risk" as const, progress: 72, owner: "Mike R." },
  { name: "Pinnacle Real Estate", client: "Enterprise PM", phase: 1, status: "on-track" as const, progress: 18, owner: "Lisa M." },
  { name: "QuickLease Co", client: "SMB Landlord", phase: 5, status: "on-track" as const, progress: 90, owner: "James W." },
  { name: "Maple Ridge Mgmt", client: "Enterprise PM", phase: 2, status: "delayed" as const, progress: 35, owner: "Ana P." },
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
          <h1 className="text-2xl font-semibold text-foreground">Executive Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of all active property manager onboardings and key rental finance KPIs.
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
                <CardTitle className="text-base font-semibold">Active Onboardings</CardTitle>
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
                <CardTitle className="text-base font-semibold">Speed to First Rent Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Enterprise PM", avg: "18 days", target: "15 days", progress: 83 },
                    { label: "Mid-Market PM", avg: "10 days", target: "10 days", progress: 100 },
                    { label: "SMB Landlord", avg: "5 days", target: "7 days", progress: 100 },
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
                    { text: "Greystone Properties moved to Tenant Portal Setup phase", time: "2h ago" },
                    { text: "UrbanNest Rentals flagged at-risk — payment gateway delay", time: "4h ago" },
                    { text: "QuickLease Co Go-Live scheduled for Mar 28", time: "6h ago" },
                    { text: "Pinnacle Real Estate kickoff completed", time: "1d ago" },
                    { text: "Maple Ridge Mgmt timeline extended by 5 days", time: "1d ago" },
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
