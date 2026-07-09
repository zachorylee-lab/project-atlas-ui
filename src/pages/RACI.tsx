import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertTriangle, Download, RotateCcw, Users, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// ---------- Types ----------
type RACI = "R" | "A" | "C" | "I" | "-";

type Stakeholder = {
  id: string;
  role: string;
  side: "Customer" | "Dayshape";
  seniority: string;
  responsibilities: string;
};

type Workstream = {
  id: string;
  name: string;
  phase: string;
  description: string;
};

// ---------- Data ----------
const STAKEHOLDERS: Stakeholder[] = [
  { id: "exec", role: "Executive Sponsor (COO / Managing Partner)", side: "Customer", seniority: "C-suite / Partner",
    responsibilities: "Owns the business case. Unblocks funding, escalations, and cross-service-line politics. Signs the charter and go/no-go." },
  { id: "hrm", role: "Head of Resource Management", side: "Customer", seniority: "Director",
    responsibilities: "Day-to-day accountable owner for the platform. Approves scheduling policy, utilization targets, and AI Auto-Scheduler tuning." },
  { id: "rm", role: "Resource Managers", side: "Customer", seniority: "Manager",
    responsibilities: "Primary end users. Validate engagement templates, run parallel scheduling, and go through the Technical Enablement cohort." },
  { id: "hris", role: "HRIS Owner (Workday / BambooHR)", side: "Customer", seniority: "Manager",
    responsibilities: "Owns the source-of-truth for people, grades, skills, and cost centers. Provisions integration credentials." },
  { id: "pm", role: "Practice Management Owner (CCH / Practice Engine / NetSuite)", side: "Customer", seniority: "Manager",
    responsibilities: "Owns engagement, WIP, and billing data feeds. Approves engagement-type mapping." },
  { id: "it", role: "IT / InfoSec", side: "Customer", seniority: "Manager / Director",
    responsibilities: "Reviews SSO/SAML, data residency, network egress, and integration security. Owns tenant sign-off." },
  { id: "sic", role: "Dayshape Senior Implementation Consultant", side: "Dayshape", seniority: "Senior IC",
    responsibilities: "End-to-end delivery lead. Runs discovery, configures the firm model, tunes the AI Auto-Scheduler, drives UAT, and owns go-live." },
  { id: "sc", role: "Dayshape Solution Consultant", side: "Dayshape", seniority: "Senior IC",
    responsibilities: "Technical integrations lead. Owns HRIS/practice-management/calendar/finance wiring and data reconciliation." },
  { id: "csm", role: "Dayshape Customer Success Manager", side: "Dayshape", seniority: "Manager",
    responsibilities: "Post-launch relationship owner. Receives stakeholder hierarchy, adoption baseline, and CSAT scorecard at handover." },
];

const WORKSTREAMS: Workstream[] = [
  { id: "handoff", name: "Sales → Delivery Handoff", phase: "Handoff",
    description: "Order-form validation, module list, TTV targets, delivery pod assignment." },
  { id: "charter", name: "Charter & RACI Sign-off", phase: "Kickoff",
    description: "Executive sponsor signs the charter and this RACI. Steering cadence agreed." },
  { id: "discovery", name: "Discovery Workshops", phase: "Kickoff",
    description: "Current-state mapping across service lines, roles, grades, skills, engagement types." },
  { id: "firm", name: "Firm Model Configuration", phase: "Build",
    description: "Hierarchy: offices, service lines, teams, cost centers, skills taxonomy." },
  { id: "integrations", name: "Integrations (HRIS / PM / Calendar / Finance)", phase: "Build",
    description: "Workday, Practice Engine/CCH, Outlook/Google, NetSuite/Sage Intacct wiring + reconciliation." },
  { id: "engagements", name: "Engagement Templates", phase: "Build",
    description: "Per-service-line engagement types ratified by service line leaders." },
  { id: "aitune", name: "AI Auto-Scheduler Tuning", phase: "Build",
    description: "Weightings for utilization, skill match, staff development, geography." },
  { id: "uat", name: "UAT + Parallel Run", phase: "Testing",
    description: "Scenario scripts, weekly parallel vs legacy tool, ≤5% variance target." },
  { id: "training", name: "Technical Enablement & Training", phase: "Testing",
    description: "Decisioning Studio-style RM cohort training + knowledge checks. Partner briefings." },
  { id: "cutover", name: "Go-Live Cutover", phase: "Go-Live",
    description: "Production cutover, runbook, rollback plan, launch war room." },
  { id: "hypercare", name: "Hypercare (30-60 days)", phase: "Hypercare",
    description: "Incident triage, AI acceptance-rate tuning, forecast accuracy stabilization." },
  { id: "csmhandover", name: "CSM Handover", phase: "Hypercare",
    description: "Stakeholder hierarchy, adoption scorecard, feature-request log, exit report." },
  { id: "advocacy", name: "Product Advocacy / Feature Requests", phase: "Hypercare",
    description: "Customer use-cases and enhancement requests routed to Dayshape Product." },
];

