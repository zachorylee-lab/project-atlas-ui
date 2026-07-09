import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardList, CheckCircle2, Circle, AlertCircle, Download, User2, Building2, Layers,
  CalendarClock, Sparkles, Plug,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Status = "Not started" | "Drafting" | "In review" | "Signed off";

type Section = {
  id: string;
  title: string;
  icon: typeof Building2;
  owner: string;
  approver: string;
  status: Status;
  progress: number;
  summary: string;
  fields: { label: string; value: string; hint?: string }[];
  tables?: { title: string; columns: string[]; rows: string[][] }[];
};

const statusTint: Record<Status, string> = {
  "Not started": "bg-muted text-muted-foreground",
  Drafting: "bg-[hsl(200_70%_50%)]/15 text-[hsl(200_70%_50%)]",
  "In review": "bg-[hsl(30_95%_55%)]/15 text-[hsl(30_95%_55%)]",
  "Signed off": "bg-[hsl(155_60%_45%)]/15 text-[hsl(155_60%_45%)]",
};

type Customer = {
  id: string;
  name: string;
  phase: string;
  daysToGoLive: number;
  sections: Section[];
};

const bakerTilly: Customer = {
  id: "bakertilly",
  name: "Baker Tilly",
  phase: "Build",
  daysToGoLive: 62,
  sections: [
    {
      id: "org",
      title: "Firm & organisational model",
      icon: Building2,
      owner: "Sam Reid (Dayshape SIC)",
      approver: "Priya Patel (Head of Resourcing)",
      status: "Signed off",
      progress: 100,
      summary:
        "Practice hierarchy, offices, service lines, and legal entities that scope every schedule and forecast.",
      fields: [
        { label: "Firm legal name", value: "Baker Tilly US, LLP" },
        { label: "Fiscal year", value: "1 June – 31 May" },
        { label: "Primary time zone", value: "America/New_York" },
        { label: "Reporting currency", value: "USD" },
      ],
      tables: [
        {
          title: "Practices & service lines",
          columns: ["Practice", "Service line", "Head of practice", "Headcount"],
          rows: [
            ["Audit & Assurance", "External Audit", "M. Johnson", "612"],
            ["Audit & Assurance", "Internal Audit", "L. Chen", "88"],
            ["Tax", "Federal", "R. Alvarez", "410"],
            ["Tax", "SALT", "J. Okonkwo", "146"],
            ["Advisory", "Risk & Cyber", "H. Weiss", "220"],
          ],
        },
        {
          title: "Offices & regions",
          columns: ["Office", "Region", "Working week", "Public holiday calendar"],
          rows: [
            ["Chicago HQ", "Central", "Mon–Fri", "US Federal"],
            ["New York", "East", "Mon–Fri", "US Federal + NY"],
            ["London", "EMEA", "Mon–Fri", "UK Bank Holidays"],
          ],
        },
      ],
    },
    {
      id: "grades",
      title: "Grades, roles & rate cards",
      icon: User2,
      owner: "N. Foster (People Ops)",
      approver: "Priya Patel",
      status: "In review",
      progress: 82,
      summary:
        "Career grades, chargeable roles, cost rates, and bill rates that drive utilisation, budget, and margin analytics.",
      fields: [
        { label: "Grade taxonomy", value: "Analyst → Senior → Manager → Sr Manager → Director → Partner" },
        { label: "Rate card version", value: "FY26 v1.2 (effective 01 Jun 2026)" },
        { label: "Cost rate source", value: "Workday HCM (nightly sync)" },
        { label: "Bill rate override rule", value: "Engagement-level override permitted for Advisory only" },
      ],
      tables: [
        {
          title: "Grades",
          columns: ["Grade", "Chargeable", "Default cost/hr", "Default bill/hr", "Target utilisation"],
          rows: [
            ["Analyst", "Yes", "$62", "$180", "82%"],
            ["Senior", "Yes", "$95", "$260", "80%"],
            ["Manager", "Yes", "$140", "$360", "72%"],
            ["Sr Manager", "Yes", "$185", "$460", "65%"],
            ["Director", "Yes", "$240", "$580", "55%"],
            ["Partner", "Partial", "$310", "$780", "45%"],
          ],
        },
      ],
    },
    {
      id: "engagements",
      title: "Engagement types & workflow",
      icon: Layers,
      owner: "Sam Reid",
      approver: "M. Johnson (Audit)",
      status: "Drafting",
      progress: 55,
      summary:
        "Engagement templates, statuses, approval routing, and the mapping from CRM opportunity to Dayshape engagement.",
      fields: [
        { label: "CRM system of record", value: "Salesforce (Opportunity → Engagement on Closed-Won)" },
        { label: "Engagement code format", value: "{Practice}-{FY}-{Seq}  e.g. AUD-26-00184" },
        { label: "Default approval chain", value: "Manager → Partner → Resource Manager" },
        { label: "Budget capture", value: "Hours by grade + fixed fee overlay" },
      ],
      tables: [
        {
          title: "Engagement templates",
          columns: ["Template", "Duration model", "Auto-schedule", "Default team shape"],
          rows: [
            ["Annual audit", "Recurring, calendar-anchored", "Enabled", "1 Partner · 1 Manager · 2 Sr · 4 Analyst"],
            ["Tax compliance – 1120", "Seasonal batch", "Enabled", "1 Manager · 1 Sr · 2 Analyst"],
            ["Advisory engagement", "Fixed-fee, ad-hoc", "Manual only", "Bespoke"],
          ],
        },
      ],
    },
    {
      id: "scheduling",
      title: "Scheduling & forecast rules",
      icon: CalendarClock,
      owner: "Sam Reid",
      approver: "Priya Patel",
      status: "Drafting",
      progress: 40,
      summary:
        "Working patterns, non-chargeable buckets, forecast horizon, and constraints the AI Auto-Scheduler must respect.",
      fields: [
        { label: "Standard working week", value: "37.5h (US) / 37.0h (UK)" },
        { label: "Forecast horizon", value: "Rolling 13 weeks + FY view" },
        { label: "Overbooking tolerance", value: "≤ 5% for Manager+; 0% for Analyst/Senior" },
        { label: "Non-chargeable buckets", value: "Training, Business Development, Admin, PTO" },
      ],
      tables: [
        {
          title: "Auto-scheduler constraints",
          columns: ["Constraint", "Weight", "Notes"],
          rows: [
            ["Independence rules (Audit)", "Hard", "Blocks any prior-year tax staff on same client"],
            ["Grade mix per engagement", "Hard", "From engagement template"],
            ["Office proximity", "Soft", "Prefer same region unless remote-eligible"],
            ["Continuity of team", "Soft", "Favour returning staff from prior year"],
            ["Utilisation smoothing", "Soft", "Level-load across the forecast horizon"],
          ],
        },
      ],
    },
    {
      id: "integrations",
      title: "Integrations & data flows",
      icon: Plug,
      owner: "T. Nguyen (IT)",
      approver: "CIO Office",
      status: "In review",
      progress: 68,
      summary:
        "Source and target systems, cadence, identifiers, and reconciliation owners for each inbound and outbound feed.",
      tables: [
        {
          title: "Inbound feeds",
          columns: ["System", "Object", "Cadence", "Key", "Owner"],
          rows: [
            ["Workday", "Worker + Job", "Nightly 02:00 ET", "Employee ID", "People Ops"],
            ["Salesforce", "Opportunity", "Every 15 min", "Opp ID", "Sales Ops"],
            ["CCH Axcess", "Client + Engagement", "Nightly", "Client Code", "Tax IT"],
            ["Outlook", "Calendar availability", "Real-time (Graph)", "UPN", "IT"],
          ],
        },
        {
          title: "Outbound feeds",
          columns: ["Target", "Payload", "Cadence", "Purpose"],
          rows: [
            ["Snowflake", "Schedules + Forecasts", "Hourly", "Firm-wide BI"],
            ["Power BI", "Utilisation cube", "Daily 06:00", "Partner dashboards"],
            ["NetSuite", "Approved time & fees", "Weekly Friday", "Billing"],
          ],
        },
      ],
      fields: [],
    },
    {
      id: "ai",
      title: "AI Auto-Scheduler tuning",
      icon: Sparkles,
      owner: "Sam Reid",
      approver: "M. Johnson",
      status: "Not started",
      progress: 5,
      summary:
        "Objective weights, guardrails, and human-in-the-loop policy for the auto-scheduler roll-out (Phase 2).",
      fields: [
        { label: "Pilot scope", value: "Audit – Chicago & New York only" },
        { label: "Human-in-the-loop", value: "Manager review required for first 90 days" },
        { label: "Success metrics", value: "≥ 30% reduction in scheduling time; ≤ 2% rework rate" },
      ],
    },
  ],
};

