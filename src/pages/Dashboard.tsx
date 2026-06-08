import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { PhaseIndicator } from "@/components/PhaseIndicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Clock,
  ArrowUpRight,
  AlertTriangle,
  Briefcase,
  Smile,
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Active Implementations", value: "14", change: "+3 this quarter", icon: Briefcase, trend: "up" as const },
  { label: "PS Utilization", value: "84%", change: "Target: 80%", icon: Users, trend: "up" as const },
  { label: "On-Time Go-Lives", value: "92%", change: "TTM rolling avg", icon: Clock, trend: "up" as const },
  { label: "Client CSAT", value: "4.7/5", change: "Post go-live survey", icon: Smile, trend: "up" as const },
];

const activeProjects = [
  { name: "Higginbotham Insurance", client: "1,800 EEs · Full HCM Suite", phase: 5, status: "on-track" as const, progress: 92, owner: "E. Cicero" },
  { name: "Coastal Health Systems", client: "4,200 EEs · HR + Payroll + Benefits", phase: 4, status: "on-track" as const, progress: 76, owner: "A. Piggott" },
  { name: "Meridian Manufacturing", client: "950 EEs · Payroll + Time & Attendance", phase: 5, status: "on-track" as const, progress: 95, owner: "S. Pickard" },
  { name: "Northwind Logistics", client: "2,600 EEs · Full Suite + Talent", phase: 1, status: "on-track" as const, progress: 16, owner: "L. Martin" },
  { name: "Apex Property Mgmt", client: "640 EEs · HR + Benefits Open Enrollment", phase: 3, status: "at-risk" as const, progress: 48, owner: "A. Pereira" },
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
          <h1 className="text-2xl font-semibold text-foreground">Professional Services Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Portfolio view across Sage HCM client implementations — HR, Payroll, Benefits, Talent, and Time & Attendance.
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
                  <div className="rounded-lg bg-accent/20 p-2.5">
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
                      <p className="text-xs text-muted-foreground">{project.client} · PM: {project.owner}</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div {...fadeUp} transition={{ delay: 0.3 }}>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Project Hours vs. Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Higginbotham Insurance", recovered: "412 hrs", target: "480 hrs budget", progress: 86 },
                    { label: "Coastal Health Systems", recovered: "680 hrs", target: "720 hrs budget", progress: 94 },
                    { label: "Meridian Manufacturing", recovered: "298 hrs", target: "320 hrs budget", progress: 93 },
                    { label: "Apex Property Mgmt — at risk", recovered: "240 hrs", target: "220 hrs budget", progress: 109 },
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

          <motion.div {...fadeUp} transition={{ delay: 0.35 }}>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">This Week's PM Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { text: "Higginbotham — parallel payroll #2 reconciled to the penny; signed Go/No-Go", time: "1h ago" },
                    { text: "Coastal Health — benefits carrier file (EDI 834) UAT cleared with all 6 carriers", time: "4h ago" },
                    { text: "Apex Property — change order logged for added Time & Attendance scope", time: "Yesterday" },
                    { text: "Northwind Logistics — kickoff scheduled with CHRO, CFO and IT director", time: "Yesterday" },
                    { text: "Meridian — hypercare exit review passed; transitioned to Customer Success", time: "2d ago" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent mt-2 shrink-0" />
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
