import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardCheck, CheckCircle2, XCircle, Clock, AlertTriangle, Play, ChevronRight,
  Bug, ShieldCheck, FileSignature,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Result = "Pass" | "Fail" | "Blocked" | "Not run";
type Severity = "Sev-1" | "Sev-2" | "Sev-3" | "Sev-4";
type Workstream =
  | "Firm Model"
  | "Integrations"
  | "Engagement Mapping"
  | "Scheduling & Forecast"
  | "AI Auto-Scheduler";

type TestScript = {
  id: string;
  workstream: Workstream;
  title: string;
  persona: string;
  steps: number;
  result: Result;
  lastRun?: string;
  tester?: string;
  priority: "Must" | "Should" | "Could";
};

type Defect = {
  id: string;
  script: string;
  summary: string;
  severity: Severity;
  status: "Open" | "In fix" | "Ready to retest" | "Closed";
  owner: string;
};

const resultTint: Record<Result, string> = {
  Pass: "bg-[hsl(155_60%_45%)]/15 text-[hsl(155_60%_45%)]",
  Fail: "bg-[hsl(0_75%_55%)]/15 text-[hsl(0_75%_55%)]",
  Blocked: "bg-[hsl(30_95%_55%)]/15 text-[hsl(30_95%_55%)]",
  "Not run": "bg-muted text-muted-foreground",
};

const sevTint: Record<Severity, string> = {
  "Sev-1": "bg-[hsl(0_75%_55%)]/15 text-[hsl(0_75%_55%)]",
  "Sev-2": "bg-[hsl(30_95%_55%)]/15 text-[hsl(30_95%_55%)]",
  "Sev-3": "bg-[hsl(200_70%_50%)]/15 text-[hsl(200_70%_50%)]",
  "Sev-4": "bg-muted text-muted-foreground",
};

const scripts: TestScript[] = [
  { id: "UAT-001", workstream: "Firm Model", title: "Create new office and inherit holiday calendar", persona: "Admin", steps: 6, result: "Pass", lastRun: "2 Jul", tester: "P. Patel", priority: "Must" },
  { id: "UAT-002", workstream: "Firm Model", title: "Change grade rate mid-year and version rate card", persona: "Admin", steps: 8, result: "Pass", lastRun: "2 Jul", tester: "P. Patel", priority: "Must" },
  { id: "UAT-003", workstream: "Integrations", title: "Workday new-joiner appears in Dayshape within 24h", persona: "People Ops", steps: 4, result: "Pass", lastRun: "3 Jul", tester: "T. Nguyen", priority: "Must" },
  { id: "UAT-004", workstream: "Integrations", title: "Salesforce Closed-Won creates engagement shell", persona: "Sales Ops", steps: 5, result: "Fail", lastRun: "3 Jul", tester: "T. Nguyen", priority: "Must" },
  { id: "UAT-005", workstream: "Integrations", title: "CCH Axcess client sync reconciliation report", persona: "Tax IT", steps: 7, result: "Blocked", lastRun: "3 Jul", tester: "T. Nguyen", priority: "Should" },
  { id: "UAT-006", workstream: "Engagement Mapping", title: "Apply Annual Audit template with independence rule", persona: "Resource Manager", steps: 9, result: "Pass", lastRun: "4 Jul", tester: "S. Reid", priority: "Must" },
  { id: "UAT-007", workstream: "Engagement Mapping", title: "Approval routing – Manager → Partner → RM", persona: "Manager", steps: 6, result: "Fail", lastRun: "4 Jul", tester: "M. Johnson", priority: "Must" },
  { id: "UAT-008", workstream: "Scheduling & Forecast", title: "Book Senior across two overlapping audits — expect warning", persona: "Scheduler", steps: 5, result: "Pass", lastRun: "5 Jul", tester: "A. Diaz", priority: "Must" },
  { id: "UAT-009", workstream: "Scheduling & Forecast", title: "13-week rolling forecast matches Snowflake", persona: "Analyst", steps: 6, result: "Pass", lastRun: "5 Jul", tester: "A. Diaz", priority: "Must" },
  { id: "UAT-010", workstream: "Scheduling & Forecast", title: "PTO request blocks over-allocation on approval", persona: "Consultant", steps: 4, result: "Not run", priority: "Should" },
  { id: "UAT-011", workstream: "AI Auto-Scheduler", title: "Auto-schedule 40 audit engagements — grade mix respected", persona: "Resource Manager", steps: 8, result: "Pass", lastRun: "6 Jul", tester: "S. Reid", priority: "Should" },
  { id: "UAT-012", workstream: "AI Auto-Scheduler", title: "Independence violation is a hard block, not a warning", persona: "Partner", steps: 3, result: "Not run", priority: "Must" },
  { id: "UAT-013", workstream: "AI Auto-Scheduler", title: "Manager-in-the-loop review UX under 30s per assignment", persona: "Manager", steps: 5, result: "Not run", priority: "Should" },
  { id: "UAT-014", workstream: "Firm Model", title: "Deactivate a service line without breaking history", persona: "Admin", steps: 5, result: "Pass", lastRun: "6 Jul", tester: "P. Patel", priority: "Should" },
  { id: "UAT-015", workstream: "Integrations", title: "NetSuite weekly time export reconciles to hour", persona: "Finance", steps: 6, result: "Not run", priority: "Must" },
];

