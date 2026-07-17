import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  ClipboardList, CheckCircle2, Circle, AlertTriangle, Download, Users, MessagesSquare,
  Layers, Target, Workflow, HelpCircle, FileText, Plus, Trash2, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/* Types & storage                                                     */
/* ------------------------------------------------------------------ */

type ReqStatus = "Draft" | "Confirmed" | "Blocked" | "Deferred";
type ReqPriority = "Must" | "Should" | "Could" | "Won't";
type ReqCategory =
  | "Firm Model"
  | "Scheduling Rules"
  | "Engagements"
  | "Forecasting"
  | "Integrations"
  | "Reporting"
  | "Security & Access"
  | "AI Review";

type Requirement = {
  id: string;
  title: string;
  category: ReqCategory;
  priority: ReqPriority;
  status: ReqStatus;
  source: string;      // workshop, stakeholder, doc
  owner: string;       // Red Oak SIC or customer lead
  acceptance: string;  // acceptance criteria
  workstream: string;
  notes: string;
};

const STORAGE_KEY = "red oak.requirements.v1";

const seed: Requirement[] = [
  {
    id: "REQ-001",
    title: "Multi-office firm hierarchy with region rollup",
    category: "Firm Model",
    priority: "Must",
    status: "Confirmed",
    source: "Discovery Workshop 1 · Head of RM",
    owner: "Customer — HR Ops",
    acceptance: "Firm tree loads all 14 offices grouped by 3 regions; utilization rolls up correctly in reports.",
    workstream: "Firm Model",
    notes: "Confirmed with COO; US + EMEA + APAC. No LATAM in phase 1.",
  },
  {
    id: "REQ-002",
    title: "Auto-schedule audit engagements by grade + skill",
    category: "AI Review",
    priority: "Must",
    status: "Confirmed",
    source: "Workshop 3 · Audit Partner",
    owner: "Red Oak — SIC",
    acceptance: "Auto-Scheduler proposals accepted ≥ 65% by RMs on pilot service line within 4 weeks of go-live.",
    workstream: "AI Review",
    notes: "Rules: match grade band, minimum skill score 3/5, respect PTO + non-charge blocks.",
  },
  {
    id: "REQ-003",
    title: "Workday HRIS nightly sync — staff, grades, PTO",
    category: "Integrations",
    priority: "Must",
    status: "Blocked",
    source: "Integrations Workshop",
    owner: "Customer — IT",
    acceptance: "Nightly sync completes < 20 min; 100% match on staff IDs; PTO reflected in scheduler within 24h.",
    workstream: "Integrations",
    notes: "Blocked on Workday API credentials + IT security review. Escalated to sponsor Mar 28.",
  },
  {
    id: "REQ-004",
    title: "Utilization forecast by service line, 13-week rolling",
    category: "Forecasting",
    priority: "Must",
    status: "Draft",
    source: "Managing Partner interview",
    owner: "Customer — Finance",
    acceptance: "Forecast view shows chargeable %, capacity, gap by SL, refreshed weekly.",
    workstream: "Forecast",
    notes: "Need target utilization by grade — awaiting finance model from CFO office.",
  },
  {
    id: "REQ-005",
    title: "Okta SSO with SCIM provisioning",
    category: "Security & Access",
    priority: "Must",
    status: "Confirmed",
    source: "InfoSec review",
    owner: "Customer — IT Security",
    acceptance: "Users provisioned/deprovisioned in Red Oak within 15 min of Okta change.",
    workstream: "Integrations",
    notes: "SAML metadata exchanged; SCIM pending Red Oak enablement toggle.",
  },
  {
    id: "REQ-006",
    title: "Partner approval workflow on staff assignment changes",
    category: "Scheduling Rules",
    priority: "Should",
    status: "Draft",
    source: "Workshop 4 · Partners round-table",
    owner: "Red Oak — Solution Consultant",
    acceptance: "Reassignments > 20 hrs on a partner's job require partner approval before commit.",
    workstream: "Scheduling",
    notes: "Partners disagree on threshold — need decision from Head of RM.",
  },
  {
    id: "REQ-007",
    title: "Legacy Retain job history migrated (2 years)",
    category: "Firm Model",
    priority: "Could",
    status: "Deferred",
    source: "Data workshop",
    owner: "Customer — Data team",
    acceptance: "Read-only historical assignments visible for reporting continuity.",
    workstream: "Data Migration",
    notes: "Deferred to phase 2 — steering committee decision Mar 30.",
  },
];

