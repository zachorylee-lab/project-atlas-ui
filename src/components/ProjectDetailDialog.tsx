import { PHASES } from "@/lib/phases";
import { StatusBadge } from "@/components/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Building2, User, Calendar, ListChecks, MessageSquare,
  CheckCircle2, Clock, Target, Zap, CalendarCheck, LineChart, Database, Handshake, Link2, ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

export type ProjectForDetail = {
  id: string;
  name: string;
  segment: string;
  owner: string;
  phase: number;
  status: "on-track" | "at-risk" | "delayed" | "not-started";
  progress: number;
  startDate: string;
  targetDate: string;
  daysRemaining: number;
};

type PhaseTask = { label: string; done: boolean };

const phaseTasks: Record<number, PhaseTask[]> = {
  0: [
    { label: "Receive signed SOW from sales", done: false },
    { label: "Review firm size, service lines, and modules purchased", done: false },
    { label: "Validate integration systems (HRIS, practice mgmt, finance)", done: false },
    { label: "Assign Senior Implementation Consultant + Solution Consultant", done: false },
    { label: "Schedule internal alignment meeting", done: false },
  ],
  1: [
    { label: "Send kickoff agenda to Head of Resource Management", done: false },
    { label: "Conduct kickoff with COO, Head of RM, HR, IT", done: false },
    { label: "Confirm implementation timeline and milestones", done: false },
    { label: "Introduce team members and roles", done: false },
    { label: "Define success criteria (TTFS, adoption, utilization uplift)", done: false },
    { label: "Distribute project charter for sign-off", done: false },
  ],
  2: [
    { label: "Configure firm hierarchy, offices, service lines, and cost centers", done: false },
    { label: "Load roles, grades, and skills taxonomy", done: false },
    { label: "Build engagement templates by service line", done: false },
    { label: "Wire HRIS + practice management + calendar + finance integrations", done: false },
    { label: "Migrate historical bookings and engagements", done: false },
    { label: "Configure AI Auto-Scheduler preference weightings", done: false },
    { label: "Document configuration decisions", done: false },
  ],
  3: [
    { label: "Prepare UAT scenario test plan", done: false },
    { label: "Set up parallel scheduling in sandbox", done: false },
    { label: "Run first weekly scheduling cycle in Dayshape", done: false },
    { label: "Deliver Resource Manager technical enablement workshop", done: false },
    { label: "Deliver Partner / Service Line briefings", done: false },
    { label: "Log and triage integration + booking defects", done: false },
    { label: "Obtain UAT sign-off from Head of RM and COO", done: false },
  ],
  4: [
    { label: "Finalize go-live runbook", done: false },
    { label: "Execute final HRIS + practice management sync", done: false },
    { label: "Publish first firm-wide schedule", done: false },
    { label: "Run post-cutover smoke tests", done: false },
    { label: "Send firm-wide launch communications", done: false },
    { label: "Notify executive sponsor of go-live confirmation", done: false },
  ],
  5: [
    { label: "Set up daily adoption + integration health monitoring", done: false },
    { label: "Tune AI Auto-Scheduler based on Resource Manager overrides", done: false },
    { label: "Triage and resolve post-launch issues", done: false },
    { label: "Conduct mid-hypercare review with COO + Head of RM", done: false },
    { label: "Gather firm CSAT and adoption metrics", done: false },
    { label: "Prepare BAU handover documentation", done: false },
    { label: "Hand over to Customer Success Manager", done: false },
  ],
};

type Note = { text: string; timestamp: string; author: string };

const seedNotes: Record<string, Note[]> = {
  "1": [
    { text: "COO requested separate utilization dashboards for each region. Reviewing with reporting team.", timestamp: "Mar 25, 2026", author: "Sarah K." },
    { text: "Sandbox tenant provisioned with pilot audit service line. Ready for UAT next week.", timestamp: "Mar 20, 2026", author: "IT" },
  ],
  "2": [
    { text: "CCH Axcess API rate limits tighter than expected — may need to switch to overnight batch for full history.", timestamp: "Mar 28, 2026", author: "Mike R." },
  ],
  "5": [
    { text: "Firm's HR data owner out on leave — Workday reconciliation paused for 1 week.", timestamp: "Mar 18, 2026", author: "Ana P." },
  ],
};

type MilestoneStatus = "done" | "in-progress" | "upcoming" | "at-risk";
type TTVMilestone = {
  label: string;
  owner: string;
  date: string;
  status: MilestoneStatus;
  icon: LucideIcon;
  note?: string;
};