const customers: Customer[] = [bakerTilly];

export default function ConfigurationWorkbook() {
  const [customerId, setCustomerId] = useState(customers[0].id);
  const customer = customers.find((c) => c.id === customerId)!;
  const [activeId, setActiveId] = useState(customer.sections[0].id);
  const active = customer.sections.find((s) => s.id === activeId)!;

  const overall = useMemo(() => {
    const p = Math.round(
      customer.sections.reduce((s, x) => s + x.progress, 0) / customer.sections.length,
    );
    const signed = customer.sections.filter((s) => s.status === "Signed off").length;
    return { p, signed, total: customer.sections.length };
  }, [customer]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <ClipboardList className="h-3.5 w-3.5" />
              Delivery · Build phase
            </div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Configuration Workbook</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              The single source of truth for every Dayshape design decision — firm model, grades,
              engagements, scheduling rules, integrations, and AI tuning. Sign-off here unlocks Testing.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => toast.success("Workbook exported as XLSX")}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="grid gap-6 p-6 md:grid-cols-[260px_1fr]">
              <div className="flex flex-col items-center justify-center rounded-lg bg-muted/40 p-4">
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Design completion</div>
                <div className="mt-2 text-5xl font-semibold tabular-nums text-primary">{overall.p}%</div>
                <Progress value={overall.p} className="mt-3 w-full" />
                <div className="mt-3 text-xs text-muted-foreground">
                  {overall.signed} of {overall.total} sections signed off · {customer.daysToGoLive}d to go-live
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {customer.sections.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveId(s.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-md border bg-card p-3 text-left transition-colors hover:bg-muted/40",
                        activeId === s.id && "border-primary/60 bg-muted/40",
                      )}
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{s.title}</div>
                        <div className="mt-1 flex items-center gap-2">
                          <Progress value={s.progress} className="h-1" />
                          <span className="w-10 text-right text-[11px] tabular-nums text-muted-foreground">{s.progress}%</span>
                        </div>
                      </div>
                      <Badge className={cn("shrink-0 text-[10px] uppercase", statusTint[s.status])}>
                        {s.status}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 lg:grid-cols-[1fr_320px]"
        >
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                      <active.icon className="h-3.5 w-3.5" />
                      Section
                    </div>
                    <CardTitle className="mt-1 text-xl">{active.title}</CardTitle>
                  </div>
                  <Badge className={cn("text-[10px] uppercase", statusTint[active.status])}>
                    {active.status}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{active.summary}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {active.fields.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {active.fields.map((f) => (
                      <div key={f.label} className="rounded-md border bg-muted/20 p-3">
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{f.label}</div>
                        <div className="mt-1 text-sm font-medium">{f.value}</div>
                        {f.hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{f.hint}</div>}
                      </div>
                    ))}
                  </div>
                )}
                {active.tables?.map((t) => (
                  <div key={t.title} className="rounded-md border">
                    <div className="border-b bg-muted/30 px-3 py-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                      {t.title}
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {t.columns.map((c) => <TableHead key={c}>{c}</TableHead>)}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {t.rows.map((r, i) => (
                          <TableRow key={i}>
                            {r.map((cell, j) => (
                              <TableCell key={j} className={j === 0 ? "font-medium" : ""}>{cell}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Open questions for the customer</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g. Confirm whether SALT bill rates should override the FY26 rate card or inherit from Federal..."
                  className="min-h-[100px]"
                />
                <div className="mt-3 flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm">Save draft</Button>
                  <Button size="sm" onClick={() => toast.success("Sent to Priya Patel for review")}>
                    Send for review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Ownership & sign-off</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Section owner</div>
                  <div className="mt-0.5">{active.owner}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Customer approver</div>
                  <div className="mt-0.5">{active.approver}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Target sign-off</div>
                  <Input type="date" defaultValue="2026-08-14" className="mt-1" />
                </div>
                <Button className="w-full" onClick={() => toast.success("Sign-off recorded in RAID log")}>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Mark section signed off
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Sign-off gates for Testing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {customer.sections.map((s) => {
                  const ok = s.status === "Signed off";
                  return (
                    <div key={s.id} className="flex items-center gap-2">
                      {ok ? (
                        <CheckCircle2 className="h-4 w-4 text-[hsl(155_60%_45%)]" />
                      ) : s.progress > 0 ? (
                        <AlertCircle className="h-4 w-4 text-[hsl(30_95%_55%)]" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="truncate">{s.title}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
