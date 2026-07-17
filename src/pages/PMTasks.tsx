import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  DndContext, DragOverlay, closestCorners, PointerSensor,
  useSensor, useSensors, type DragStartEvent, type DragEndEvent,
} from "@dnd-kit/core";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  ListChecks, AlertTriangle, Calendar, User, CheckCircle2, Plus,
  ArrowRight, Ban, MessageSquare, Building2, Flag, Link2, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "todo" | "doing" | "blocked" | "done";
type Priority = "P1" | "P2" | "P3";

type Subtask = { label: string; done: boolean };
type Activity = { text: string; ts: string };

type Task = {
  id: string;
  title: string;
  client: string;
  owner: string;
  due: string;
  priority: Priority;
  status: Status;
  description: string;
  subtasks: Subtask[];
  links: { label: string; href: string }[];
  activity: Activity[];
};

const initialTasks: Task[] = [
  {
    id: "t1",
    title: "Validate Workday → Red Oak person + org sync (6,000 staff)",
    client: "Baker Tilly", owner: "Me", due: "Apr 12", priority: "P1", status: "doing",
    description: "Confirm the Workday RaaS reports map cleanly into Red Oak people, offices, and grades. Flag any grade-mapping edge cases and confirm JLM propagation within 24h.",
    subtasks: [
      { label: "Pull current Workday RaaS report specs from firm HR data team", done: true },
      { label: "Diff against Red Oak grade taxonomy (24 grades)", done: true },
      { label: "Identify contractor / secondee edge cases", done: false },
      { label: "Confirm canonical person ID (employee_id)", done: false },
      { label: "Sign-off from Solution Consultant + Baker Tilly HR Data Lead", done: false },
    ],
    links: [
      { label: "Workday tenant", href: "#" },
      { label: "Red Oak grade taxonomy doc", href: "#" },
    ],
    activity: [
      { text: "Created task — pulled in from Baker Tilly kickoff notes", ts: "Apr 1" },
      { text: "Synced with Solution Consultant on canonical ID approach", ts: "Apr 3" },
    ],
  },
  {
    id: "t2",
    title: "Kickoff agenda + RACI with Resource Management, HR, IT leads",
    client: "Baker Tilly", owner: "Me", due: "Apr 8", priority: "P2", status: "todo",
    description: "Draft kickoff agenda + RACI covering Head of RM, HR data owner, IT, Solution Consultant, and CSM. Confirm decision-makers per workstream.",
    subtasks: [
      { label: "Draft 60-min kickoff agenda", done: false },
      { label: "Map RACI across 5 workstreams", done: false },
      { label: "Confirm exec sponsor (COO) attendance", done: false },
      { label: "Send pre-read 48h before", done: false },
    ],
    links: [{ label: "Kickoff template", href: "#" }],
    activity: [{ text: "Task created from Sales Handoff checklist", ts: "Apr 2" }],
  },
  {
    id: "t3",
    title: "Engage IT for Azure AD SSO + SCIM provisioning",
    client: "Baker Tilly", owner: "Solution Consultant", due: "Apr 15", priority: "P2", status: "todo",
    description: "Get Baker Tilly's IT team scoped for SAML SSO and SCIM provisioning. Confirm group-to-role mapping (Resource Manager / Partner / Staff / Admin).",
    subtasks: [
      { label: "Intro call with IT identity lead", done: false },
      { label: "Share Red Oak SSO configuration guide", done: false },
      { label: "Collect Azure AD tenant + app registration details", done: false },
      { label: "Schedule pilot user rollout", done: false },
    ],
    links: [{ label: "Red Oak SSO docs", href: "https://red oak.com/resource-management-software" }],
    activity: [],
  },
  {
    id: "t4",
    title: "CCH Axcess engagement master — validate mapping",
    client: "Wolf & Company", owner: "Solution Consultant", due: "Apr 5", priority: "P1", status: "doing",
    description: "Verify CCH Axcess → Red Oak engagement master lands with correct client, partner, budget, and engagement type. 12,400 engagements in scope.",
    subtasks: [
      { label: "Configure CCH Axcess API integration user", done: true },
      { label: "Map engagement types to Red Oak templates", done: true },
      { label: "Run reconciliation on 1,000 sample engagements", done: false },
      { label: "Validate WIP tie-out with Finance", done: false },
    ],
    links: [{ label: "CCH Axcess config", href: "#" }],
    activity: [
      { text: "Integration user enabled in CCH sandbox", ts: "Apr 1" },
    ],
  },
  {
    id: "t5",
    title: "Parallel scheduling — week 3 reconciliation",
    client: "Wolf & Company", owner: "Me", due: "Apr 3", priority: "P1", status: "doing",
    description: "Week 3 of parallel scheduling against legacy spreadsheets. Reconcile booking deltas > 5% and confirm booking rules behave for busy-season scenarios.",
    subtasks: [
      { label: "Pull week 2 reconciliation report", done: true },
      { label: "Confirm booking delta < 3%", done: true },
      { label: "Investigate 2 partner override discrepancies", done: false },
      { label: "Approve week 4 cutover to Red Oak as primary", done: false },
    ],
    links: [{ label: "Parallel-run report", href: "#" }],
    activity: [{ text: "Week 2 numbers look healthy — 2.1% delta", ts: "Apr 1" }],
  },
  {
    id: "t6",
    title: "Schedule Go/No-Go with Managing Partner + COO",
    client: "Wolf & Company", owner: "Me", due: "Apr 10", priority: "P1", status: "todo",
    description: "Lock 30-min Go/No-Go decision meeting with Wolf exec sponsors before firm-wide schedule cutover.",
    subtasks: [
      { label: "Send invite to MP, COO, Head of RM, CSM, Solution Consultant", done: false },
      { label: "Prep 1-page Go/No-Go deck", done: false },
      { label: "Pre-brief CSM 24h before", done: false },
    ],
    links: [],
    activity: [],
  },
  {
    id: "t7",
    title: "Adoption exit report + CSAT survey",
    client: "Plante Moran", owner: "Me", due: "Apr 22", priority: "P2", status: "todo",
    description: "Wrap Plante Moran hypercare with a written exit report covering KPIs hit, open risks, adoption %, Auto-Scheduler acceptance, and a CSAT survey to the exec sponsor + working team.",
    subtasks: [
      { label: "Compile TTFR / TTAP / on-time metrics", done: false },
      { label: "Compile Auto-Scheduler acceptance rate", done: false },
      { label: "Document open risks for CSM", done: false },
      { label: "Send CSAT survey (5 questions)", done: false },
      { label: "Schedule readout call", done: false },
    ],
    links: [{ label: "Exit report template", href: "#" }],
    activity: [],
  },
  {
    id: "t8",
    title: "CSM handover meeting + BAU runbook",
    client: "Plante Moran", owner: "Me", due: "Apr 25", priority: "P3", status: "todo",
    description: "Handover meeting with incoming CSM Karen P. Walk through BAU runbook, integration map, and known quirks.",
    subtasks: [
      { label: "Draft BAU runbook", done: false },
      { label: "Schedule 60-min walkthrough with CSM", done: false },
      { label: "Introduce CSM to firm working team", done: false },
    ],
    links: [],
    activity: [],
  },
  {
    id: "t9",
    title: "Issue change order — Retain historical migration scope",
    client: "Azets UK", owner: "Me", due: "Apr 4", priority: "P1", status: "blocked",
    description: "Historical engagement mapping ballooned from ~80 to ~140 engagement types. Need formal change order + firm sign-off before Solution Consultant continues.",
    subtasks: [
      { label: "Estimate revised effort with Solution Consultant", done: true },
      { label: "Draft change order", done: true },
      { label: "Firm procurement sign-off", done: false },
      { label: "Update SOW + timeline", done: false },
    ],
    links: [{ label: "Original SOW", href: "#" }],
    activity: [
      { text: "Blocked: waiting on Azets procurement", ts: "Apr 2" },
    ],
  },
  {
    id: "t10",
    title: "Risk register — launch date at risk; propose new plan",
    client: "Azets UK", owner: "Me", due: "Apr 6", priority: "P1", status: "doing",
    description: "TTFR slip likely. Update risk register with mitigation options: (a) reduce migration scope, (b) push launch 2 weeks, (c) phased launch by region.",
    subtasks: [
      { label: "Quantify slip impact (days + $ ARR risk)", done: true },
      { label: "Draft 3 mitigation options", done: false },
      { label: "Review with CSM + AE", done: false },
      { label: "Present to firm steering committee", done: false },
    ],
    links: [],
    activity: [],
  },
  {
    id: "t11",
    title: "Submit weekly status report — all firms",
    client: "All Firms", owner: "Me", due: "Apr 1", priority: "P2", status: "done",
    description: "Standard weekly status report across all 6 active implementations.",
    subtasks: [
      { label: "Compile per-firm status", done: true },
      { label: "Flag risks to Director, Professional Services", done: true },
      { label: "Send to portfolio distro", done: true },
    ],
    links: [],
    activity: [{ text: "Submitted Apr 1", ts: "Apr 1" }],
  },
  {
    id: "t12",
    title: "Bennett Thrasher — first firm-wide schedule published",
    client: "Bennett Thrasher", owner: "Me", due: "Mar 28", priority: "P1", status: "done",
    description: "First firm-wide weekly schedule published across audit + tax. Achieved Time to First Review at day 41.",
    subtasks: [
      { label: "QA schedule in sandbox tenant", done: true },
      { label: "Firm sign-off", done: true },
      { label: "Publish schedule to first 100 staff", done: true },
      { label: "Roll out to full firm after 48h", done: true },
    ],
    links: [],
    activity: [{ text: "Published Mar 28 — 84% Auto-Scheduler acceptance rate", ts: "Mar 28" }],
  },
];

