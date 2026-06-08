import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { FileText, Download, Clock, Star, CheckCircle2, ListChecks } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

type Task = { label: string; done: boolean };
type Template = {
  name: string;
  category: string;
  phase: string;
  downloads: number;
  rating: number;
  updated: string;
  description: string;
  tasks: Task[];
};

const templates: Template[] = [
  {
    name: "HCM Discovery Workbook",
    category: "Handoff",
    phase: "handoff",
    downloads: 214,
    rating: 4.9,
    updated: "Mar 18, 2026",
    description: "Captures client's org structure, FEINs, pay groups, modules in scope, carrier list, and integration dependencies before Sage kicks off.",
    tasks: [
      { label: "Document org structure, locations & legal entities", done: false },
      { label: "Inventory pay groups, pay frequency & FEINs", done: false },
      { label: "List benefits carriers and 401(k) provider", done: false },
      { label: "Capture deduction & earning codes from legacy system", done: false },
      { label: "Document existing HCM (ADP / UKG / Paycom / Workday)", done: false },
      { label: "Confirm GL chart of accounts & mapping approach", done: false },
      { label: "Identify executive sponsor and module SMEs", done: false },
      { label: "Sign off discovery scope with CHRO / CFO", done: false },
    ],
  },
  {
    name: "Parallel Payroll Checklist",
    category: "Testing",
    phase: "testing",
    downloads: 268,
    rating: 4.9,
    updated: "Mar 22, 2026",
    description: "Sage HCM parallel payroll procedure used to reconcile gross-to-net against the legacy system before go-live.",
    tasks: [
      { label: "Load identical employee master & YTD balances", done: false },
      { label: "Run payroll cycle in both Sage HCM and legacy", done: false },
      { label: "Reconcile gross wages by EE", done: false },
      { label: "Reconcile pre-tax / post-tax deductions", done: false },
      { label: "Reconcile employer-side taxes (FICA, FUTA, SUTA)", done: false },
      { label: "Reconcile net pay variance (<$0.01 per EE target)", done: false },
      { label: "Document and resolve all variances", done: false },
      { label: "Obtain client Payroll Director sign-off", done: false },
    ],
  },
  {
    name: "Sage HCM Project Charter",
    category: "Kickoff",
    phase: "kickoff",
    downloads: 124,
    rating: 4.7,
    updated: "Feb 28, 2026",
    description: "Charter defining scope, modules, KPIs, governance, and escalation paths for a Sage HCM implementation.",
    tasks: [
      { label: "Define business outcomes & success criteria", done: false },
      { label: "Document in-scope modules (HR/Payroll/Benefits/Talent/Time)", done: false },
      { label: "Identify executive sponsor & steering committee", done: false },
      { label: "Outline assumptions, constraints & dependencies", done: false },
      { label: "Set budget, resource plan & cutover timeline", done: false },
      { label: "Define risk register & escalation procedure", done: false },
      { label: "Obtain client CHRO + CFO + IT sign-off", done: false },
    ],
  },
  {
    name: "EDI 834 Carrier Integration Spec",
    category: "Build",
    phase: "build",
    downloads: 142,
    rating: 4.7,
    updated: "Mar 10, 2026",
    description: "Template for configuring and testing 834 benefit enrollment files with health, dental, vision, FSA/HSA carriers.",
    tasks: [
      { label: "Confirm carrier list and EDI contacts", done: false },
      { label: "Document plan codes, tiers, and effective dates", done: false },
      { label: "Map Sage HCM benefit plans → carrier plan IDs", done: false },
      { label: "Define file frequency (full vs. change-only)", done: false },
      { label: "Validate test file with each carrier", done: false },
      { label: "Reconcile membership counts post-load", done: false },
      { label: "Sign off with client Benefits Manager", done: false },
      { label: "Schedule production cutover with carrier", done: false },
    ],
  },
  {
    name: "Sales-to-Delivery Handoff Form",
    category: "Handoff",
    phase: "handoff",
    downloads: 232,
    rating: 4.8,
    updated: "Mar 20, 2026",
    description: "Standardized Sage handoff capturing client context, signed SOW, module scope, and key stakeholders.",
    tasks: [
      { label: "Fill in deal summary, ARR and signed modules", done: false },
      { label: "Document client goals & success criteria", done: false },
      { label: "List EE count, FEINs, pay groups, states", done: false },
      { label: "Capture existing HCM / payroll system", done: false },
      { label: "Note custom commitments & professional services hours", done: false },
      { label: "Identify executive sponsor and PM", done: false },
      { label: "Attach SOW and MSA", done: false },
      { label: "Schedule internal handoff meeting", done: false },
    ],
  },
  {
    name: "Go/No-Go Decision Pack",
    category: "Testing",
    phase: "testing",
    downloads: 138,
    rating: 4.8,
    updated: "Feb 20, 2026",
    description: "Pre-launch readiness pack covering UAT results, parallel payroll reconciliation, integrations, and sign-offs.",
    tasks: [
      { label: "Confirm UAT scenarios complete with sign-off", done: false },
      { label: "Validate parallel payroll variance within tolerance", done: false },
      { label: "Confirm EDI 834 carrier files validated in production", done: false },
      { label: "Confirm GL export reconciles to penny", done: false },
      { label: "Review open defects (P1/P2) closed or accepted", done: false },
      { label: "Confirm rollback plan and cutover comms", done: false },
      { label: "Obtain CHRO + CFO sign-off", done: false },
      { label: "Issue Go/No-Go decision", done: false },
    ],
  },
  {
    name: "Go-Live Cutover Runbook",
    category: "Go-Live",
    phase: "golive",
    downloads: 156,
    rating: 4.9,
    updated: "Mar 15, 2026",
    description: "Step-by-step cutover runbook for promoting Sage HCM from sandbox to production with command-center support.",
    tasks: [
      { label: "Freeze legacy HCM and lock data sources", done: false },
      { label: "Load final master data & YTD balances", done: false },
      { label: "Promote configuration from sandbox to production", done: false },
      { label: "Run first live payroll with Sage on standby", done: false },
      { label: "Activate carrier files, GL exports, SSO", done: false },
      { label: "Open command center + daily exec standups", done: false },
      { label: "Distribute ESS launch comms and manager training links", done: false },
      { label: "Confirm first 24-hour incident triage queue staffed", done: false },
    ],
  },
  {
    name: "Hypercare Exit Report",
    category: "Hypercare",
    phase: "hypercare",
    downloads: 82,
    rating: 4.5,
    updated: "Jan 30, 2026",
    description: "30–60 day post-launch report covering incident metrics, CSAT, open items, and BAU transition to Customer Success.",
    tasks: [
      { label: "Track P1/P2 incidents and resolution SLAs", done: false },
      { label: "Confirm successful first month-end / quarter-end", done: false },
      { label: "Confirm successful first tax filing cycle", done: false },
      { label: "Capture client CSAT survey results", done: false },
      { label: "Document open items and ownership", done: false },
      { label: "Hold internal lessons-learned retro", done: false },
      { label: "Build BAU + Customer Success transition doc", done: false },
      { label: "Formally hand off to Customer Success", done: false },
    ],
  },
  {
    name: "Change Order / Scope Change Template",
    category: "Build",
    phase: "build",
    downloads: 104,
    rating: 4.4,
    updated: "Feb 14, 2026",
    description: "Sage HCM change order template — documents scope deltas vs. signed SOW, impact, pricing and sign-off.",
    tasks: [
      { label: "Capture the requested change and rationale", done: false },
      { label: "Map change to original SOW scope", done: false },
      { label: "Estimate effort (hours) and timeline impact", done: false },
      { label: "Confirm pricing with Sage AE & PS Director", done: false },
      { label: "Send change order to client for signature", done: false },
      { label: "Update project plan and risk register", done: false },
      { label: "Log additional services revenue", done: false },
    ],
  },
];