// ---------- Default RACI (rows = workstreams, cols = stakeholders) ----------
const DEFAULTS: Record<string, Partial<Record<string, RACI>>> = {
  handoff:      { exec: "I", hrm: "I", rm: "-", hris: "-", pm: "-", it: "-", sic: "A", sc: "C", csm: "I" },
  charter:      { exec: "A", hrm: "R", rm: "I", hris: "I", pm: "I", it: "I", sic: "R", sc: "C", csm: "I" },
  discovery:    { exec: "I", hrm: "A", rm: "C", hris: "C", pm: "C", it: "I", sic: "R", sc: "C", csm: "I" },
  firm:         { exec: "I", hrm: "A", rm: "C", hris: "C", pm: "C", it: "-", sic: "R", sc: "C", csm: "-" },
  integrations: { exec: "I", hrm: "C", rm: "-", hris: "R", pm: "R", it: "C", sic: "C", sc: "A", csm: "-" },
  engagements:  { exec: "-", hrm: "A", rm: "R", hris: "-", pm: "C", it: "-", sic: "R", sc: "C", csm: "-" },
  aitune:       { exec: "I", hrm: "C", rm: "C", hris: "-", pm: "-", it: "-", sic: "A", sc: "C", csm: "-" },
  uat:          { exec: "I", hrm: "A", rm: "R", hris: "C", pm: "C", it: "I", sic: "R", sc: "R", csm: "I" },
  training:     { exec: "I", hrm: "C", rm: "R", hris: "-", pm: "-", it: "-", sic: "A", sc: "C", csm: "C" },
  cutover:      { exec: "A", hrm: "C", rm: "C", hris: "C", pm: "C", it: "C", sic: "R", sc: "R", csm: "I" },
  hypercare:    { exec: "I", hrm: "R", rm: "C", hris: "I", pm: "I", it: "I", sic: "A", sc: "C", csm: "C" },
  csmhandover:  { exec: "I", hrm: "C", rm: "I", hris: "-", pm: "-", it: "-", sic: "R", sc: "C", csm: "A" },
  advocacy:     { exec: "-", hrm: "C", rm: "C", hris: "-", pm: "-", it: "-", sic: "R", sc: "C", csm: "A" },
};

const CYCLE: RACI[] = ["-", "R", "A", "C", "I"];

const CELL_STYLES: Record<RACI, string> = {
  R: "bg-primary/15 text-primary-foreground border-primary/40 [color:hsl(var(--primary))]",
  A: "bg-accent/20 text-accent-foreground border-accent/50 font-bold [color:hsl(var(--accent))]",
  C: "bg-muted text-muted-foreground border-border",
  I: "bg-secondary/60 text-secondary-foreground border-secondary",
  "-": "bg-transparent text-muted-foreground/30 border-transparent",
};

const PHASE_COLORS: Record<string, string> = {
  Handoff: "bg-primary/10 text-primary border-primary/30",
  Kickoff: "bg-accent/15 text-accent border-accent/40",
  Build: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  Testing: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  "Go-Live": "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  Hypercare: "bg-sky-500/10 text-sky-700 border-sky-500/30",
};

