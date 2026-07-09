import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle, Lightbulb, Bug, Link2, Plus, Download, Trash2, ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type EntryType = "Risk" | "Assumption" | "Issue" | "Dependency";
type Status = "Open" | "Mitigating" | "Closed" | "Accepted";
type Severity = "Low" | "Medium" | "High" | "Critical";

type Entry = {
  id: string;
  type: EntryType;
  title: string;
  description: string;
  workstream: string;
  owner: string;
  status: Status;
  severity: Severity;
  probability?: "Low" | "Medium" | "High";
  impact?: "Low" | "Medium" | "High";
  mitigation: string;
  dueDate: string;
  raised: string;
};

const TYPE_META: Record<EntryType, { icon: typeof AlertTriangle; color: string; blurb: string }> = {
  Risk: { icon: ShieldAlert, color: "text-destructive bg-destructive/10 border-destructive/30",
    blurb: "Something that could happen and would hurt the implementation." },
  Assumption: { icon: Lightbulb, color: "text-amber-600 bg-amber-500/10 border-amber-500/30",
    blurb: "Something we're proceeding as if true — must be validated." },
  Issue: { icon: Bug, color: "text-orange-600 bg-orange-500/10 border-orange-500/30",
    blurb: "Something that has happened and needs active resolution." },
  Dependency: { icon: Link2, color: "text-sky-600 bg-sky-500/10 border-sky-500/30",
    blurb: "External work or decision the project waits on to proceed." },
};

const STATUS_COLOR: Record<Status, string> = {
  Open: "bg-destructive/15 text-destructive border-destructive/30",
  Mitigating: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Accepted: "bg-muted text-muted-foreground border-border",
  Closed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
};

const SEVERITY_COLOR: Record<Severity, string> = {
  Low: "bg-muted text-muted-foreground",
  Medium: "bg-sky-500/15 text-sky-700",
  High: "bg-amber-500/20 text-amber-800",
  Critical: "bg-destructive/20 text-destructive font-semibold",
};

const WORKSTREAMS = [
  "Handoff", "Discovery", "Firm Model", "Integrations", "Engagement Templates",
  "AI Auto-Scheduler", "UAT & Parallel Run", "Training", "Go-Live", "Hypercare", "CSM Handover",
];

const SEED: Entry[] = [
  {
    id: "R-001", type: "Risk",
    title: "Workday API rate limits could throttle nightly people sync",
    description: "Firm has 2,400 staff and Workday tenant is shared with payroll. Nightly full sync may exceed API budget.",
    workstream: "Integrations", owner: "Solution Consultant",
    status: "Mitigating", severity: "High", probability: "Medium", impact: "High",
    mitigation: "Switch to delta sync with change-token; queue full-refresh weekly on Saturday 02:00.",
    dueDate: "2026-08-12", raised: "2026-07-01",
  },
  {
    id: "R-002", type: "Risk",
    title: "Partner group resistance to AI Auto-Scheduler recommendations",
    description: "Two service line partners have publicly said they don't trust algorithmic staffing.",
    workstream: "AI Auto-Scheduler", owner: "SIC",
    status: "Open", severity: "Critical", probability: "High", impact: "High",
    mitigation: "1:1 briefings with each partner; pilot with Advisory service line first; publish acceptance-rate dashboard weekly.",
    dueDate: "2026-08-01", raised: "2026-07-03",
  },
  {
    id: "A-001", type: "Assumption",
    title: "Practice Engine engagement types map cleanly to Dayshape templates",
    description: "Assumed 1:1 mapping. Not yet validated against actual Practice Engine config.",
    workstream: "Engagement Templates", owner: "SIC",
    status: "Open", severity: "Medium",
    mitigation: "Export Practice Engine engagement catalog in discovery week 2 and reconcile with Head of RM.",
    dueDate: "2026-07-25", raised: "2026-07-05",
  },
  {
    id: "A-002", type: "Assumption",
    title: "SSO via Okta will be ready by build phase",
    description: "IT confirmed verbally; no ticket raised yet.",
    workstream: "Integrations", owner: "IT / InfoSec",
    status: "Open", severity: "High",
    mitigation: "Raise Okta app request ticket by Jul 15; interim access via magic-link auth.",
    dueDate: "2026-07-15", raised: "2026-07-02",
  },
  {
    id: "I-001", type: "Issue",
    title: "Historical bookings export from Retain missing skill-tag column",
    description: "Legacy migration dataset is incomplete — reconciliation cannot proceed without it.",
    workstream: "Firm Model", owner: "SIC",
    status: "Mitigating", severity: "High",
    mitigation: "Retain vendor has confirmed patched export by Jul 18; SIC to re-run reconciliation Jul 19.",
    dueDate: "2026-07-19", raised: "2026-07-08",
  },
  {
    id: "D-001", type: "Dependency",
    title: "Finance sign-off on NetSuite chart-of-accounts mapping",
    description: "Blocks WIP integration and utilization reporting.",
    workstream: "Integrations", owner: "Finance Controller (Customer)",
    status: "Open", severity: "Medium",
    mitigation: "Meeting booked Jul 22 with CFO delegate. Escalation path via Exec Sponsor.",
    dueDate: "2026-07-22", raised: "2026-07-06",
  },
  {
    id: "D-002", type: "Dependency",
    title: "HRIS Owner availability for skills taxonomy workshop",
    description: "Workday admin on PTO through late July.",
    workstream: "Firm Model", owner: "Head of RM",
    status: "Accepted", severity: "Low",
    mitigation: "Workshop rescheduled to Aug 5. No critical path impact.",
    dueDate: "2026-08-05", raised: "2026-07-04",
  },
];