const defaultTTV = (startDate: string, targetDate: string): TTVMilestone[] => [
  { label: "Kickoff Complete", owner: "Senior Implementation Consultant", date: startDate, status: "done", icon: Handshake, note: "Charter signed, RACI distributed" },
  { label: "Firm Model Configured", owner: "Solution Consultant", date: "+2 wks", status: "done", icon: Zap, note: "Offices, service lines, roles, grades, skills loaded" },
  { label: "Integrations Live", owner: "Solution Consultant", date: "+4 wks", status: "in-progress", icon: Database, note: "HRIS + practice management + calendar wired and reconciled" },
  { label: "First Firm-Wide Schedule Published", owner: "Head of Resource Management", date: "+6 wks", status: "upcoming", icon: CalendarCheck, note: "TTFS milestone — first live weekly schedule" },
  { label: "First Forecast Cycle", owner: "Strategy Consultant", date: "+8 wks", status: "upcoming", icon: LineChart, note: "TTFF milestone — first 3-month capacity forecast" },
  { label: "CSM Handover", owner: "Senior Implementation Consultant → CSM", date: targetDate, status: "upcoming", icon: Target, note: "Adoption exit, success plan handover" },
];

const ttvOverrides: Record<string, TTVMilestone[]> = {
  "1": [
    { label: "Kickoff Complete", owner: "E. Cicero (SIC)", date: "Jan 18", status: "done", icon: Handshake, note: "Plante Moran firm-wide RM charter signed" },
    { label: "Firm Model Configured", owner: "R. Patel (SC)", date: "Feb 2", status: "done", icon: Zap, note: "3,600 staff, 9 offices, audit + tax + advisory hierarchy live" },
    { label: "Workday HRIS Wired", owner: "J. Liu (Data)", date: "Feb 18", status: "done", icon: Database, note: "RaaS sync live; JLM propagation < 12h" },
    { label: "First Firm-Wide Schedule Published", owner: "L. Nguyen (RM Lead)", date: "Mar 5", status: "done", icon: CalendarCheck, note: "TTFS = 49 days; audit service line, 78% Auto-Scheduler acceptance" },
    { label: "First Forecast Cycle", owner: "Plante Moran Strategy", date: "Mar 22", status: "in-progress", icon: LineChart, note: "3-year busy-season forecast in partner review" },
    { label: "CSM Handover", owner: "E. Cicero → K. Park", date: "Apr 20", status: "upcoming", icon: Target, note: "Adoption exit + ROI readout scheduled" },
  ],
  "2": [
    { label: "Kickoff Complete", owner: "A. Piggott (SIC)", date: "Feb 4", status: "done", icon: Handshake, note: "Wolf & Company COO aligned on full firm centralization" },
    { label: "Firm Model Configured", owner: "D. Cho (SC)", date: "Feb 20", status: "done", icon: Zap, note: "700 staff, 5 offices, audit + tax hierarchy live" },
    { label: "CCH Axcess Wired", owner: "S. Brooks (Data)", date: "Mar 8", status: "done", icon: Database, note: "12,400 engagements ingested, nightly sync green" },
    { label: "First Firm-Wide Schedule Published", owner: "Wolf RM Team", date: "Mar 24", status: "in-progress", icon: CalendarCheck, note: "First firm-wide schedule in final partner review" },
    { label: "First Forecast Cycle", owner: "M. Alvarez (Strategy)", date: "Apr 2", status: "upcoming", icon: LineChart, note: "3-year capacity forecast — audit + tax" },
    { label: "CSM Handover", owner: "A. Piggott → R. Singh", date: "Apr 5", status: "at-risk", icon: Target, note: "Tight window — depends on partner sign-off" },
  ],
  "5": [
    { label: "Kickoff Complete", owner: "A. Pereira (SIC)", date: "Feb 18", status: "done", icon: Handshake },
    { label: "Firm Model Configured", owner: "T. Yamada (SC)", date: "Mar 4", status: "done", icon: Zap, note: "6,500 staff, 80 offices across UK regions" },
    { label: "Retain → Dayshape Migration", owner: "P. Osei (Data)", date: "Mar 30", status: "at-risk", icon: Database, note: "Historical engagement mapping behind by ~10 days" },
    { label: "First Firm-Wide Schedule Published", owner: "Azets Resourcing", date: "Apr 18", status: "at-risk", icon: CalendarCheck, note: "TTFS slipped; mitigation plan in flight" },
    { label: "First Forecast Cycle", owner: "G. Iyer (Strategy)", date: "May 10", status: "upcoming", icon: LineChart, note: "3-year capacity forecast, regionalized" },
    { label: "CSM Handover", owner: "A. Pereira → H. Kim", date: "May 30", status: "upcoming", icon: Target },
  ],
};