function load(): Requirement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return seed;
}

function save(items: Requirement[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/* ------------------------------------------------------------------ */
/* Style helpers                                                       */
/* ------------------------------------------------------------------ */

const priorityTint: Record<ReqPriority, string> = {
  Must: "bg-destructive/10 text-destructive border-destructive/30",
  Should: "bg-warning/10 text-warning border-warning/30",
  Could: "bg-primary/10 text-primary border-primary/30",
  "Won't": "bg-muted text-muted-foreground border-border",
};

const statusTint: Record<ReqStatus, string> = {
  Draft: "bg-muted text-muted-foreground",
  Confirmed: "bg-success/10 text-success",
  Blocked: "bg-destructive/10 text-destructive",
  Deferred: "bg-warning/10 text-warning",
};

/* ------------------------------------------------------------------ */
/* Methodology content                                                 */
/* ------------------------------------------------------------------ */

const phases = [
  {
    id: "prep",
    title: "1. Prepare",
    icon: FileText,
    goal: "Land the discovery with context, not a blank page.",
    activities: [
      "Read Sales Handoff pack: signed SOW, modules purchased, sponsor, deal notes.",
      "Pre-read customer artifacts: org chart, current resourcing process, sample reports.",
      "Draft an initial hypothesis of the firm model + workstream map to challenge in the room.",
      "Book workshops: Executive alignment, RM/Ops, Partners, IT/InfoSec, Data, Finance.",
    ],
    outputs: ["Discovery agenda", "Pre-read pack", "Stakeholder map", "Workshop calendar"],
  },
  {
    id: "discover",
    title: "2. Discover",
    icon: MessagesSquare,
    goal: "Understand the firm as it actually works today — not as documented.",
    activities: [
      "Executive workshop: strategic goals, success metrics, Time to First Review target.",
      "Process workshops: current state resourcing walkthrough, pain points, workarounds.",
      "Data workshop: sources of truth (HRIS, practice mgmt, spreadsheets), quality gaps.",
      "Shadow an RM: watch a real scheduling session, capture 'day in the life' friction.",
    ],
    outputs: ["Current-state map", "Pain/opportunity register", "Data inventory", "Stakeholder quotes"],
  },
  {
    id: "define",
    title: "3. Define",
    icon: Target,
    goal: "Translate needs into MoSCoW-prioritized, testable requirements.",
    activities: [
      "Write each requirement with clear acceptance criteria (Given / When / Then).",
      "Tag category, workstream, source, owner. Every 'Must' needs a named accountable.",
      "MoSCoW workshop with sponsor: rank Must / Should / Could / Won't for phase 1.",
      "Flag assumptions and log risks in RAID Log; blockers escalated same day.",
    ],
    outputs: ["Requirements register (this page)", "MoSCoW scope statement", "RAID additions", "Assumption log"],
  },
  {
    id: "validate",
    title: "4. Validate",
    icon: CheckCircle2,
    goal: "Prove requirements are complete, testable, and agreed before build.",
    activities: [
      "Playback sessions with each workstream owner — read requirements back verbatim.",
      "Sign-off gate: sponsor countersigns Confirmed requirements before Configure phase.",
      "Traceability check: every requirement maps to a Configuration Workbook section and a UAT script.",
      "Change control: post-sign-off changes go through impact assessment + steering approval.",
    ],
    outputs: ["Signed requirements baseline", "Config Workbook links", "UAT script skeletons", "Change log"],
  },
];

const workshopTemplates = [
  {
    name: "Executive Alignment (60 min)",
    who: "COO / Managing Partner / Head of RM",
    questions: [
      "What does success look like at 90 days? At 12 months?",
      "What is our target Time to First Review?",
      "What decisions are we willing to standardize across the firm?",
      "Where are you willing to change process to fit Red Oak's model?",
      "Which service line is the pilot, and why?",
    ],
  },
  {
    name: "Resource Manager Deep Dive (90 min)",
    who: "Head of RM + 2-3 RMs",
    questions: [
      "Walk me through scheduling a typical engagement — start to finish.",
      "What are the top 3 things you fight every week?",
      "How do you handle conflicts, PTO, and last-minute changes today?",
      "What reports do partners ask you for repeatedly?",
      "Which of your rules are firm-wide vs local to an office?",
    ],
  },
  {
    name: "Integrations & Data (90 min)",
    who: "IT lead + HRIS owner + Practice Mgmt owner",
    questions: [
      "What is the source of truth for staff, grades, PTO, engagements, financials?",
      "What API access do we have today; what needs procurement or security review?",
      "What refresh cadence is acceptable — real-time, nightly, weekly?",
      "How do you currently reconcile mismatches across systems?",
      "Any InfoSec constraints on where Red Oak can read/write?",
    ],
  },
  {
    name: "Partner Round-Table (45 min)",
    who: "3-5 partners across service lines",
    questions: [
      "What would make you trust Red Oak's assignment more than your own judgment?",
      "What information do you need before approving a staff change?",
      "Which controls are non-negotiable for you as a partner?",
      "What behavior do you want the AI Review to reinforce?",
    ],
  },
];

const goodVsBad = [
  {
    bad: "The system should be fast.",
    good: "Scheduler grid loads < 2 seconds for any RM viewing up to 200 staff over a 4-week window.",
  },
  {
    bad: "Support forecasting.",
    good: "Forecast view shows chargeable %, capacity hours, and gap by service line for a rolling 13-week window, refreshed every Monday 06:00 local.",
  },
  {
    bad: "Sync with HR.",
    good: "Nightly Workday → Red Oak sync of staff, grade, office, PTO completes < 20 min with 100% ID match; failures alert #red oak-integrations.",
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function RequirementsGathering() {
  const [items, setItems] = useState<Requirement[]>(load);
  const [query, setQuery] = useState("");
  const [filterCat, setFilterCat] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<Requirement>>({});

  const stats = useMemo(() => {
    const total = items.length;
    const confirmed = items.filter((i) => i.status === "Confirmed").length;
    const blocked = items.filter((i) => i.status === "Blocked").length;
    const must = items.filter((i) => i.priority === "Must").length;
    const mustConfirmed = items.filter((i) => i.priority === "Must" && i.status === "Confirmed").length;
    const readiness = must === 0 ? 0 : Math.round((mustConfirmed / must) * 100);
    return { total, confirmed, blocked, must, mustConfirmed, readiness };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (filterCat !== "all" && i.category !== filterCat) return false;
      if (filterStatus !== "all" && i.status !== filterStatus) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          i.title.toLowerCase().includes(q) ||
          i.notes.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q) ||
          i.owner.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, query, filterCat, filterStatus]);

  function update(id: string, patch: Partial<Requirement>) {
    const next = items.map((i) => (i.id === id ? { ...i, ...patch } : i));
    setItems(next);
    save(next);
  }

  function remove(id: string) {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    save(next);
    toast.success("Requirement removed");
  }

  function addNew() {
    if (!draft.title || !draft.category) {
      toast.error("Title and category are required");
      return;
    }
    const nextId = `REQ-${String(items.length + 1).padStart(3, "0")}`;
    const r: Requirement = {
      id: nextId,
      title: draft.title!,
      category: draft.category as ReqCategory,
      priority: (draft.priority as ReqPriority) || "Should",
      status: "Draft",
      source: draft.source || "",
      owner: draft.owner || "",
      acceptance: draft.acceptance || "",
      workstream: draft.workstream || "",
      notes: draft.notes || "",
    };
    const next = [r, ...items];
    setItems(next);
    save(next);
    setOpen(false);
    setDraft({});
    toast.success(`${nextId} added`);
  }

  function exportCSV() {
    const headers = ["ID", "Title", "Category", "Priority", "Status", "Source", "Owner", "Workstream", "Acceptance", "Notes"];
    const rows = items.map((i) => [i.id, i.title, i.category, i.priority, i.status, i.source, i.owner, i.workstream, i.acceptance, i.notes]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "red oak-requirements.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported requirements.csv");
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ClipboardList className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-semibold">Requirements Gathering</h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-3xl">
              The discovery method, workshop templates, and living register the SIC uses to turn a signed
              Red Oak SOW into a testable, MoSCoW-prioritized baseline before configuration begins.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-2" /> Add requirement</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>New requirement</DialogTitle></DialogHeader>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs font-medium">Title</label>
                    <Input value={draft.title || ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Auto-schedule audit engagements by grade + skill" />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Category</label>
                    <Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v as ReqCategory })}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {["Firm Model","Scheduling Rules","Engagements","Forecasting","Integrations","Reporting","Security & Access","AI Review"].map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Priority (MoSCoW)</label>
                    <Select value={draft.priority} onValueChange={(v) => setDraft({ ...draft, priority: v as ReqPriority })}>
                      <SelectTrigger><SelectValue placeholder="Should" /></SelectTrigger>
                      <SelectContent>
                        {["Must","Should","Could","Won't"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Source</label>
                    <Input value={draft.source || ""} onChange={(e) => setDraft({ ...draft, source: e.target.value })} placeholder="Workshop 2 · Head of RM" />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Owner</label>
                    <Input value={draft.owner || ""} onChange={(e) => setDraft({ ...draft, owner: e.target.value })} placeholder="Customer — HR Ops" />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Workstream</label>
                    <Input value={draft.workstream || ""} onChange={(e) => setDraft({ ...draft, workstream: e.target.value })} placeholder="Firm Model" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium">Acceptance criteria</label>
                    <Textarea rows={2} value={draft.acceptance || ""} onChange={(e) => setDraft({ ...draft, acceptance: e.target.value })} placeholder="Given ... When ... Then ..." />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium">Notes</label>
                    <Textarea rows={2} value={draft.notes || ""} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={addNew}>Add requirement</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Total requirements", value: stats.total, sub: "All categories" },
            { label: "Confirmed", value: stats.confirmed, sub: "Signed off" },
            { label: "Blocked", value: stats.blocked, sub: "Needs escalation" },
            { label: "Must-haves", value: `${stats.mustConfirmed}/${stats.must}`, sub: "Confirmed / total" },
            { label: "Baseline readiness", value: `${stats.readiness}%`, sub: "Must-haves confirmed" },
          ].map((k) => (
            <Card key={k.label} className="stat-card">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{k.label}</p>
              <p className="text-2xl font-semibold mt-1">{k.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{k.sub}</p>
              {k.label === "Baseline readiness" && <Progress value={stats.readiness} className="h-1.5 mt-2" />}
            </Card>
          ))}
        </div>

        <Tabs defaultValue="register" className="w-full">
          <TabsList>
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="method">Discovery method</TabsTrigger>
            <TabsTrigger value="workshops">Workshop templates</TabsTrigger>
            <TabsTrigger value="quality">Writing quality</TabsTrigger>
          </TabsList>

          {/* Register */}
          <TabsContent value="register" className="space-y-4 mt-4">
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search title, notes, owner, ID..." value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <Select value={filterCat} onValueChange={setFilterCat}>
                <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {["Firm Model","Scheduling Rules","Engagements","Forecasting","Integrations","Reporting","Security & Access","AI Review"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {["Draft","Confirmed","Blocked","Deferred"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[90px]">ID</TableHead>
                    <TableHead>Requirement</TableHead>
                    <TableHead className="w-[140px]">Category</TableHead>
                    <TableHead className="w-[110px]">Priority</TableHead>
                    <TableHead className="w-[130px]">Status</TableHead>
                    <TableHead className="w-[160px]">Owner</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.id}</TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">{r.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{r.acceptance}</div>
                        <div className="text-[10px] text-muted-foreground mt-1">Source: {r.source} · WS: {r.workstream}</div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{r.category}</Badge></TableCell>
                      <TableCell>
                        <Select value={r.priority} onValueChange={(v) => update(r.id, { priority: v as ReqPriority })}>
                          <SelectTrigger className={cn("h-7 text-xs border", priorityTint[r.priority])}><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {["Must","Should","Could","Won't"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select value={r.status} onValueChange={(v) => update(r.id, { status: v as ReqStatus })}>
                          <SelectTrigger className={cn("h-7 text-xs", statusTint[r.status])}><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {["Draft","Confirmed","Blocked","Deferred"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-xs">{r.owner}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => remove(r.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">No requirements match filters.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Method */}
          <TabsContent value="method" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {phases.map((p) => {
                const Icon = p.icon;
                return (
                  <Card key={p.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <CardTitle className="text-base">{p.title}</CardTitle>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{p.goal}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Activities</p>
                        <ul className="space-y-1.5">
                          {p.activities.map((a, i) => (
                            <li key={i} className="text-sm flex gap-2"><Circle className="h-3 w-3 mt-1 shrink-0 text-primary/60" />{a}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Outputs</p>
                        <div className="flex flex-wrap gap-1.5">
                          {p.outputs.map((o) => <Badge key={o} variant="secondary" className="text-[10px]">{o}</Badge>)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Workshops */}
          <TabsContent value="workshops" className="mt-4 space-y-4">
            {workshopTemplates.map((w) => (
              <Card key={w.name}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">{w.name}</CardTitle>
                  </div>
                  <p className="text-xs text-muted-foreground">Attendees: {w.who}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {w.questions.map((q, i) => (
                      <li key={i} className="text-sm flex gap-2"><HelpCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary/60" />{q}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Writing quality */}
          <TabsContent value="quality" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">The INVEST test for a good requirement</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                {[
                  ["Independent", "Doesn't require another requirement to be built first."],
                  ["Negotiable", "Captures the intent, not a locked-in solution."],
                  ["Valuable", "Ties to a stated business outcome or KPI."],
                  ["Estimable", "Small and clear enough to size effort."],
                  ["Small", "Deliverable inside a single workstream sprint."],
                  ["Testable", "Has explicit acceptance criteria — pass/fail."],
                ].map(([t, d]) => (
                  <div key={t} className="border rounded-md p-3">
                    <p className="font-medium text-sm">{t}</p>
                    <p className="text-xs text-muted-foreground mt-1">{d}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Rewrite examples</CardTitle>
                <p className="text-xs text-muted-foreground">Vague vs. testable — the difference between a fight in UAT and a green tick.</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {goodVsBad.map((row, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="border rounded-md p-3 bg-destructive/5">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-destructive font-semibold"><AlertTriangle className="h-3 w-3" /> Vague</div>
                      <p className="text-sm mt-1">{row.bad}</p>
                    </div>
                    <div className="border rounded-md p-3 bg-success/5">
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-success font-semibold"><CheckCircle2 className="h-3 w-3" /> Testable</div>
                      <p className="text-sm mt-1">{row.good}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Workflow className="h-4 w-4 text-primary" /> Traceability</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>Every <Badge variant="outline" className="text-[10px]">Must</Badge> requirement must trace end-to-end:</p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge>Requirement</Badge>→
                  <Badge>Configuration Workbook section</Badge>→
                  <Badge>UAT script</Badge>→
                  <Badge>Sign-off</Badge>
                </div>
                <p className="text-xs text-muted-foreground pt-2">Broken traceability is the #1 cause of scope disputes at go-live. Run the check weekly.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