const TABS: { key: EntryType | "All"; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Risk", label: "Risks" },
  { key: "Assumption", label: "Assumptions" },
  { key: "Issue", label: "Issues" },
  { key: "Dependency", label: "Dependencies" },
];

const emptyDraft = (): Entry => ({
  id: "", type: "Risk", title: "", description: "",
  workstream: WORKSTREAMS[0], owner: "SIC",
  status: "Open", severity: "Medium",
  probability: "Medium", impact: "Medium",
  mitigation: "", dueDate: new Date().toISOString().slice(0, 10),
  raised: new Date().toISOString().slice(0, 10),
});

export default function RAIDLog() {
  const [entries, setEntries] = useState<Entry[]>(SEED);
  const [tab, setTab] = useState<EntryType | "All">("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState<Entry>(emptyDraft());

  const counts = useMemo(() => {
    const c: Record<EntryType, number> = { Risk: 0, Assumption: 0, Issue: 0, Dependency: 0 };
    entries.forEach((e) => { if (e.status !== "Closed") c[e.type]++; });
    return c;
  }, [entries]);

  const openCritical = entries.filter((e) => e.severity === "Critical" && e.status !== "Closed").length;

  const filtered = useMemo(
    () => (tab === "All" ? entries : entries.filter((e) => e.type === tab)),
    [tab, entries]
  );

  const nextId = (type: EntryType) => {
    const prefix = { Risk: "R", Assumption: "A", Issue: "I", Dependency: "D" }[type];
    const existing = entries.filter((e) => e.id.startsWith(`${prefix}-`));
    const n = existing.length + 1;
    return `${prefix}-${String(n).padStart(3, "0")}`;
  };

  const addEntry = () => {
    if (!draft.title.trim()) return;
    setEntries((prev) => [{ ...draft, id: nextId(draft.type) }, ...prev]);
    setDialogOpen(false);
    setDraft(emptyDraft());
  };

  const updateStatus = (id: string, status: Status) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));

  const remove = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));

  const exportCSV = () => {
    const header = ["ID", "Type", "Title", "Workstream", "Owner", "Status", "Severity",
      "Probability", "Impact", "Mitigation", "Due Date", "Raised", "Description"];
    const rows = entries.map((e) => [
      e.id, e.type, e.title, e.workstream, e.owner, e.status, e.severity,
      e.probability ?? "", e.impact ?? "", e.mitigation, e.dueDate, e.raised, e.description,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dayshape-raid-log.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">RAID Log</h1>
            <p className="text-muted-foreground mt-1 max-w-3xl">
              Risks, Assumptions, Issues, and Dependencies across the Dayshape implementation.
              Reviewed weekly in the steering committee, exported for the CSM handover.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {openCritical > 0 && (
              <Badge variant="destructive" className="gap-1.5">
                <AlertTriangle className="h-3 w-3" />
                {openCritical} critical open
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> New entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>New RAID entry</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Type</label>
                      <Select value={draft.type} onValueChange={(v) => setDraft({ ...draft, type: v as EntryType })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(Object.keys(TYPE_META) as EntryType[]).map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Workstream</label>
                      <Select value={draft.workstream} onValueChange={(v) => setDraft({ ...draft, workstream: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {WORKSTREAMS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Title</label>
                    <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                      placeholder="One-line summary" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Description</label>
                    <Textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                      rows={2} placeholder="Context and detail" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Mitigation / Action</label>
                    <Textarea value={draft.mitigation} onChange={(e) => setDraft({ ...draft, mitigation: e.target.value })}
                      rows={2} placeholder="What we're doing about it" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Owner</label>
                      <Input value={draft.owner} onChange={(e) => setDraft({ ...draft, owner: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Severity</label>
                      <Select value={draft.severity} onValueChange={(v) => setDraft({ ...draft, severity: v as Severity })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(["Low", "Medium", "High", "Critical"] as Severity[]).map((s) =>
                            <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Due</label>
                      <Input type="date" value={draft.dueDate}
                        onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={addEntry}>Add entry</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(TYPE_META) as EntryType[]).map((t) => {
            const meta = TYPE_META[t];
            const Icon = meta.icon;
            return (
              <Card key={t} className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setTab(t)}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{t}s</div>
                      <div className="text-3xl font-semibold mt-1 tabular-nums">{counts[t]}</div>
                      <div className="text-[11px] text-muted-foreground mt-1">open</div>
                    </div>
                    <div className={cn("h-9 w-9 rounded-lg grid place-items-center border", meta.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-3 leading-snug">{meta.blurb}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs + Table */}
        <Card>
          <CardHeader>
            <CardTitle>Log</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(v) => setTab(v as EntryType | "All")}>
              <TabsList>
                {TABS.map((t) => (
                  <TabsTrigger key={t.key} value={t.key}>{t.label}</TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={tab} className="mt-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[70px]">ID</TableHead>
                        <TableHead className="w-[100px]">Type</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Workstream</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due</TableHead>
                        <TableHead className="w-[40px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                            No entries — you're all clear, or you're not looking hard enough.
                          </TableCell>
                        </TableRow>
                      )}
                      {filtered.map((e, idx) => {
                        const meta = TYPE_META[e.type];
                        const Icon = meta.icon;
                        return (
                          <motion.tr
                            key={e.id}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            className="border-b hover:bg-muted/30"
                          >
                            <TableCell className="font-mono text-xs tabular-nums">{e.id}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn("gap-1", meta.color)}>
                                <Icon className="h-3 w-3" />
                                {e.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[420px]">
                              <div className="text-sm font-medium">{e.title}</div>
                              <div className="text-xs text-muted-foreground line-clamp-2">{e.description}</div>
                              {e.mitigation && (
                                <div className="text-[11px] text-muted-foreground mt-1">
                                  <span className="font-medium">Mitigation:</span> {e.mitigation}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-xs">{e.workstream}</TableCell>
                            <TableCell className="text-xs">{e.owner}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn("text-[10px]", SEVERITY_COLOR[e.severity])}>
                                {e.severity}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Select value={e.status} onValueChange={(v) => updateStatus(e.id, v as Status)}>
                                <SelectTrigger className={cn("h-7 text-xs w-[120px]", STATUS_COLOR[e.status])}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {(["Open", "Mitigating", "Accepted", "Closed"] as Status[]).map((s) =>
                                    <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-xs tabular-nums whitespace-nowrap">{e.dueDate}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="h-7 w-7"
                                onClick={() => remove(e.id)}>
                                <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                              </Button>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
