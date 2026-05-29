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
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Active Merchants", value: "112", change: "+9 this quarter", icon: Users, trend: "up" as const },
  { label: "Fees Recovered (TTM)", value: "$24.6M", change: "+38% YoY", icon: DollarSign, trend: "up" as const },
  { label: "Surcharge Compliance", value: "99.4%", change: "All 50 states + brand rules", icon: ShieldCheck, trend: "up" as const },
  { label: "Disputes to Review", value: "11", change: "Needs attention", icon: AlertTriangle, trend: "down" as const },
];

const activeProjects = [
  { name: "Progress Residential", client: "Single-Family Rental · Surcharging", phase: 5, status: "on-track" as const, progress: 92, owner: "E. Cicero" },
  { name: "Atlas Travel & Tech", client: "Travel · BaaS + Multi-rail", phase: 4, status: "on-track" as const, progress: 78, owner: "A. Piggott" },
  { name: "Business Infusions", client: "ISV · Surcharging + ISV Acquiring", phase: 5, status: "on-track" as const, progress: 95, owner: "S. Pickard" },
  { name: "Lyric Marketplace", client: "Marketplace · Rainforest acquiring", phase: 1, status: "on-track" as const, progress: 16, owner: "L. Martin" },
  { name: "NovaSubs Platform", client: "SaaS · Stripe Billing + Tax", phase: 3, status: "at-risk" as const, progress: 48, owner: "A. Pereira" },
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
          <h1 className="text-2xl font-semibold text-foreground">Payments Operations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time visibility across merchants, surcharging programs, and complex payment integrations delivered by Yeeld.
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
                <CardTitle className="text-base font-semibold">Active Merchant Rollouts</CardTitle>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div {...fadeUp} transition={{ delay: 0.3 }}>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Surcharge Recovery by Segment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Property Management & SFR", recovered: "$11.2M", target: "$10M target", progress: 100 },
                    { label: "Travel & Hospitality", recovered: "$6.8M", target: "$7M target", progress: 97 },
                    { label: "B2B Software / ISVs", recovered: "$4.1M", target: "$5M target", progress: 82 },
                    { label: "Marketplaces & Platforms", recovered: "$2.5M", target: "$3M target", progress: 83 },
                  ].map((seg) => (
                    <div key={seg.label} className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{seg.label}</span>
                        <span className="text-muted-foreground">{seg.recovered} <span className="text-xs">/ {seg.target}</span></span>
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
                    { text: "Progress Residential surcharging live across all rental portals — first month: $412K recovered", time: "2h ago" },
                    { text: "Atlas Travel completed Airwallex multi-currency cutover (USD, EUR, GBP, AUD)", time: "5h ago" },
                    { text: "Avalara nexus monitoring flagged 2 new states for surcharge compliance review", time: "7h ago" },
                    { text: "Business Infusions ISV rev-share contract finalized with Rainforest", time: "1d ago" },
                    { text: "NovaSubs Stripe Billing migration entered UAT — ASC 606 schedules validated", time: "1d ago" },
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
