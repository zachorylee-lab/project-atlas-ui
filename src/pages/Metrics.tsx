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

const monthlyRecovery = [
  { month: "Oct", recovered: 1.6 },
  { month: "Nov", recovered: 1.9 },
  { month: "Dec", recovered: 2.1 },
  { month: "Jan", recovered: 2.4 },
  { month: "Feb", recovered: 2.7 },
  { month: "Mar", recovered: 3.1 },
];

const authRateTrend = [
  { month: "Oct", rate: 91.2 },
  { month: "Nov", rate: 92.1 },
  { month: "Dec", rate: 92.6 },
  { month: "Jan", rate: 93.4 },
  { month: "Feb", rate: 94.1 },
  { month: "Mar", rate: 94.8 },
];

const kpis = [
  { label: "Merchant CSAT", value: "4.8/5", target: "4.5/5", progress: 96 },
  { label: "On-Time Launch", value: "92%", target: "90%", progress: 100 },
  { label: "Surcharge Compliance", value: "99.4%", target: "99%", progress: 100 },
  { label: "Avg. Time to Live", value: "11 wks", target: "14 wks", progress: 100 },
];

export default function Metrics() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold">Recovery & KPIs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Portfolio-wide payment performance: surcharge recovery, auth rate, compliance and merchant satisfaction.
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
                <CardTitle className="text-base font-semibold">Monthly Surcharge Recovery ($M)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRecovery}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                      <Bar dataKey="recovered" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Portfolio Auth Rate (%)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={authRateTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis domain={[88, 96]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                      <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Merchants by Implementation Phase</CardTitle>
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