const statusStyles: Record<MilestoneStatus, { dot: string; badge: string; label: string }> = {
  "done":         { dot: "bg-success border-success", badge: "bg-success/10 text-success border-success/20", label: "Complete" },
  "in-progress":  { dot: "bg-primary border-primary ring-4 ring-primary/15", badge: "bg-primary/10 text-primary border-primary/20", label: "In Progress" },
  "upcoming":     { dot: "bg-muted border-muted-foreground/40", badge: "bg-muted text-muted-foreground border-border", label: "Upcoming" },
  "at-risk":      { dot: "bg-warning border-warning ring-4 ring-warning/15", badge: "bg-warning/10 text-warning border-warning/20", label: "At Risk" },
};

interface ProjectDetailDialogProps {
  project: ProjectForDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function relatedIntegrations(label: string): { name: string; category: string }[] {
  const l = label.toLowerCase();
  if (l.includes("firm model") || l.includes("hierarchy")) return [
    { name: "Offices / Service Lines", category: "Firm Model" },
    { name: "Roles & Grades", category: "Firm Model" },
    { name: "Skills Library", category: "Firm Model" },
  ];
  if (l.includes("workday") || l.includes("hris")) return [{ name: "Workday RaaS", category: "HRIS" }, { name: "JLM Sync", category: "People Data" }];
  if (l.includes("cch") || l.includes("practice engine") || l.includes("practice management")) return [
    { name: "CCH Axcess", category: "Practice Management" },
    { name: "Engagement Master", category: "Data" },
  ];
  if (l.includes("integrations")) return [
    { name: "Workday HCM", category: "HRIS" },
    { name: "CCH Axcess / Practice Engine", category: "Practice Management" },
    { name: "Outlook / Google Calendar", category: "Calendar" },
    { name: "NetSuite / Sage Intacct", category: "Finance" },
  ];
  if (l.includes("migration") || l.includes("retain")) return [
    { name: "Retain (source)", category: "Migration" },
    { name: "History Loader", category: "Tooling" },
  ];
  if (l.includes("schedule")) return [
    { name: "AI Auto-Scheduler", category: "Scheduling" },
    { name: "Booking Rules", category: "Configuration" },
  ];
  if (l.includes("forecast")) return [
    { name: "Capacity Forecast", category: "Forecasting" },
    { name: "Scenario Simulation", category: "Forecasting" },
  ];
  if (l.includes("csm")) return [{ name: "Reporting Export", category: "Export" }, { name: "Success Plan", category: "CS" }];
  if (l.includes("kickoff")) return [{ name: "SOW / RACI", category: "Governance" }];
  return [{ name: "—", category: "General" }];
}

export function ProjectDetailDialog({ project, open, onOpenChange }: ProjectDetailDialogProps) {
  const [taskStates, setTaskStates] = useState<Record<string, boolean[]>>({});
  const [notes, setNotes] = useState<Record<string, Note[]>>(seedNotes);
  const [newNote, setNewNote] = useState("");
  const [ttvByProject, setTtvByProject] = useState<Record<string, TTVMilestone[]>>({});
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);

  if (!project) return null;

  const key = project.id;
  const tasks = phaseTasks[project.phase] ?? [];
  const checkedStates = taskStates[key] ?? tasks.map((t) => t.done);
  const doneCount = checkedStates.filter(Boolean).length;

  function toggleTask(idx: number) {
    const updated = [...checkedStates];
    updated[idx] = !updated[idx];
    setTaskStates((prev) => ({ ...prev, [key]: updated }));
  }

  function addNote() {
    if (!newNote.trim()) return;
    const note: Note = { text: newNote.trim(), timestamp: "Just now", author: project.owner };
    setNotes((prev) => ({ ...prev, [key]: [note, ...(prev[key] ?? [])] }));
    setNewNote("");
  }

