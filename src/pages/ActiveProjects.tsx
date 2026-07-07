import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { PhaseIndicator } from "@/components/PhaseIndicator";
import { ProjectDetailDialog } from "@/components/ProjectDetailDialog";
import { PHASES } from "@/lib/phases";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, User, Building2, List, Columns3 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DndContext, DragOverlay, closestCorners, PointerSensor,
  useSensor, useSensors, type DragStartEvent, type DragEndEvent,
} from "@dnd-kit/core";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

type Project = {
  id: string; name: string; segment: string; owner: string;
  phase: number; status: "on-track" | "at-risk" | "delayed" | "not-started";
  progress: number; startDate: string; targetDate: string; daysRemaining: number;
};

const initialProjects: Project[] = [
  { id: "1", name: "Plante Moran", segment: "3,600 staff · Firm-wide RM · Workday HCM", owner: "E. Cicero", phase: 5, status: "on-track", progress: 93, startDate: "Jan 15", targetDate: "Apr 20", daysRemaining: 26 },
  { id: "2", name: "Wolf & Company", segment: "700 staff · CCH Axcess · Full firm centralization", owner: "A. Piggott", phase: 4, status: "on-track", progress: 78, startDate: "Feb 1", targetDate: "Apr 5", daysRemaining: 11 },
  { id: "3", name: "Baker Tilly", segment: "6,000 staff · Multi-region · Practice Engine + Workday", owner: "L. Martin", phase: 1, status: "on-track", progress: 18, startDate: "Mar 10", targetDate: "Jul 1", daysRemaining: 97 },
  { id: "4", name: "Bennett Thrasher", segment: "500 staff · Utilization + realization focus", owner: "S. Pickard", phase: 5, status: "on-track", progress: 95, startDate: "Dec 5", targetDate: "Mar 28", daysRemaining: 3 },
  { id: "5", name: "Azets UK", segment: "6,500 staff · Retain → Dayshape · Sage Intacct", owner: "A. Pereira", phase: 3, status: "at-risk", progress: 47, startDate: "Feb 15", targetDate: "May 30", daysRemaining: 66 },
  { id: "6", name: "MHA", segment: "1,400 staff · Firm-wide utilization consistency", owner: "T. Bauer", phase: 0, status: "not-started", progress: 5, startDate: "Mar 22", targetDate: "Jun 15", daysRemaining: 82 },
  { id: "7", name: "Bishop Fleming", segment: "550 staff · Advisory expansion · Practice Engine", owner: "S. Khan", phase: 3, status: "on-track", progress: 55, startDate: "Jan 28", targetDate: "May 10", daysRemaining: 46 },
  { id: "8", name: "Grant Thornton NL", segment: "1,900 staff · AI scheduling · Workday", owner: "M. Rivera", phase: 4, status: "on-track", progress: 78, startDate: "Nov 20", targetDate: "Apr 2", daysRemaining: 8 },
];

type ViewMode = "list" | "kanban";
const statusFilters = ["All", "on-track", "at-risk", "delayed", "not-started"] as const;

function ProjectCardCompact({ project, onClick }: { project: Project; onClick?: () => void }) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-3.5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold truncate">{project.name}</h4>
          <StatusBadge status={project.status} />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground mb-3">
          <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{project.segment}</span>
          <span className="flex items-center gap-1"><User className="h-3 w-3" />{project.owner}</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-1.5" />
        </div>
        <div className="flex items-center justify-between mt-2.5 text-[11px] text-muted-foreground">
          <span>{project.startDate} → {project.targetDate}</span>
          <span className={`font-medium ${project.daysRemaining <= 10 ? "text-destructive" : ""}`}>
            {project.daysRemaining}d left
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function DroppableColumn({ phaseIndex, children }: { phaseIndex: number; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: `phase-${phaseIndex}` });
  return (
    <div ref={setNodeRef} className={`space-y-2.5 min-h-[120px] transition-colors rounded-lg ${isOver ? "bg-primary/5 ring-2 ring-primary/20" : ""}`}>
      {children}
    </div>
  );
}