const columns: { id: Status; label: string; color: string }[] = [
  { id: "todo", label: "To Do", color: "bg-muted text-muted-foreground" },
  { id: "doing", label: "In Progress", color: "bg-primary/10 text-primary" },
  { id: "blocked", label: "Blocked", color: "bg-destructive/10 text-destructive" },
  { id: "done", label: "Done", color: "bg-emerald-500/10 text-emerald-600" },
];

const priorityStyles: Record<Priority, string> = {
  P1: "bg-destructive/10 text-destructive border-destructive/20",
  P2: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  P3: "bg-muted text-muted-foreground border-border",
};

const statusLabels: Record<Status, string> = {
  todo: "To Do", doing: "In Progress", blocked: "Blocked", done: "Done",
};

function TaskCard({ task, onClick }: { task: Task; onClick?: () => void }) {
  const done = task.subtasks.filter(s => s.done).length;
  const total = task.subtasks.length;
  return (
    <Card
      onClick={onClick}
      className="hover:shadow-md hover:border-primary/40 transition-all cursor-pointer"
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-sm font-medium leading-snug">{task.title}</p>
          <Badge variant="outline" className={cn("text-[10px] shrink-0", priorityStyles[task.priority])}>
            {task.priority}
          </Badge>
        </div>
        <p className="text-[11px] text-muted-foreground mb-2">{task.client}</p>
        {total > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(done / total) * 100}%` }} />
            </div>
            <span className="text-[10px] text-muted-foreground tabular-nums">{done}/{total}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><User className="h-3 w-3" />{task.owner}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{task.due}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function DraggableTask({ task, onOpen }: { task: Task; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style = transform
    ? { transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.4 : 1 }
    : undefined;
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
      <TaskCard task={task} onClick={onOpen} />
    </div>
  );
}

function DroppableColumn({ id, children }: { id: Status; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={cn("space-y-2 min-h-[200px] p-2 rounded-lg transition-colors", isOver && "bg-primary/5 ring-2 ring-primary/20")}>
      {children}
    </div>
  );
}

function TaskDetailDialog({
  task, open, onOpenChange, onUpdate,
}: {
  task: Task | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onUpdate: (t: Task) => void;
}) {
  const [newSubtask, setNewSubtask] = useState("");
  const [newComment, setNewComment] = useState("");

  if (!task) return null;

  const doneCount = task.subtasks.filter(s => s.done).length;
  const pct = task.subtasks.length ? Math.round((doneCount / task.subtasks.length) * 100) : 0;

  function patch(p: Partial<Task>) { onUpdate({ ...task!, ...p }); }

  function toggleSubtask(idx: number) {
    const next = task!.subtasks.map((s, i) => i === idx ? { ...s, done: !s.done } : s);
    patch({ subtasks: next });
  }
  function addSubtask() {
    if (!newSubtask.trim()) return;
    patch({ subtasks: [...task!.subtasks, { label: newSubtask.trim(), done: false }] });
    setNewSubtask("");
  }
  function addComment() {
    if (!newComment.trim()) return;
    patch({ activity: [{ text: newComment.trim(), ts: "Just now" }, ...task!.activity] });
    setNewComment("");
  }
  function advance(to: Status) {
    patch({
      status: to,
      activity: [{ text: `Status moved to ${statusLabels[to]}`, ts: "Just now" }, ...task!.activity],
    });
  }
  function completeAll() {
    patch({
      status: "done",
      subtasks: task!.subtasks.map(s => ({ ...s, done: true })),
      activity: [{ text: "All subtasks completed, task marked Done", ts: "Just now" }, ...task!.activity],
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base leading-tight pr-4">{task.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-3 mt-1.5 text-xs">
                <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{task.client}</span>
                <span className="flex items-center gap-1"><User className="h-3 w-3" />{task.owner}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{task.due}</span>
              </DialogDescription>
            </div>
            <Badge variant="outline" className={cn("text-[10px]", priorityStyles[task.priority])}>{task.priority}</Badge>
          </div>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 pt-1">
          {task.status !== "doing" && task.status !== "done" && (
            <Button size="sm" onClick={() => advance("doing")}>
              <ArrowRight className="h-3.5 w-3.5" /> Start work
            </Button>
          )}
          {task.status !== "blocked" && task.status !== "done" && (
            <Button size="sm" variant="outline" onClick={() => advance("blocked")}>
              <Ban className="h-3.5 w-3.5" /> Mark blocked
            </Button>
          )}
          {task.status !== "done" && (
            <Button size="sm" variant="outline" onClick={completeAll}>
              <CheckCircle2 className="h-3.5 w-3.5" /> Complete all
            </Button>
          )}
        </div>

        <Separator />

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Status</Label>
            <Select value={task.status} onValueChange={(v) => advance(v as Status)}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {columns.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Priority</Label>
            <Select value={task.priority} onValueChange={(v) => patch({ priority: v as Priority })}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="P1">P1 — Critical</SelectItem>
                <SelectItem value="P2">P2 — High</SelectItem>
                <SelectItem value="P3">P3 — Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Due</Label>
            <Input value={task.due} onChange={(e) => patch({ due: e.target.value })} className="h-9 text-sm" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">Description</Label>
          <Textarea value={task.description} onChange={(e) => patch({ description: e.target.value })} className="min-h-[70px] text-sm" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <ListChecks className="h-3 w-3" /> Subtasks ({doneCount}/{task.subtasks.length})
            </Label>
            <span className="text-[10px] text-muted-foreground tabular-nums">{pct}%</span>
          </div>
          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="space-y-0.5">
            {task.subtasks.map((s, idx) => (
              <label key={idx} className={cn("flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted/50 transition-colors", s.done && "opacity-60")}>
                <Checkbox checked={s.done} onCheckedChange={() => toggleSubtask(idx)} />
                <span className={cn("text-sm", s.done && "line-through text-muted-foreground")}>{s.label}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <Input value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addSubtask(); }} placeholder="Add a subtask…" className="h-8 text-sm" />
            <Button size="sm" variant="outline" onClick={addSubtask} disabled={!newSubtask.trim()}><Plus className="h-3.5 w-3.5" /></Button>
          </div>
        </div>

        {task.links.length > 0 && (
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Link2 className="h-3 w-3" /> Related
            </Label>
            <div className="flex flex-wrap gap-2">
              {task.links.map((l, i) => (
                <a key={i} href={l.href} className="text-xs px-2.5 py-1 rounded-md border hover:bg-muted/50 transition-colors">{l.label}</a>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-[11px] uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
            <MessageSquare className="h-3 w-3" /> Activity
          </Label>
          <div className="flex gap-2">
            <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Log an update…" className="min-h-[60px] text-sm" />
            <Button size="sm" onClick={addComment} disabled={!newComment.trim()}>Post</Button>
          </div>
          {task.activity.length > 0 ? (
            <ul className="space-y-1.5 pt-1">
              {task.activity.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <Clock className="h-3 w-3 mt-0.5 text-muted-foreground shrink-0" />
                  <span className="flex-1">{a.text}</span>
                  <span className="text-muted-foreground shrink-0">{a.ts}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground italic">No activity yet.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PMTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const activeTask = tasks.find(t => t.id === activeId) ?? null;
  const openTask = tasks.find(t => t.id === openTaskId) ?? null;

  function handleDragStart(e: DragStartEvent) { setActiveId(String(e.active.id)); }
  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const newStatus = String(over.id) as Status;
    if (!columns.find(c => c.id === newStatus)) return;
    setTasks(prev => prev.map(t => (t.id === String(active.id) ? { ...t, status: newStatus } : t)));
  }

  function updateTask(updated: Task) {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
  }

  const counts = columns.map(c => ({ ...c, count: tasks.filter(t => t.status === c.id).length }));
  const p1Open = tasks.filter(t => t.priority === "P1" && t.status !== "done").length;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1400px]">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold">Consultant Task Board</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Daily implementation board across every active Red Oak firm rollout. Click a task to open details, manage subtasks, log activity, or update status. Drag to move between columns.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="stat-card">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Open Tasks</p>
            <p className="text-2xl font-semibold mt-2">{tasks.filter(t => t.status !== "done").length}</p>
          </Card>
          <Card className="stat-card">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">P1 Open</p>
            <p className="text-2xl font-semibold mt-2 text-destructive flex items-center gap-2">
              {p1Open} <AlertTriangle className="h-4 w-4" />
            </p>
          </Card>
          <Card className="stat-card">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">In Progress</p>
            <p className="text-2xl font-semibold mt-2">{tasks.filter(t => t.status === "doing").length}</p>
          </Card>
          <Card className="stat-card">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Done This Week</p>
            <p className="text-2xl font-semibold mt-2">{tasks.filter(t => t.status === "done").length}</p>
          </Card>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {counts.map(col => {
              const colTasks = tasks.filter(t => t.status === col.id);
              return (
                <div key={col.id} className="rounded-xl bg-muted/40 border p-3">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <Flag className="h-3.5 w-3.5" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider">{col.label}</h3>
                    </div>
                    <span className={cn("text-[10px] font-medium rounded-full px-2 py-0.5", col.color)}>{col.count}</span>
                  </div>
                  <DroppableColumn id={col.id}>
                    {colTasks.length > 0 ? (
                      colTasks.map(t => <DraggableTask key={t.id} task={t} onOpen={() => setOpenTaskId(t.id)} />)
                    ) : (
                      <div className="flex items-center justify-center h-[100px] rounded-lg border border-dashed text-xs text-muted-foreground">
                        No tasks
                      </div>
                    )}
                  </DroppableColumn>
                </div>
              );
            })}
          </div>
          <DragOverlay>
            {activeTask ? (
              <div className="opacity-90 rotate-1 scale-105">
                <TaskCard task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <TaskDetailDialog task={openTask} open={openTaskId !== null} onOpenChange={(o) => !o && setOpenTaskId(null)} onUpdate={updateTask} />
    </DashboardLayout>
  );
}