export default function RACI() {
  const [matrix, setMatrix] = useState<Record<string, Partial<Record<string, RACI>>>>(DEFAULTS);

  const cycle = (wsId: string, shId: string) => {
    setMatrix((prev) => {
      const current = (prev[wsId]?.[shId] ?? "-") as RACI;
      const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];
      return { ...prev, [wsId]: { ...prev[wsId], [shId]: next } };
    });
  };

  const reset = () => setMatrix(DEFAULTS);

  const exportCSV = () => {
    const header = ["Workstream", "Phase", ...STAKEHOLDERS.map((s) => s.role)];
    const rows = WORKSTREAMS.map((w) => [
      w.name, w.phase, ...STAKEHOLDERS.map((s) => matrix[w.id]?.[s.id] ?? "-"),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dayshape-raci-matrix.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Validation: exactly one A per row
  const violations = useMemo(() => {
    const out: Record<string, "missing-A" | "multiple-A" | null> = {};
    for (const w of WORKSTREAMS) {
      const aCount = STAKEHOLDERS.filter((s) => matrix[w.id]?.[s.id] === "A").length;
      out[w.id] = aCount === 0 ? "missing-A" : aCount > 1 ? "multiple-A" : null;
    }
    return out;
  }, [matrix]);

  const totalViolations = Object.values(violations).filter(Boolean).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">RACI Matrix</h1>
            <p className="text-muted-foreground mt-1 max-w-3xl">
              The single-page answer to "who owns what?" across every workstream of a Dayshape
              implementation. Signed by the executive sponsor at kickoff and handed to the CSM at close.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {totalViolations > 0 && (
              <Badge variant="destructive" className="gap-1.5">
                <AlertTriangle className="h-3 w-3" />
                {totalViolations} row{totalViolations === 1 ? "" : "s"} need attention
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" /> Reset
            </Button>
            <Button size="sm" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Legend */}
        <Card>
          <CardContent className="py-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Legend</span>
            {([
              ["R", "Responsible", "Does the work"],
              ["A", "Accountable", "Owns the outcome — exactly one per row"],
              ["C", "Consulted", "Two-way input before decisions"],
              ["I", "Informed", "One-way updates after decisions"],
            ] as const).map(([k, name, desc]) => (
              <div key={k} className="flex items-center gap-2">
                <span className={cn("h-7 w-7 grid place-items-center rounded border text-xs font-semibold", CELL_STYLES[k as RACI])}>
                  {k}
                </span>
                <div className="leading-tight">
                  <div className="text-xs font-medium">{name}</div>
                  <div className="text-[11px] text-muted-foreground">{desc}</div>
                </div>
              </div>
            ))}
            <div className="text-xs text-muted-foreground ml-auto">Click any cell to cycle R → A → C → I → –</div>
          </CardContent>
        </Card>

        {/* Matrix */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-4 w-4" /> Workstream × Stakeholder responsibility matrix
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-card z-10 min-w-[280px]">Workstream</TableHead>
                  <TableHead className="min-w-[100px]">Phase</TableHead>
                  {STAKEHOLDERS.map((s) => (
                    <TableHead key={s.id} className="text-center min-w-[110px] align-bottom">
                      <div className="flex flex-col items-center gap-1">
                        <span className={cn(
                          "text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded",
                          s.side === "Customer" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                        )}>
                          {s.side}
                        </span>
                        <span className="text-xs font-medium leading-tight text-center max-w-[110px]">
                          {s.role.replace(/\s*\(.*?\)\s*/g, "")}
                        </span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {WORKSTREAMS.map((w, idx) => {
                  const v = violations[w.id];
                  return (
                    <motion.tr
                      key={w.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className={cn("border-b hover:bg-muted/30 transition-colors", v && "bg-destructive/5")}
                    >
                      <TableCell className="sticky left-0 bg-card z-10 align-top">
                        <div className="flex items-start gap-2">
                          {v && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <AlertTriangle className="h-3.5 w-3.5 text-destructive mt-0.5" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  {v === "missing-A" ? "No Accountable assigned" : "More than one Accountable — pick one owner"}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          <div>
                            <div className="text-sm font-medium">{w.name}</div>
                            <div className="text-xs text-muted-foreground max-w-[260px] mt-0.5">{w.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge variant="outline" className={cn("text-[10px]", PHASE_COLORS[w.phase])}>{w.phase}</Badge>
                      </TableCell>
                      {STAKEHOLDERS.map((s) => {
                        const val = (matrix[w.id]?.[s.id] ?? "-") as RACI;
                        return (
                          <TableCell key={s.id} className="text-center p-1.5">
                            <button
                              onClick={() => cycle(w.id, s.id)}
                              className={cn(
                                "h-9 w-9 rounded-md border text-xs font-semibold transition-all hover:scale-110 hover:shadow-sm",
                                CELL_STYLES[val]
                              )}
                              aria-label={`${w.name} — ${s.role}: ${val}`}
                            >
                              {val}
                            </button>
                          </TableCell>
                        );
                      })}
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Stakeholders + Workstreams reference cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Stakeholders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {STAKEHOLDERS.map((s) => (
                <div key={s.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="text-sm font-medium">{s.role}</div>
                    <Badge variant="outline" className={cn(
                      "text-[10px]",
                      s.side === "Customer" ? "" : "bg-primary/10 text-primary border-primary/30"
                    )}>
                      {s.side}
                    </Badge>
                  </div>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">{s.seniority}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.responsibilities}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-4 w-4" /> Workstream responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {WORKSTREAMS.map((w) => (
                <div key={w.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="text-sm font-medium">{w.name}</div>
                    <Badge variant="outline" className={cn("text-[10px]", PHASE_COLORS[w.phase])}>{w.phase}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{w.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
