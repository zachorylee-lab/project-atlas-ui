import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  DndContext, DragOverlay, closestCorners, PointerSensor,
  useSensor, useSensors, type DragStartEvent, type DragEndEvent,
} from "@dnd-kit/core";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ListChecks, AlertTriangle, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "todo" | "doing" | "blocked" | "done";

type Task = {
  id: string;
  title: string;
  client: string;
  owner: string;
  due: string;
  priority: "P1" | "P2" | "P3";
  status: Status;
};

const initialTasks: Task[] = [
  // Canva Pro
  { id: "t1", title: "Validate Segment → Braze event schema (28 custom events)", client: "Canva Pro", owner: "Me", due: "Apr 12", priority: "P1", status: "doing" },
  { id: "t2", title: "Kickoff agenda + RACI with Lifecycle, Data, Mobile leads", client: "Canva Pro", owner: "Me", due: "Apr 8", priority: "P2", status: "todo" },
  { id: "t3", title: "Engage Mobile Eng for iOS + Android SDK install", client: "Canva Pro", owner: "Onboarding Eng", due: "Apr 15", priority: "P2", status: "todo" },

  // MetLife
  { id: "t4", title: "mParticle audience sync — validate identity resolution", client: "MetLife", owner: "Onboarding Eng", due: "Apr 5", priority: "P1", status: "doing" },
  { id: "t5", title: "Email IP warming week 3 — review engagement gates", client: "MetLife", owner: "Me", due: "Apr 3", priority: "P1", status: "doing" },
  { id: "t6", title: "Schedule Go/No-Go with CMO + Chief Customer Officer", client: "MetLife", owner: "Me", due: "Apr 10", priority: "P1", status: "todo" },

  // Wyndham
  { id: "t7", title: "Hypercare exit report + CSAT survey", client: "Wyndham Hotels", owner: "Me", due: "Apr 22", priority: "P2", status: "todo" },
  { id: "t8", title: "CSM transition meeting + BAU runbook", client: "Wyndham Hotels", owner: "Me", due: "Apr 25", priority: "P3", status: "todo" },

  // Max
  { id: "t9", title: "Issue change order — Iterable content migration scope", client: "Max Streaming", owner: "Me", due: "Apr 4", priority: "P1", status: "blocked" },
  { id: "t10", title: "Risk register — launch date at risk; propose new plan", client: "Max Streaming", owner: "Me", due: "Apr 6", priority: "P1", status: "doing" },

  // Done
  { id: "t11", title: "Submit weekly status report — all customers", client: "All Customers", owner: "Me", due: "Apr 1", priority: "P2", status: "done" },
  { id: "t12", title: "Delivery Hero — first production Canvas live", client: "Delivery Hero", owner: "Me", due: "Mar 28", priority: "P1", status: "done" },
];

const columns: { id: Status; label: string; color: string }[] = [
  { id: "todo", label: "To Do", color: "bg-muted text-muted-foreground" },
  { id: "doing", label: "In Progress", color: "bg-primary/10 text-primary" },
  { id: "blocked", label: "Blocked", color: "bg-destructive/10 text-destructive" },
  { id: "done", label: "Done", color: "bg-emerald-500/10 text-emerald-600" },
];

const priorityStyles = {
  P1: "bg-destructive/10 text-destructive border-destructive/20",
  P2: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  P3: "bg-muted text-muted-foreground border-border",
};

function TaskCard({ task }: { task: Task }) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-sm font-medium leading-snug">{task.title}</p>
          <Badge variant="outline" className={cn("text-[10px] shrink-0", priorityStyles[task.priority])}>
            {task.priority}
          </Badge>
        </div>
        <p className="text-[11px] text-muted-foreground mb-2">{task.client}</p>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><User className="h-3 w-3" />{task.owner}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{task.due}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function DraggableTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
  const style = transform
    ? { transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.4 : 1 }
    : undefined;
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} />
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

export default function PMTasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const activeTask = tasks.find(t => t.id === activeId) ?? null;

  function handleDragStart(e: DragStartEvent) { setActiveId(String(e.active.id)); }
  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const newStatus = String(over.id) as Status;
    if (!columns.find(c => c.id === newStatus)) return;
    setTasks(prev => prev.map(t => (t.id === String(active.id) ? { ...t, status: newStatus } : t)));
  }

  const counts = columns.map(c => ({ ...c, count: tasks.filter(t => t.status === c.id).length }));
  const p1Open = tasks.filter(t => t.priority === "P1" && t.status !== "done").length;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1400px]">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold">DM Task Board</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Daily delivery management board across every active Braze customer onboarding. Drag tasks to update status.
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
                      <ListChecks className="h-3.5 w-3.5" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider">{col.label}</h3>
                    </div>
                    <span className={cn("text-[10px] font-medium rounded-full px-2 py-0.5", col.color)}>{col.count}</span>
                  </div>
                  <DroppableColumn id={col.id}>
                    {colTasks.length > 0 ? (
                      colTasks.map(t => <DraggableTask key={t.id} task={t} />)
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
    </DashboardLayout>
  );
}
