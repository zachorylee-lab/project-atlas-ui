import { PHASES } from "@/lib/phases";
import { StatusBadge } from "@/components/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2, User, Calendar, ListChecks, MessageSquare,
  CheckCircle2, Clock, Target, Zap, Send, Workflow, Database, Handshake,
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
    { label: "Review property portfolio details and unit count", done: false },
    { label: "Validate payment processing requirements", done: false },
    { label: "Assign onboarding specialist", done: false },
    { label: "Schedule internal alignment meeting", done: false },
  ],
  1: [
    { label: "Send kickoff agenda to property manager", done: false },
    { label: "Conduct kickoff meeting", done: false },
    { label: "Confirm onboarding timeline and milestones", done: false },
    { label: "Introduce team members and roles", done: false },
    { label: "Define success criteria (collection rate, adoption targets)", done: false },
    { label: "Distribute onboarding charter for sign-off", done: false },
  ],
  2: [
    { label: "Configure payment gateway and bank accounts", done: false },
    { label: "Set up property portfolio in RentFlow", done: false },
    { label: "Import tenant and lease data", done: false },
    { label: "Build rent collection schedules and late fee rules", done: false },
    { label: "Configure tenant portal branding", done: false },
    { label: "Internal QA review of payment flows", done: false },
    { label: "Document configuration decisions", done: false },
  ],
  3: [
    { label: "Prepare payment flow test plan", done: false },
    { label: "Set up test environment with sample tenants", done: false },
    { label: "Conduct ACH and card payment testing", done: false },
    { label: "Test autopay enrollment and cancellation", done: false },
    { label: "Log and triage payment discrepancies", done: false },
    { label: "Retest resolved issues", done: false },
    { label: "Obtain UAT sign-off from property manager", done: false },
  ],
  4: [
    { label: "Finalize payment activation runbook", done: false },
    { label: "Execute final tenant data sync", done: false },
    { label: "Activate live payment processing", done: false },
    { label: "Run post-activation smoke tests", done: false },
    { label: "Send tenant welcome communications", done: false },
    { label: "Notify property manager of go-live confirmation", done: false },
  ],
  5: [
    { label: "Set up daily payment monitoring cadence", done: false },
    { label: "Monitor collection rates and failure patterns", done: false },
    { label: "Triage and resolve post-launch payment issues", done: false },
    { label: "Conduct mid-hypercare review with property manager", done: false },
    { label: "Gather property manager satisfaction feedback", done: false },
    { label: "Prepare BAU transition documentation", done: false },
    { label: "Hand off to support/CSM team", done: false },
  ],
};

type Note = { text: string; timestamp: string; author: string };

