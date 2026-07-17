import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp, TrendingDown, Users, CheckCircle2, AlertCircle, Activity, Award, Target,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Persona = "Admin" | "Scheduler" | "Partner" | "Consultant";

type PersonaRow = {
  persona: Persona;
  invited: number;
  trained: number;
  certified: number;
  activeDAU: number;
  target: number;
};

type ModuleRow = {
  module: string;
  loomViews: number;
  scribeCompletions: number;
  featureAdoption: number; // % of licensed users using it weekly
  trend: number; // delta vs last week
};

type Customer = {
  id: string;
  name: string;
  phase: "Build" | "Testing" | "Go-Live" | "Hypercare";
  daysToGoLive: number;
  readiness: number; // 0-100
  personas: PersonaRow[];
  modules: ModuleRow[];
  timeline: { week: string; adoption: number; target: number }[];
  csmReady: boolean;
};

const customers: Customer[] = [
  {
    id: "plante",
    name: "Plante Moran",
    phase: "Hypercare",
    daysToGoLive: -14,
    readiness: 88,
    csmReady: true,
    personas: [
      { persona: "Admin", invited: 12, trained: 12, certified: 11, activeDAU: 9, target: 12 },
      { persona: "Scheduler", invited: 48, trained: 46, certified: 40, activeDAU: 41, target: 44 },
      { persona: "Partner", invited: 62, trained: 55, certified: 38, activeDAU: 47, target: 55 },
      { persona: "Consultant", invited: 980, trained: 902, certified: 720, activeDAU: 812, target: 850 },
    ],
    modules: [
      { module: "Scheduler", loomViews: 412, scribeCompletions: 188, featureAdoption: 91, trend: 4 },
      { module: "Forecast", loomViews: 96, scribeCompletions: 64, featureAdoption: 72, trend: 8 },
      { module: "AI Review", loomViews: 58, scribeCompletions: 22, featureAdoption: 34, trend: 12 },
      { module: "Firm Model", loomViews: 184, scribeCompletions: 121, featureAdoption: 100, trend: 0 },
      { module: "Reporting", loomViews: 44, scribeCompletions: 28, featureAdoption: 58, trend: -3 },
    ],
    timeline: [
      { week: "W-6", adoption: 22, target: 30 },
      { week: "W-4", adoption: 41, target: 45 },
      { week: "W-2", adoption: 63, target: 60 },
      { week: "GL", adoption: 78, target: 75 },
      { week: "W+1", adoption: 84, target: 80 },
      { week: "W+2", adoption: 88, target: 85 },
    ],
  },
  {
    id: "bdo",
    name: "BDO",
    phase: "Go-Live",
    daysToGoLive: 3,
    readiness: 71,
    csmReady: false,
    personas: [
      { persona: "Admin", invited: 18, trained: 17, certified: 12, activeDAU: 10, target: 16 },
      { persona: "Scheduler", invited: 72, trained: 58, certified: 40, activeDAU: 35, target: 60 },
      { persona: "Partner", invited: 110, trained: 74, certified: 41, activeDAU: 52, target: 90 },
      { persona: "Consultant", invited: 1840, trained: 1402, certified: 980, activeDAU: 1120, target: 1500 },
    ],
    modules: [
      { module: "Scheduler", loomViews: 620, scribeCompletions: 240, featureAdoption: 74, trend: 11 },
      { module: "Forecast", loomViews: 140, scribeCompletions: 62, featureAdoption: 48, trend: 6 },
      { module: "AI Review", loomViews: 32, scribeCompletions: 8, featureAdoption: 12, trend: 4 },
      { module: "Firm Model", loomViews: 240, scribeCompletions: 180, featureAdoption: 96, trend: 1 },
      { module: "Reporting", loomViews: 71, scribeCompletions: 34, featureAdoption: 41, trend: -2 },
    ],
    timeline: [
      { week: "W-6", adoption: 12, target: 25 },
      { week: "W-4", adoption: 28, target: 40 },
      { week: "W-2", adoption: 44, target: 55 },
      { week: "W-1", adoption: 58, target: 65 },
      { week: "W-0", adoption: 71, target: 75 },
    ],
  },
  {
    id: "azets",
    name: "Azets",
    phase: "Testing",
    daysToGoLive: 32,
    readiness: 54,
    csmReady: false,
    personas: [
      { persona: "Admin", invited: 8, trained: 8, certified: 5, activeDAU: 6, target: 8 },
      { persona: "Scheduler", invited: 34, trained: 22, certified: 14, activeDAU: 18, target: 30 },
      { persona: "Partner", invited: 44, trained: 20, certified: 8, activeDAU: 15, target: 35 },
      { persona: "Consultant", invited: 620, trained: 280, certified: 110, activeDAU: 240, target: 500 },
    ],
    modules: [
      { module: "Scheduler", loomViews: 210, scribeCompletions: 88, featureAdoption: 55, trend: 15 },
      { module: "Forecast", loomViews: 40, scribeCompletions: 18, featureAdoption: 22, trend: 5 },
      { module: "AI Review", loomViews: 6, scribeCompletions: 0, featureAdoption: 0, trend: 0 },
      { module: "Firm Model", loomViews: 120, scribeCompletions: 84, featureAdoption: 88, trend: 3 },
      { module: "Reporting", loomViews: 18, scribeCompletions: 6, featureAdoption: 14, trend: 2 },
    ],
    timeline: [
      { week: "W-8", adoption: 8, target: 15 },
      { week: "W-6", adoption: 22, target: 30 },
      { week: "W-4", adoption: 38, target: 45 },
      { week: "W-2", adoption: 54, target: 60 },
    ],
  },
];

