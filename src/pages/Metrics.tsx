import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { motion } from "framer-motion";

const phaseDistribution = [
  { name: "Handoff", count: 3, color: "hsl(199, 89%, 48%)" },
  { name: "Kickoff", count: 4, color: "hsl(262, 52%, 55%)" },
  { name: "Build", count: 8, color: "hsl(172, 66%, 40%)" },
  { name: "Testing", count: 5, color: "hsl(38, 92%, 50%)" },
  { name: "Go-Live", count: 2, color: "hsl(152, 60%, 40%)" },
  { name: "Hypercare", count: 2, color: "hsl(340, 65%, 50%)" },
];

const monthlyCompletions = [
  { month: "Oct", completed: 5 },
  { month: "Nov", completed: 7 },
  { month: "Dec", completed: 4 },
  { month: "Jan", completed: 8 },
  { month: "Feb", completed: 6 },
  { month: "Mar", completed: 9 },
];

const timeToValue = [
  { month: "Oct", days: 22 },
  { month: "Nov", days: 19 },
  { month: "Dec", days: 18 },
  { month: "Jan", days: 15 },
  { month: "Feb", days: 14 },
  { month: "Mar", days: 12 },
];

const kpis = [
  { label: "PM Satisfaction", value: "4.7/5", target: "4.5/5", progress: 94 },
  { label: "On-Time Go-Live", value: "87%", target: "90%", progress: 87 },
  { label: "First-Payment Success", value: "96%", target: "95%", progress: 100 },
  { label: "Avg. Time to First Rent", value: "12 days", target: "14 days", progress: 100 },
];

export default function Metrics() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold">Metrics & Reporting</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Key performance indicators across all property manager onboardings.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="stat-card">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                <p className="text-2xl font-semibold mt-2">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">Target: {kpi.target}</p>
                <Progress value={kpi.progress} className="h-1.5 mt-3" />
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Monthly Onboarding Completions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyCompletions}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                      <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Time to First Rent Collection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeToValue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                      <Line type="monotone" dataKey="days" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ fill: "hsl(var(--accent))", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Accounts by Phase</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={phaseDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="count" paddingAngle={3}>
                        {phaseDistribution.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {phaseDistribution.map((p) => (
                    <div key={p.name} className="flex items-center gap-1.5 text-xs">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                      <span className="text-muted-foreground">{p.name} ({p.count})</span>
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