function DraggableCard({ project, onClick }: { project: Project; onClick?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: project.id });
  const style = transform ? { transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.4 : 1 } : undefined;
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing"
      onClick={(e) => { if (!transform) onClick?.(); }}>
      <ProjectCardCompact project={project} />
    </div>
  );
}

export default function ActiveProjects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filter, setFilter] = useState<string>("All");
  const [view, setView] = useState<ViewMode>("list");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const filtered = filter === "All" ? projects : projects.filter(p => p.status === filter);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const activeProject = projects.find(p => p.id === activeId) ?? null;

  function handleDragStart(event: DragStartEvent) { setActiveId(String(event.active.id)); }
  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const overId = String(over.id);
    const newPhase = overId.startsWith("phase-") ? parseInt(overId.replace("phase-", "")) : null;
    if (newPhase === null || isNaN(newPhase)) return;
    setProjects(prev => prev.map(p => p.id === String(active.id) ? { ...p, phase: newPhase } : p));
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1400px]">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Active Implementations</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track Dayshape firm implementations across the 6-phase delivery framework.
              </p>
            </div>
            <div className="flex items-center bg-muted rounded-lg p-0.5">
              <button onClick={() => setView("list")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                <List className="h-3.5 w-3.5" /> List
              </button>
              <button onClick={() => setView("kanban")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === "kanban" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                <Columns3 className="h-3.5 w-3.5" /> Board
              </button>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {s === "All" ? "All Firms" : s.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>

        {view === "list" ? (
          <div className="space-y-3">
            {filtered.map((project, i) => (
              <motion.div key={project.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedProject(project)}>
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold">{project.name}</h3>
                          <StatusBadge status={project.status} />
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{project.segment}</span>
                          <span className="flex items-center gap-1"><User className="h-3 w-3" />{project.owner}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{project.startDate} → {project.targetDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 shrink-0">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">Phase</p>
                          <PhaseIndicator currentPhase={project.phase} compact />
                          <p className="text-[10px] text-muted-foreground mt-1">{PHASES[project.phase]?.label ?? "Pending"}</p>
                        </div>
                        <div className="w-24">
                          <p className="text-xs text-muted-foreground mb-1">Progress</p>
                          <Progress value={project.progress} className="h-1.5" />
                          <p className="text-[10px] text-muted-foreground mt-1">{project.progress}%</p>
                        </div>
                        <div className="text-center hidden md:block">
                          <p className="text-xs text-muted-foreground mb-1">Days Left</p>
                          <p className={`text-lg font-semibold ${project.daysRemaining <= 10 ? "text-destructive" : ""}`}>
                            {project.daysRemaining}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-4 min-w-max">
                {PHASES.map((phase, phaseIndex) => {
                  const phaseProjects = filtered.filter(p => p.phase === phaseIndex);
                  return (
                    <motion.div key={phase.id} className="w-[280px] shrink-0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: phaseIndex * 0.05 }}>
                      <div className="rounded-xl bg-muted/50 border p-3">
                        <div className="flex items-center justify-between mb-3 px-1">
                          <div className="flex items-center gap-2">
                            <div className={`h-2.5 w-2.5 rounded-full phase-${phase.id}`} />
                            <h3 className="text-xs font-semibold uppercase tracking-wider">{phase.label}</h3>
                          </div>
                          <span className="text-[10px] font-medium text-muted-foreground bg-background rounded-full px-2 py-0.5">
                            {phaseProjects.length}
                          </span>
                        </div>
                        <DroppableColumn phaseIndex={phaseIndex}>
                          {phaseProjects.length > 0 ? (
                            phaseProjects.map((project) => (
                              <DraggableCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
                            ))
                          ) : (
                            <div className="flex items-center justify-center h-[120px] rounded-lg border border-dashed text-xs text-muted-foreground">
                              No firms
                            </div>
                          )}
                        </DroppableColumn>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <DragOverlay>
              {activeProject ? (
                <div className="w-[280px] opacity-90 rotate-2 scale-105">
                  <ProjectCardCompact project={activeProject} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
      <ProjectDetailDialog project={selectedProject} open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)} />
    </DashboardLayout>
  );
}