const seedNotes: Record<string, Note[]> = {
  "1": [
    { text: "PM requested separate bank accounts for each property entity. Reviewing with payments team.", timestamp: "Mar 25, 2026", author: "Sarah K." },
    { text: "Test environment provisioned with 50 sample tenants. Ready for UAT next week.", timestamp: "Mar 20, 2026", author: "DevOps" },
  ],
  "2": [
    { text: "ACH processing delay with tenant's bank — may need to switch to same-day ACH.", timestamp: "Mar 28, 2026", author: "Mike R." },
  ],
  "5": [
    { text: "Property manager's accounting lead out on leave — financial reconciliation paused for 1 week.", timestamp: "Mar 18, 2026", author: "Ana P." },
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
  { label: "Kickoff Complete", owner: "Delivery Manager", date: startDate, status: "done", icon: Handshake, note: "Charter signed, RACI distributed" },
  { label: "SDK Integrated (Dev)", owner: "Technical Architect", date: "+2 wks", status: "done", icon: Zap, note: "iOS / Android / Web SDKs initialized" },
  { label: "Data Pipeline Live", owner: "Onboarding Engineer", date: "+4 wks", status: "in-progress", icon: Database, note: "Segment / mParticle / CDI events flowing" },
  { label: "First Production Send", owner: "Lifecycle Lead (Customer)", date: "+6 wks", status: "upcoming", icon: Send, note: "TTFS milestone — Email or Push" },
  { label: "First Canvas Live", owner: "Strategy Consultant", date: "+8 wks", status: "upcoming", icon: Workflow, note: "TTFC milestone — multi-step journey" },
  { label: "CSM Transition", owner: "Delivery Manager → CSM", date: targetDate, status: "upcoming", icon: Target, note: "Hypercare exit, success plan handoff" },
];

const ttvOverrides: Record<string, TTVMilestone[]> = {
  "1": [
    { label: "Kickoff Complete", owner: "E. Cicero (DM)", date: "Jan 18", status: "done", icon: Handshake, note: "Wyndham loyalty re-engagement charter signed" },
    { label: "SDK Integrated", owner: "R. Patel (TA)", date: "Feb 2", status: "done", icon: Zap, note: "iOS + Android SDK v9 live, push tokens flowing" },
    { label: "Segment CDP Wired", owner: "J. Liu (OE)", date: "Feb 18", status: "done", icon: Database, note: "Loyalty events streaming, identity resolution validated" },
    { label: "First Production Send", owner: "Wyndham Lifecycle", date: "Mar 5", status: "done", icon: Send, note: "TTFS = 49 days; tier-up email, 38% open rate" },
    { label: "First Canvas Live", owner: "L. Nguyen (Strategy)", date: "Mar 22", status: "in-progress", icon: Workflow, note: "Welcome → tier-up → win-back, 4-step journey in QA" },
    { label: "CSM Transition", owner: "E. Cicero → K. Park", date: "Apr 20", status: "upcoming", icon: Target, note: "Hypercare exit + ROI readout scheduled" },
  ],
  "2": [
    { label: "Kickoff Complete", owner: "A. Piggott (DM)", date: "Feb 4", status: "done", icon: Handshake, note: "MetLife exec sponsor aligned on 90M user scope" },
    { label: "SDK Integrated", owner: "D. Cho (TA)", date: "Feb 20", status: "done", icon: Zap, note: "Web SDK live; native deferred to phase 2" },
    { label: "mParticle Pipeline Live", owner: "S. Brooks (OE)", date: "Mar 8", status: "done", icon: Database, note: "24M profiles ingested, audience sync nightly" },
    { label: "First Production Send", owner: "MetLife Lifecycle", date: "Mar 24", status: "in-progress", icon: Send, note: "Policy renewal email in final compliance review" },
    { label: "First Canvas Live", owner: "M. Alvarez (Strategy)", date: "Apr 2", status: "upcoming", icon: Workflow, note: "Lifecycle journey — email + SMS branching" },
    { label: "CSM Transition", owner: "A. Piggott → R. Singh", date: "Apr 5", status: "at-risk", icon: Target, note: "Tight window — depends on compliance sign-off" },
  ],
  "5": [
    { label: "Kickoff Complete", owner: "A. Pereira (DM)", date: "Feb 18", status: "done", icon: Handshake },
    { label: "SDK Integrated", owner: "T. Yamada (TA)", date: "Mar 4", status: "done", icon: Zap, note: "Roku + iOS + Android" },
    { label: "Iterable→Braze Migration", owner: "P. Osei (OE)", date: "Mar 30", status: "at-risk", icon: Database, note: "Content library mapping behind by ~10 days" },
    { label: "First Production Send", owner: "Max Lifecycle", date: "Apr 18", status: "at-risk", icon: Send, note: "TTFS slipped; mitigation plan in flight" },
    { label: "First Canvas Live", owner: "G. Iyer (Strategy)", date: "May 10", status: "upcoming", icon: Workflow, note: "Churn save journey, push + email" },
    { label: "CSM Transition", owner: "A. Pereira → H. Kim", date: "May 30", status: "upcoming", icon: Target },
  ],
};

const statusStyles: Record<MilestoneStatus, { dot: string; badge: string; label: string }> = {
  "done": { dot: "bg-success border-success", badge: "bg-success/10 text-success border-success/20", label: "Complete" },
  "in-progress": { dot: "bg-primary border-primary ring-4 ring-primary/15", badge: "bg-primary/10 text-primary border-primary/20", label: "In Progress" },
  "upcoming": { dot: "bg-muted border-muted-foreground/40", badge: "bg-muted text-muted-foreground border-border", label: "Upcoming" },
  "at-risk": { dot: "bg-warning border-warning ring-4 ring-warning/15", badge: "bg-warning/10 text-warning border-warning/20", label: "At Risk" },
};

interface ProjectDetailDialogProps {
  project: ProjectForDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailDialog({ project, open, onOpenChange }: ProjectDetailDialogProps) {
  const [taskStates, setTaskStates] = useState<Record<string, boolean[]>>({});
  const [notes, setNotes] = useState<Record<string, Note[]>>(seedNotes);
  const [newNote, setNewNote] = useState("");

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

  const projectNotes = notes[key] ?? [];
  const ttv = ttvOverrides[key] ?? defaultTTV(project.startDate, project.targetDate);
  const ttvDone = ttv.filter((m) => m.status === "done").length;
  const ttvPct = ttv.length ? Math.round((ttvDone / ttv.length) * 100) : 0;

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

        <Tabs defaultValue="tasks" className="px-6 pb-6 pt-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="tasks" className="flex items-center gap-1.5 text-xs">
              <ListChecks className="h-3.5 w-3.5" /> Tasks ({doneCount}/{tasks.length})
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-1.5 text-xs">
              <MessageSquare className="h-3.5 w-3.5" /> Notes ({projectNotes.length})
            </TabsTrigger>
          </TabsList>

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
              <Textarea placeholder="Add a note about this account…" value={newNote} onChange={(e) => setNewNote(e.target.value)} className="min-h-[80px] text-sm" onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addNote(); }} />
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
    </Dialog>
  );
}
