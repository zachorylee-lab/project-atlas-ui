import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { PhaseIndicator } from "@/components/PhaseIndicator";
import { PHASES } from "@/lib/phases";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, User, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const projects = [
  { name: "Acme Corp", segment: "Enterprise", owner: "Sarah K.", phase: 3, status: "on-track" as const, progress: 58, startDate: "Jan 15", targetDate: "Apr 20", daysRemaining: 26 },
  { name: "TechFlow Inc", segment: "Mid-Market", owner: "Mike R.", phase: 4, status: "at-risk" as const, progress: 72, startDate: "Feb 1", targetDate: "Apr 5", daysRemaining: 11 },
  { name: "GlobalBank", segment: "Enterprise", owner: "Lisa M.", phase: 1, status: "on-track" as const, progress: 18, startDate: "Mar 10", targetDate: "Jun 30", daysRemaining: 97 },
  { name: "RetailPro", segment: "SMB", owner: "James W.", phase: 5, status: "on-track" as const, progress: 90, startDate: "Dec 5", targetDate: "Mar 28", daysRemaining: 3 },
  { name: "HealthSync", segment: "Enterprise", owner: "Ana P.", phase: 2, status: "delayed" as const, progress: 35, startDate: "Feb 15", targetDate: "May 30", daysRemaining: 66 },
  { name: "EduLearn", segment: "Mid-Market", owner: "Tom B.", phase: 0, status: "not-started" as const, progress: 5, startDate: "Mar 22", targetDate: "Jun 15", daysRemaining: 82 },
  { name: "LogiChain", segment: "Enterprise", owner: "Sarah K.", phase: 3, status: "on-track" as const, progress: 55, startDate: "Jan 28", targetDate: "May 10", daysRemaining: 46 },
  { name: "FinServ Pro", segment: "Enterprise", owner: "Mike R.", phase: 4, status: "on-track" as const, progress: 78, startDate: "Nov 20", targetDate: "Apr 2", daysRemaining: 8 },
];

const statusFilters = ["All", "on-track", "at-risk", "delayed", "not-started"] as const;

export default function ActiveProjects() {
  const [filter, setFilter] = useState<string>("All");
  const filtered = filter === "All" ? projects : projects.filter(p => p.status === filter);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold">Active Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track all customer implementations across the 6-phase lifecycle.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s === "All" ? "All Projects" : s.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((project, i) => (
            <motion.div key={project.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold">{project.name}</h3>
                        <StatusBadge status={project.status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{project.segment}</span>
                        <span className="flex items-center gap-1"><User className="h-3 w-3" />{project.owner}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{project.startDate} → {project.targetDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Phase</p>
                        <PhaseIndicator currentPhase={project.phase} compact />
                        <p className="text-[10px] text-muted-foreground mt-1">{PHASES[project.phase]?.label ?? "Pending"}</p>
                      </div>
                      <div className="w-24">
                        <p className="text-xs text-muted-foreground mb-1">Progress</p>
                        <Progress value={project.progress} className="h-1.5" />
                        <p className="text-[10px] text-muted-foreground mt-1">{project.progress}%</p>
                      </div>
                      <div className="text-center hidden md:block">
                        <p className="text-xs text-muted-foreground mb-1">Days Left</p>
                        <p className={`text-lg font-semibold ${project.daysRemaining <= 10 ? "text-destructive" : ""}`}>
                          {project.daysRemaining}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