const defects: Defect[] = [
  { id: "DEF-014", script: "UAT-004", summary: "Salesforce oppty with no primary contact fails to map to engagement owner", severity: "Sev-2", status: "In fix", owner: "Dayshape Eng" },
  { id: "DEF-015", script: "UAT-007", summary: "Approval skips Partner when Manager and Partner are the same person", severity: "Sev-1", status: "In fix", owner: "Dayshape Eng" },
  { id: "DEF-016", script: "UAT-005", summary: "CCH Axcess sandbox rate-limited; blocking retest until Monday", severity: "Sev-3", status: "Open", owner: "Baker Tilly IT" },
  { id: "DEF-011", script: "UAT-001", summary: "Holiday calendar picker shows FY25 dates only — fixed in 2026.7.2", severity: "Sev-3", status: "Closed", owner: "Dayshape Eng" },
];

const workstreams: Workstream[] = [
  "Firm Model",
  "Integrations",
  "Engagement Mapping",
  "Scheduling & Forecast",
  "AI Auto-Scheduler",
];

const wsColor: Record<Workstream, string> = {
  "Firm Model": "hsl(200 70% 50%)",
  Integrations: "hsl(280 55% 55%)",
  "Engagement Mapping": "hsl(30 95% 55%)",
  "Scheduling & Forecast": "hsl(155 60% 45%)",
  "AI Auto-Scheduler": "hsl(340 70% 55%)",
};