  const ttv = ttvByProject[key] ?? ttvOverrides[key] ?? defaultTTV(project.startDate, project.targetDate);
  const projectNotes = notes[key] ?? [];
  const ttvDone = ttv.filter((m) => m.status === "done").length;
  const ttvPct = ttv.length ? Math.round((ttvDone / ttv.length) * 100) : 0;

  function updateMilestone(idx: number, patch: Partial<TTVMilestone>) {
    const next = ttv.map((m, i) => (i === idx ? { ...m, ...patch } : m));
    setTtvByProject((prev) => ({ ...prev, [key]: next }));
  }

  const activeMilestone = selectedMilestone !== null ? ttv[selectedMilestone] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto p-0">
        <div className="px-6 pt-6 pb-4">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg">{project.name}</DialogTitle>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{project.segment}</span>
                  <span className="flex items-center gap-1"><User className="h-3 w-3" />{project.owner}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{project.startDate} → {project.targetDate}</span>
                </div>
              </div>
              <StatusBadge status={project.status} />
            </div>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-4 mt-5">
            <div className="rounded-lg border p-3 text-center">
              <p className="text-[11px] text-muted-foreground mb-1">Progress</p>
              <p className="text-xl font-semibold">{project.progress}%</p>
              <Progress value={project.progress} className="h-1 mt-2" />
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-[11px] text-muted-foreground mb-1">Current Phase</p>
              <Badge variant="secondary" className={`phase-badge phase-${PHASES[project.phase]?.id} text-xs`}>
                {PHASES[project.phase]?.label}
              </Badge>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-[11px] text-muted-foreground mb-1">Days Left</p>
              <p className={`text-xl font-semibold ${project.daysRemaining <= 10 ? "text-destructive" : ""}`}>
                {project.daysRemaining}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Phase Timeline</h3>
          <div className="flex items-center gap-0">
            {PHASES.map((phase, i) => {
              const isCurrent = i === project.phase;
              const isCompleted = i < project.phase;
              return (
                <div key={phase.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all",
                      isCompleted && "bg-primary border-primary text-primary-foreground",
                      isCurrent && "border-primary bg-primary/10 text-primary ring-4 ring-primary/15",
                      !isCompleted && !isCurrent && "border-muted bg-muted/50 text-muted-foreground"
                    )}>
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className={cn("text-[10px] mt-1.5 text-center leading-tight", isCurrent ? "font-semibold text-foreground" : "text-muted-foreground")}>
                      {phase.label}
                    </span>
                  </div>
                  {i < PHASES.length - 1 && (
                    <div className={cn("h-0.5 w-full -mt-4", isCompleted ? "bg-primary" : "bg-muted")} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="ttv" className="px-6 pb-6 pt-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="ttv" className="flex items-center gap-1.5 text-xs">
              <Target className="h-3.5 w-3.5" /> TTV ({ttvDone}/{ttv.length})
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-1.5 text-xs">
              <ListChecks className="h-3.5 w-3.5" /> Tasks ({doneCount}/{tasks.length})
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-1.5 text-xs">
              <MessageSquare className="h-3.5 w-3.5" /> Notes ({projectNotes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ttv" className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold">Time-to-Value Timeline</p>
                <p className="text-[11px] text-muted-foreground">Milestones from kickoff to CSM handover · {project.startDate} → {project.targetDate}</p>
              </div>
              <Badge variant="secondary" className="text-[10px]">{ttvPct}% complete</Badge>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full mb-5 overflow-hidden">
              <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${ttvPct}%` }} transition={{ duration: 0.4 }} />
            </div>
            <div className="relative pl-2">
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" aria-hidden />
              <ul className="space-y-4">
                {ttv.map((m, i) => {
                  const s = statusStyles[m.status];
                  const Icon = m.icon;
                  return (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="relative flex gap-3"
                    >
                      <div className={cn("relative z-10 h-9 w-9 shrink-0 rounded-full border-2 bg-background flex items-center justify-center", s.dot)}>
                        {m.status === "done" ? (
                          <CheckCircle2 className="h-4 w-4 text-success-foreground" />
                        ) : (
                          <Icon className={cn("h-4 w-4", m.status === "in-progress" ? "text-primary-foreground" : m.status === "at-risk" ? "text-warning-foreground" : "text-muted-foreground")} />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedMilestone(i)}
                        className="flex-1 min-w-0 text-left rounded-lg border p-3 -mt-0.5 hover:border-primary/50 hover:bg-muted/30 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-medium leading-tight flex items-center gap-1.5">
                            {m.label}
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </p>
                          <Badge variant="outline" className={cn("text-[10px] shrink-0", s.badge)}>{s.label}</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1"><User className="h-3 w-3" />{m.owner}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{m.date}</span>
                        </div>
                        {m.note && <p className="text-xs text-muted-foreground mt-1.5 leading-snug line-clamp-2">{m.note}</p>}
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">{PHASES[project.phase]?.label} phase tasks</p>
              {doneCount === tasks.length && tasks.length > 0 && (
                <Badge className="bg-success/10 text-success border-success/20 text-[10px]">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> All Complete
                </Badge>
              )}
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full mb-4 overflow-hidden">
              <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${tasks.length ? (doneCount / tasks.length) * 100 : 0}%` }} transition={{ duration: 0.3 }} />
            </div>
            <div className="space-y-0.5">
              {tasks.map((task, idx) => {
                const checked = checkedStates[idx];
                return (
                  <label key={idx} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-muted/50", checked && "opacity-60")}>
                    <Checkbox checked={checked} onCheckedChange={() => toggleTask(idx)} />
                    <span className={cn("text-sm", checked && "line-through text-muted-foreground")}>{task.label}</span>
                  </label>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <div className="space-y-3 mb-4">
              <Textarea placeholder="Add a note about this firm…" value={newNote} onChange={(e) => setNewNote(e.target.value)} className="min-h-[80px] text-sm" onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addNote(); }} />
              <button onClick={addNote} disabled={!newNote.trim()} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium disabled:opacity-40 transition-opacity">Add Note</button>
            </div>
            <Separator className="mb-4" />
            {projectNotes.length > 0 ? (
              <div className="space-y-3">
                {projectNotes.map((note, i) => (
                  <div key={i} className="rounded-lg border p-3">
                    <p className="text-sm">{note.text}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" />{note.author}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{note.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">No notes yet. Add one above.</p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>

      <Sheet open={selectedMilestone !== null} onOpenChange={(o) => !o && setSelectedMilestone(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          {activeMilestone && selectedMilestone !== null && (() => {
            const s = statusStyles[activeMilestone.status];
            const Icon = activeMilestone.icon;
            const integrations = relatedIntegrations(activeMilestone.label);
            return (
              <>
                <SheetHeader className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-10 w-10 rounded-full border-2 bg-background flex items-center justify-center", s.dot)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <SheetTitle className="text-base leading-tight">{activeMilestone.label}</SheetTitle>
                      <SheetDescription className="text-xs">
                        {project.name} · Milestone {selectedMilestone + 1} of {ttv.length}
                      </SheetDescription>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px]", s.badge)}>{s.label}</Badge>
                  </div>
                </SheetHeader>

                <div className="mt-6 space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Status</Label>
                      <Select
                        value={activeMilestone.status}
                        onValueChange={(v) => updateMilestone(selectedMilestone, { status: v as MilestoneStatus })}
                      >
                        <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="at-risk">At Risk</SelectItem>
                          <SelectItem value="done">Complete</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Target Date</Label>
                      <Input
                        value={activeMilestone.date}
                        onChange={(e) => updateMilestone(selectedMilestone, { date: e.target.value })}
                        placeholder="e.g. Mar 22"
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Owner</Label>
                    <Input
                      value={activeMilestone.owner}
                      onChange={(e) => updateMilestone(selectedMilestone, { owner: e.target.value })}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Notes</Label>
                    <Textarea
                      value={activeMilestone.note ?? ""}
                      onChange={(e) => updateMilestone(selectedMilestone, { note: e.target.value })}
                      placeholder="Status update, blockers, dependencies…"
                      className="min-h-[100px] text-sm"
                    />
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-[11px] uppercase tracking-wide text-muted-foreground flex items-center gap-1.5 mb-2">
                      <Link2 className="h-3 w-3" /> Related Integrations
                    </Label>
                    <ul className="space-y-1.5">
                      {integrations.map((it, idx) => (
                        <li key={idx} className="flex items-center justify-between rounded-md border px-3 py-2">
                          <span className="text-sm font-medium">{it.name}</span>
                          <Badge variant="secondary" className="text-[10px]">{it.category}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[11px] text-muted-foreground">Changes save automatically</p>
                    <Button size="sm" variant="outline" onClick={() => setSelectedMilestone(null)}>Done</Button>
                  </div>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </Dialog>
  );
}