const phaseTint: Record<Customer["phase"], string> = {
  Build: "bg-muted text-muted-foreground",
  Testing: "bg-[hsl(200_70%_50%)]/15 text-[hsl(200_70%_50%)]",
  "Go-Live": "bg-[hsl(30_95%_55%)]/15 text-[hsl(30_95%_55%)]",
  Hypercare: "bg-[hsl(155_60%_45%)]/15 text-[hsl(155_60%_45%)]",
};

function readinessColor(v: number) {
  if (v >= 80) return "hsl(155 60% 45%)";
  if (v >= 60) return "hsl(30 95% 55%)";
  return "hsl(0 75% 55%)";
}

export default function AdoptionTracker() {
  const [customerId, setCustomerId] = useState(customers[0].id);
  const customer = customers.find((c) => c.id === customerId)!;

  const totals = useMemo(() => {
    const sum = (k: keyof PersonaRow) =>
      customer.personas.reduce((s, p) => s + (p[k] as number), 0);
    const invited = sum("invited");
    const trained = sum("trained");
    const certified = sum("certified");
    const dau = sum("activeDAU");
    return {
      invited,
      trained,
      certified,
      dau,
      trainedPct: invited ? Math.round((trained / invited) * 100) : 0,
      certifiedPct: invited ? Math.round((certified / invited) * 100) : 0,
      dauPct: invited ? Math.round((dau / invited) * 100) : 0,
    };
  }, [customer]);

  const gate = (label: string, ok: boolean) => (
    <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
      {ok ? (
        <CheckCircle2 className="h-4 w-4 text-[hsl(155_60%_45%)]" />
      ) : (
        <AlertCircle className="h-4 w-4 text-[hsl(30_95%_55%)]" />
      )}
      <span className="text-sm">{label}</span>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Activity className="h-3.5 w-3.5" />
              Customer Enablement
            </div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Adoption Tracker</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Per-customer training completion, certification, and feature adoption — the evidence that
              backs <span className="font-medium">CSM Transition Readiness</span> and on-time Go-Live.
            </p>
          </div>
          <Select value={customerId} onValueChange={setCustomerId}>
            <SelectTrigger className="w-[240px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {customers.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Hero readiness */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="grid gap-6 p-6 md:grid-cols-[260px_1fr]">
              <div className="flex flex-col items-center justify-center rounded-lg bg-muted/40 p-4">
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Readiness</div>
                <div
                  className="mt-2 text-5xl font-semibold tabular-nums"
                  style={{ color: readinessColor(customer.readiness) }}
                >
                  {customer.readiness}
                </div>
                <Progress value={customer.readiness} className="mt-3 w-full" />
                <div className="mt-3 flex items-center gap-2">
                  <Badge className={cn("uppercase text-[10px]", phaseTint[customer.phase])}>
                    {customer.phase}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {customer.daysToGoLive < 0
                      ? `${Math.abs(customer.daysToGoLive)}d post go-live`
                      : `${customer.daysToGoLive}d to go-live`}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium">CSM Transition gates</div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {gate("≥ 80% admins certified", totals.certifiedPct >= 80 || customer.personas.find(p => p.persona === "Admin")!.certified / customer.personas.find(p => p.persona === "Admin")!.invited >= 0.8)}
                  {gate("≥ 70% schedulers trained", (customer.personas.find(p => p.persona === "Scheduler")!.trained / customer.personas.find(p => p.persona === "Scheduler")!.invited) >= 0.7)}
                  {gate("Scheduler adoption ≥ 75%", (customer.modules.find(m => m.module === "Scheduler")?.featureAdoption ?? 0) >= 75)}
                  {gate("Forecast adoption ≥ 50%", (customer.modules.find(m => m.module === "Forecast")?.featureAdoption ?? 0) >= 50)}
                  {gate("CSM handoff complete", customer.csmReady)}
                  {gate("No open Sev-1 issues", customer.readiness >= 60)}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Invited", value: totals.invited, sub: "seats provisioned", icon: Users },
            { label: "Trained", value: `${totals.trainedPct}%`, sub: `${totals.trained} of ${totals.invited}`, icon: Target },
            { label: "Certified", value: `${totals.certifiedPct}%`, sub: `${totals.certified} of ${totals.invited}`, icon: Award },
            { label: "Weekly active", value: `${totals.dauPct}%`, sub: `${totals.dau} of ${totals.invited}`, icon: Activity },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{s.value}</div>
                <div className="text-[11px] text-muted-foreground">{s.sub}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="curve">
          <TabsList>
            <TabsTrigger value="curve">Adoption curve</TabsTrigger>
            <TabsTrigger value="persona">By persona</TabsTrigger>
            <TabsTrigger value="module">By module</TabsTrigger>
          </TabsList>

          <TabsContent value="curve" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Adoption vs. target</CardTitle>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={customer.timeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" unit="%" />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                    <Line type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" dot={false} name="Target" />
                    <Line type="monotone" dataKey="adoption" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} name="Actual" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="persona" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Persona</TableHead>
                      <TableHead className="text-right">Invited</TableHead>
                      <TableHead>Trained</TableHead>
                      <TableHead>Certified</TableHead>
                      <TableHead>Weekly active</TableHead>
                      <TableHead className="text-right">vs. target</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.personas.map((p) => {
                      const tPct = Math.round((p.trained / p.invited) * 100);
                      const cPct = Math.round((p.certified / p.invited) * 100);
                      const aPct = Math.round((p.activeDAU / p.invited) * 100);
                      const gap = p.activeDAU - p.target;
                      return (
                        <TableRow key={p.persona}>
                          <TableCell className="font-medium">{p.persona}</TableCell>
                          <TableCell className="text-right tabular-nums">{p.invited}</TableCell>
                          <TableCell className="w-[180px]">
                            <div className="flex items-center gap-2">
                              <Progress value={tPct} className="h-1.5" />
                              <span className="w-10 text-right text-xs tabular-nums">{tPct}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="w-[180px]">
                            <div className="flex items-center gap-2">
                              <Progress value={cPct} className="h-1.5" />
                              <span className="w-10 text-right text-xs tabular-nums">{cPct}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="w-[180px]">
                            <div className="flex items-center gap-2">
                              <Progress value={aPct} className="h-1.5" />
                              <span className="w-10 text-right text-xs tabular-nums">{aPct}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 text-xs font-medium",
                                gap >= 0 ? "text-[hsl(155_60%_45%)]" : "text-[hsl(0_75%_55%)]",
                              )}
                            >
                              {gap >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                              {gap >= 0 ? "+" : ""}{gap}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="module" className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Feature adoption by module</CardTitle>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customer.modules} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" stroke="hsl(var(--muted-foreground))" />
                    <YAxis type="category" dataKey="module" tick={{ fontSize: 12 }} width={130} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                    <Bar dataKey="featureAdoption" radius={[0, 4, 4, 0]}>
                      {customer.modules.map((m) => (
                        <Cell key={m.module} fill={readinessColor(m.featureAdoption)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Enablement signals</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      <TableHead className="text-right">Loom views</TableHead>
                      <TableHead className="text-right">Scribe done</TableHead>
                      <TableHead className="text-right">Adoption</TableHead>
                      <TableHead className="text-right">Δ wk</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customer.modules.map((m) => (
                      <TableRow key={m.module}>
                        <TableCell className="font-medium">{m.module}</TableCell>
                        <TableCell className="text-right tabular-nums">{m.loomViews}</TableCell>
                        <TableCell className="text-right tabular-nums">{m.scribeCompletions}</TableCell>
                        <TableCell className="text-right tabular-nums">{m.featureAdoption}%</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={cn(
                              "inline-flex items-center gap-0.5 text-xs font-medium",
                              m.trend > 0 ? "text-[hsl(155_60%_45%)]" : m.trend < 0 ? "text-[hsl(0_75%_55%)]" : "text-muted-foreground",
                            )}
                          >
                            {m.trend > 0 ? <TrendingUp className="h-3 w-3" /> : m.trend < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                            {m.trend > 0 ? "+" : ""}{m.trend}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="text-sm text-muted-foreground">
              Signals wired via Loom API, Scribe API, and product telemetry (PostHog / Amplitude).
            </div>
            <Button asChild variant="outline" size="sm">
              <a href="/integration-setup">Configure sources</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