export default function UATTracker() {
  const [customer, setCustomer] = useState("Baker Tilly");
  const [ws, setWs] = useState<Workstream | "All">("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return scripts.filter((s) =>
      (ws === "All" || s.workstream === ws) &&
      (q === "" || s.title.toLowerCase().includes(q.toLowerCase()) || s.id.toLowerCase().includes(q.toLowerCase())),
    );
  }, [ws, q]);

  const totals = useMemo(() => {
    const t = scripts.length;
    const c = (r: Result) => scripts.filter((s) => s.result === r).length;
    const pass = c("Pass");
    const fail = c("Fail");
    const blocked = c("Blocked");
    const notRun = c("Not run");
    const executed = pass + fail + blocked;
    return {
      t, pass, fail, blocked, notRun,
      execPct: Math.round((executed / t) * 100),
      passPct: executed ? Math.round((pass / executed) * 100) : 0,
    };
  }, []);

  const byWs = useMemo(() => {
    return workstreams.map((w) => {
      const items = scripts.filter((s) => s.workstream === w);
      const pass = items.filter((s) => s.result === "Pass").length;
      const fail = items.filter((s) => s.result === "Fail").length;
      const blocked = items.filter((s) => s.result === "Blocked").length;
      const notRun = items.filter((s) => s.result === "Not run").length;
      const executed = pass + fail + blocked;
      const passPct = executed ? Math.round((pass / executed) * 100) : 0;
      return { workstream: w, total: items.length, pass, fail, blocked, notRun, passPct };
    });
  }, []);

  const openSev1 = defects.filter((d) => d.severity === "Sev-1" && d.status !== "Closed").length;
  const mustNotRun = scripts.filter((s) => s.priority === "Must" && s.result === "Not run").length;
  const mustFail = scripts.filter((s) => s.priority === "Must" && s.result === "Fail").length;
  const readyForSignoff = openSev1 === 0 && mustNotRun === 0 && mustFail === 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <ClipboardCheck className="h-3.5 w-3.5" />
              Delivery · Testing phase
            </div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">UAT Tracker</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Scenario-based test scripts by workstream, tied to defects and the sign-off gate for Go-Live.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={customer} onValueChange={setCustomer}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Baker Tilly">Baker Tilly</SelectItem>
                <SelectItem value="BDO">BDO</SelectItem>
                <SelectItem value="Azets">Azets</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => toast.success("New test cycle created")}>
              <Play className="mr-2 h-4 w-4" /> New cycle
            </Button>
          </div>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="grid gap-6 p-6 md:grid-cols-[260px_1fr]">
              <div className="flex flex-col items-center justify-center rounded-lg bg-muted/40 p-4">
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Cycle 2 · execution</div>
                <div className="mt-2 text-5xl font-semibold tabular-nums text-primary">{totals.execPct}%</div>
                <Progress value={totals.execPct} className="mt-3 w-full" />
                <div className="mt-3 text-xs text-muted-foreground">
                  {totals.passPct}% pass rate on executed scripts
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-sm font-medium">Go-Live sign-off gates</div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <Gate ok={mustNotRun === 0} label={`All 'Must' scripts executed (${mustNotRun} outstanding)`} />
                  <Gate ok={mustFail === 0} label={`No 'Must' scripts failing (${mustFail} failing)`} />
                  <Gate ok={openSev1 === 0} label={`No open Sev-1 defects (${openSev1} open)`} />
                  <Gate ok={totals.passPct >= 90} label={`Overall pass rate ≥ 90% (${totals.passPct}%)`} />
                  <Gate ok={true} label="Customer test lead named" />
                  <Gate ok={readyForSignoff} label="Ready for customer sign-off" strong />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Kpi label="Passed" value={totals.pass} tone="hsl(155 60% 45%)" icon={CheckCircle2} />
          <Kpi label="Failed" value={totals.fail} tone="hsl(0 75% 55%)" icon={XCircle} />
          <Kpi label="Blocked" value={totals.blocked} tone="hsl(30 95% 55%)" icon={AlertTriangle} />
          <Kpi label="Not run" value={totals.notRun} tone="hsl(215 15% 55%)" icon={Clock} />
        </div>

        <Tabs defaultValue="scripts">
          <TabsList>
            <TabsTrigger value="scripts">Test scripts</TabsTrigger>
            <TabsTrigger value="workstreams">By workstream</TabsTrigger>
            <TabsTrigger value="defects">Defects</TabsTrigger>
            <TabsTrigger value="signoff">Sign-off</TabsTrigger>
          </TabsList>

          <TabsContent value="scripts" className="mt-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Search by ID or title..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="max-w-xs"
              />
              <Select value={ws} onValueChange={(v) => setWs(v as Workstream | "All")}>
                <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All workstreams</SelectItem>
                  {workstreams.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="ml-auto text-xs text-muted-foreground">
                {filtered.length} of {scripts.length} scripts
              </div>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[90px]">ID</TableHead>
                      <TableHead>Scenario</TableHead>
                      <TableHead>Workstream</TableHead>
                      <TableHead>Persona</TableHead>
                      <TableHead className="text-right">Steps</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Last run</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((s) => (
                      <TableRow key={s.id} className="cursor-pointer">
                        <TableCell className="font-mono text-xs">{s.id}</TableCell>
                        <TableCell className="font-medium">{s.title}</TableCell>
                        <TableCell>
                          <span
                            className="inline-flex items-center gap-1.5 text-xs"
                            style={{ color: wsColor[s.workstream] }}
                          >
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: wsColor[s.workstream] }} />
                            {s.workstream}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{s.persona}</TableCell>
                        <TableCell className="text-right tabular-nums">{s.steps}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">{s.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("text-[10px]", resultTint[s.result])}>{s.result}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {s.lastRun ? `${s.lastRun} · ${s.tester}` : "—"}
                        </TableCell>
                        <TableCell><ChevronRight className="h-4 w-4 text-muted-foreground" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workstreams" className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Pass rate by workstream</CardTitle></CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byWs} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis type="category" dataKey="workstream" tick={{ fontSize: 12 }} width={150} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                    <Bar dataKey="passPct" radius={[0, 4, 4, 0]}>
                      {byWs.map((r) => <Cell key={r.workstream} fill={wsColor[r.workstream]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Workstream</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Pass</TableHead>
                      <TableHead className="text-right">Fail</TableHead>
                      <TableHead className="text-right">Blocked</TableHead>
                      <TableHead className="text-right">Not run</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {byWs.map((r) => (
                      <TableRow key={r.workstream}>
                        <TableCell className="font-medium">{r.workstream}</TableCell>
                        <TableCell className="text-right tabular-nums">{r.total}</TableCell>
                        <TableCell className="text-right tabular-nums text-[hsl(155_60%_45%)]">{r.pass}</TableCell>
                        <TableCell className="text-right tabular-nums text-[hsl(0_75%_55%)]">{r.fail}</TableCell>
                        <TableCell className="text-right tabular-nums text-[hsl(30_95%_55%)]">{r.blocked}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">{r.notRun}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="defects" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[90px]">ID</TableHead>
                      <TableHead>Summary</TableHead>
                      <TableHead>Script</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Owner</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {defects.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell className="font-mono text-xs">{d.id}</TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Bug className="h-3.5 w-3.5 text-muted-foreground" />
                            {d.summary}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{d.script}</TableCell>
                        <TableCell>
                          <Badge className={cn("text-[10px]", sevTint[d.severity])}>{d.severity}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{d.status}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{d.owner}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signoff" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileSignature className="h-4 w-4" /> Customer sign-off — Baker Tilly, Cycle 2
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Customer test lead</div>
                    <Input defaultValue="Priya Patel — Head of Resourcing" className="mt-1" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Executive sponsor</div>
                    <Input defaultValue="D. Hollingsworth — COO" className="mt-1" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Sign-off date</div>
                    <Input type="date" defaultValue="2026-07-24" className="mt-1" />
                  </div>
                  <Button
                    className="w-full"
                    disabled={!readyForSignoff}
                    onClick={() => toast.success("Sign-off request emailed to Priya Patel")}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    {readyForSignoff ? "Request customer sign-off" : "Gates not yet met"}
                  </Button>
                </div>
                <div className="rounded-md border bg-muted/20 p-4 text-sm">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Sign-off statement</div>
                  <p className="mt-2 leading-relaxed">
                    "Baker Tilly confirms that Dayshape has been tested against the agreed scenarios for
                    Firm Model, Integrations, Engagement Mapping, Scheduling & Forecast, and the AI
                    Auto-Scheduler pilot; that all Sev-1 defects are closed; and that any residual Sev-2/3
                    items are accepted with the mitigations recorded in the RAID log. We approve Go-Live on
                    the agreed cutover date."
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function Kpi({ label, value, tone, icon: Icon }: { label: string; value: number; tone: string; icon: typeof CheckCircle2 }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
          <Icon className="h-4 w-4" style={{ color: tone }} />
        </div>
        <div className="mt-1 text-2xl font-semibold tabular-nums" style={{ color: tone }}>{value}</div>
      </CardContent>
    </Card>
  );
}

function Gate({ ok, label, strong }: { ok: boolean; label: string; strong?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2",
      strong && "border-primary/40 bg-primary/5",
    )}>
      {ok ? (
        <CheckCircle2 className="h-4 w-4 text-[hsl(155_60%_45%)]" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-[hsl(30_95%_55%)]" />
      )}
      <span className={cn("text-sm", strong && "font-medium")}>{label}</span>
    </div>
  );
}
