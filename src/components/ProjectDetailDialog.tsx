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
  CheckCircle2, Clock, AlertTriangle,
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
    { label: "Review deal notes and customer expectations", done: false },
    { label: "Validate technical requirements", done: false },
    { label: "Assign implementation lead", done: false },
    { label: "Schedule internal alignment meeting", done: false },
  ],
  1: [
    { label: "Send kickoff agenda to customer", done: false },
    { label: "Conduct kickoff meeting", done: false },
    { label: "Confirm project timeline and milestones", done: false },
    { label: "Introduce team members and roles", done: false },
    { label: "Define success criteria and KPIs", done: false },
    { label: "Distribute project charter for sign-off", done: false },
  ],
  2: [
    { label: "Set up customer environment", done: false },
    { label: "Configure core platform settings", done: false },
    { label: "Build integrations per requirements", done: false },
    { label: "Execute data migration (trial run)", done: false },
    { label: "Develop custom workflows", done: false },
    { label: "Internal QA review", done: false },
    { label: "Document configuration decisions", done: false },
  ],
  3: [
    { label: "Prepare UAT test plan", done: false },
    { label: "Set up test environment with production data", done: false },
    { label: "Conduct functional testing", done: false },
    { label: "Conduct integration testing", done: false },
    { label: "Log and triage defects", done: false },
    { label: "Retest resolved defects", done: false },
    { label: "Obtain UAT sign-off from customer", done: false },
  ],
  4: [
    { label: "Finalize deployment runbook", done: false },
    { label: "Execute production data migration", done: false },
    { label: "Deploy to production", done: false },
    { label: "Run post-deployment smoke tests", done: false },
    { label: "Enable monitoring and alerting", done: false },
    { label: "Send go-live notification to stakeholders", done: false },
  ],
  5: [
    { label: "Set up daily stand-up cadence", done: false },
    { label: "Monitor system health and performance", done: false },
    { label: "Triage and resolve post-launch issues", done: false },
    { label: "Conduct mid-hypercare review with customer", done: false },
    { label: "Gather customer feedback and satisfaction", done: false },
    { label: "Prepare BAU transition documentation", done: false },
    { label: "Hand off to support/CSM team", done: false },
  ],
};

type Note = { text: string; timestamp: string; author: string };

const seedNotes: Record<string, Note[]> = {
  "1": [
    { text: "Customer requested additional SSO integration scope. Reviewing LOE.", timestamp: "Mar 25, 2026", author: "Sarah K." },
    { text: "Testing environment provisioned. Ready for UAT next week.", timestamp: "Mar 20, 2026", author: "DevOps" },
  ],
  "2": [
    { text: "API rate limits may cause issues during peak — flagged to engineering.", timestamp: "Mar 28, 2026", author: "Mike R." },
  ],
  "5": [
    { text: "Customer stakeholder out sick — kickoff tasks paused for 1 week.", timestamp: "Mar 18, 2026", author: "Ana P." },
  ],
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto p-0">
        {/* Header */}
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

          {/* Progress summary */}
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

        {/* Phase Timeline */}
        <div className="px-6 pb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Phase Timeline</h3>
          <div className="flex items-center gap-0">
            {PHASES.map((phase, i) => {
              const isCurrent = i === project.phase;
              const isCompleted = i < project.phase;
              return (
                <div key={phase.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all",
                        isCompleted && "bg-primary border-primary text-primary-foreground",
                        isCurrent && "border-primary bg-primary/10 text-primary ring-4 ring-primary/15",
                        !isCompleted && !isCurrent && "border-muted bg-muted/50 text-muted-foreground"
                      )}
                    >
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className={cn(
                      "text-[10px] mt-1.5 text-center leading-tight",
                      isCurrent ? "font-semibold text-foreground" : "text-muted-foreground"
                    )}>
                      {phase.label}
                    </span>
                  </div>
                  {i < PHASES.length - 1 && (
                    <div className={cn(
                      "h-0.5 w-full -mt-4",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Tabs: Tasks & Notes */}
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
              <p className="text-xs text-muted-foreground">
                {PHASES[project.phase]?.label} phase tasks
              </p>
              {doneCount === tasks.length && tasks.length > 0 && (
                <Badge className="bg-success/10 text-success border-success/20 text-[10px]">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> All Complete
                </Badge>
              )}
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full mb-4 overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${tasks.length ? (doneCount / tasks.length) * 100 : 0}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="space-y-0.5">
              {tasks.map((task, idx) => {
                const checked = checkedStates[idx];
                return (
                  <label
                    key={idx}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                      checked && "opacity-60"
                    )}
                  >
                    <Checkbox checked={checked} onCheckedChange={() => toggleTask(idx)} />
                    <span className={cn("text-sm", checked && "line-through text-muted-foreground")}>
                      {task.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <div className="space-y-3 mb-4">
              <Textarea
                placeholder="Add a note about this project…"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[80px] text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addNote();
                }}
              />
              <button
                onClick={addNote}
                disabled={!newNote.trim()}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium disabled:opacity-40 transition-opacity"
              >
                Add Note
              </button>
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