const categories = ["All", "Handoff", "Kickoff", "Build", "Testing", "Go-Live", "Hypercare"];

export default function Templates() {
  const [filter, setFilter] = useState("All");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [taskStates, setTaskStates] = useState<Record<string, boolean[]>>({});
  const filtered = filter === "All" ? templates : templates.filter(t => t.category === filter);

  function getTaskStates(template: Template): boolean[] {
    return taskStates[template.name] ?? template.tasks.map(t => t.done);
  }

  function toggleTask(template: Template, taskIndex: number) {
    const current = getTaskStates(template);
    const updated = [...current];
    updated[taskIndex] = !updated[taskIndex];
    setTaskStates(prev => ({ ...prev, [template.name]: updated }));
  }

  function completedCount(template: Template): number {
    return getTaskStates(template).filter(Boolean).length;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold">Templates & SOW Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sage HCM Professional Services standard templates — discovery, parallel payroll, integration specs, cutover runbooks and hypercare reports.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((template, i) => {
            const done = completedCount(template);
            const total = template.tasks.length;
            return (
              <motion.div key={template.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="rounded-lg bg-primary/8 p-2">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="secondary" className={`phase-badge phase-${template.phase} text-[10px]`}>
                        {template.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm font-semibold mt-3">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1"><Download className="h-3 w-3" />{template.downloads}</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3" />{template.rating}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{template.updated}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <ListChecks className="h-3 w-3" />
                      <span>{done}/{total} tasks</span>
                      {done === total && total > 0 && (
                        <CheckCircle2 className="h-3 w-3 text-success ml-auto" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
        {selectedTemplate && (
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="rounded-lg bg-primary/8 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-base">{selectedTemplate.name}</DialogTitle>
                  <Badge variant="secondary" className={`phase-badge phase-${selectedTemplate.phase} text-[10px] mt-1`}>
                    {selectedTemplate.category}
                  </Badge>
                </div>
              </div>
            </DialogHeader>

            <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Download className="h-3 w-3" />{selectedTemplate.downloads} downloads</span>
              <span className="flex items-center gap-1"><Star className="h-3 w-3" />{selectedTemplate.rating} rating</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Updated {selectedTemplate.updated}</span>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-primary" />
                  Tasks
                </h3>
                <span className="text-xs text-muted-foreground">
                  {completedCount(selectedTemplate)}/{selectedTemplate.tasks.length} complete
                </span>
              </div>

              <div className="h-1.5 w-full bg-muted rounded-full mb-4 overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount(selectedTemplate) / selectedTemplate.tasks.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="space-y-1">
                {selectedTemplate.tasks.map((task, idx) => {
                  const checked = getTaskStates(selectedTemplate)[idx];
                  return (
                    <label
                      key={idx}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                        checked ? "opacity-60" : ""
                      }`}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleTask(selectedTemplate, idx)}
                      />
                      <span className={`text-sm ${checked ? "line-through text-muted-foreground" : ""}`}>
                        {task.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </DashboardLayout>
  );
}
