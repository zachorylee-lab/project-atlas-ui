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
    name: "Firm Discovery Workbook",
    category: "Handoff",
    phase: "handoff",
    downloads: 214,
    rating: 4.9,
    updated: "Mar 18, 2026",
    description: "Captures the firm's service line mix, staff population, HRIS + practice management systems, legacy resourcing tool, and integration dependencies before implementation kicks off.",
    tasks: [
      { label: "Document licensed modules (Core RM / AI Auto-Scheduler / Forecasting / Reporting)", done: false },
      { label: "Inventory service lines (Audit, Tax, Advisory, Consulting) and geographies", done: false },
      { label: "Identify HRIS (Workday / BambooHR / HiBob / SAP SuccessFactors)", done: false },
      { label: "Identify practice management (CCH Axcess / Practice Engine / Thomson Reuters)", done: false },
      { label: "Document legacy resourcing tool (Retain / ProStaff / Deltek / spreadsheets)", done: false },
      { label: "Capture pain points (utilization visibility, forecast, staff burnout)", done: false },
      { label: "Confirm reporting destination (Power BI / Tableau / Snowflake)", done: false },
      { label: "Identify executive sponsor + Resource Management / HR / IT leads", done: false },
      { label: "Sign off discovery scope with COO / Managing Partner", done: false },
    ],
  },
  {
    name: "Integration Test Plan",
    category: "Test & Train",
    phase: "testing",
    downloads: 268,
    rating: 4.9,
    updated: "Mar 22, 2026",
    description: "Validates Dayshape integrations across HRIS, practice management, calendar, and finance — person sync, engagement master, time actuals, and calendar bookings.",
    tasks: [
      { label: "Person + org sync from HRIS reconciles to source", done: false },
      { label: "Joiners/leavers/movers land in Dayshape within SLA", done: false },
      { label: "Engagement master from practice management appears with correct client + partner + budget", done: false },
      { label: "Bookings publish to Outlook / Google calendar", done: false },
      { label: "Time actuals flow back to WIP / finance system", done: false },
      { label: "Absence / non-chargeable time syncs bidirectionally", done: false },
      { label: "SSO login (Okta / Azure AD) works for pilot user cohort", done: false },
      { label: "Data quality dashboard shows < 1% error rate", done: false },
    ],
  },
  {
    name: "Project Charter",
    category: "Discovery & Kickoff",
    phase: "kickoff",
    downloads: 124,
    rating: 4.7,
    updated: "Feb 28, 2026",
    description: "Charter defining scope, service lines, use cases, KPIs, governance, and escalation paths for a Dayshape firm implementation.",
    tasks: [
      { label: "Define business outcomes & success KPIs (TTFS, utilization uplift, forecast accuracy)", done: false },
      { label: "Document in-scope service lines, offices, and user population", done: false },
      { label: "Identify executive sponsor & steering committee", done: false },
      { label: "Outline assumptions, constraints & dependencies", done: false },
      { label: "Set budget, resource plan & launch timeline", done: false },
      { label: "Define risk register & escalation procedure", done: false },
      { label: "Obtain Managing Partner + COO + Head of RM sign-off", done: false },
    ],
  },
  {
    name: "Data Migration Runbook",
    category: "Configure & Integrate",
    phase: "build",
    downloads: 142,
    rating: 4.7,
    updated: "Mar 10, 2026",
    description: "Historical engagement + booking migration from legacy resourcing tools (Retain, ProStaff, Deltek, spreadsheets) into Dayshape with reconciliation.",
    tasks: [
      { label: "Extract legacy engagements, bookings, and time actuals", done: false },
      { label: "Map legacy roles/grades to Dayshape taxonomy", done: false },
      { label: "Map legacy engagement types to Dayshape templates", done: false },
      { label: "Load historical bookings (rolling 12–24 months)", done: false },
      { label: "Reconcile counts vs. legacy source", done: false },
      { label: "Validate open engagement carry-over into busy season", done: false },
      { label: "Sign off migration accuracy with Head of RM", done: false },
      { label: "Retire legacy tool access post-cutover", done: false },
    ],
  },
  {
    name: "Sales-to-Delivery Handoff Form",
    category: "Handoff",
    phase: "handoff",
    downloads: 232,
    rating: 4.8,
    updated: "Mar 20, 2026",
    description: "Standardized Dayshape handoff capturing firm context, signed order form, modules in scope, and key stakeholders.",
    tasks: [
      { label: "Fill in deal summary, ARR, and modules purchased", done: false },
      { label: "Document firm goals & success criteria", done: false },
      { label: "List staff population, offices, service lines, regulatory environment", done: false },
      { label: "Capture legacy resourcing tool being replaced", done: false },
      { label: "Note custom commitments & professional services hours", done: false },
      { label: "Identify executive sponsor and SIC", done: false },
      { label: "Attach order form and MSA", done: false },
      { label: "Schedule internal handoff meeting", done: false },
    ],
  },
  {
    name: "Go/No-Go Decision Pack",
    category: "Test & Train",
    phase: "testing",
    downloads: 138,
    rating: 4.8,
    updated: "Feb 20, 2026",
    description: "Pre-launch readiness pack covering UAT results, parallel-run reconciliation, integration health, training completion, and sign-offs.",
    tasks: [
      { label: "Confirm UAT scenarios complete with sign-off", done: false },
      { label: "Confirm parallel-run reconciliation ≥ 98%", done: false },
      { label: "Confirm HRIS + practice management sync healthy", done: false },
      { label: "Confirm pilot service line adoption ≥ target", done: false },
      { label: "Review open defects (P1/P2) closed or accepted", done: false },
      { label: "Confirm rollback plan and cutover comms", done: false },
      { label: "Obtain COO + Head of RM sign-off", done: false },
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
    description: "Step-by-step cutover for promoting Dayshape from sandbox to production, publishing the first firm-wide schedule, and command-center support.",
    tasks: [
      { label: "Freeze legacy tool booking changes", done: false },
      { label: "Promote production tenant + SSO configuration", done: false },
      { label: "Flip HRIS + practice management sync to production", done: false },
      { label: "Publish first firm-wide schedule with SIC + Solution Consultant on-call", done: false },
      { label: "Activate Power BI / Tableau reporting feeds", done: false },
      { label: "Open Teams war room + daily exec standups", done: false },
      { label: "Distribute launch comms and training links", done: false },
      { label: "Confirm 24-hour incident triage queue staffed", done: false },
    ],
  },
  {
    name: "Adoption Exit Report",
    category: "Adoption & Handover",
    phase: "hypercare",
    downloads: 82,
    rating: 4.5,
    updated: "Jan 30, 2026",
    description: "30–60 day post-launch report covering incident metrics, adoption %, utilization uplift, forecast accuracy, CSAT, and BAU handover to the CSM.",
    tasks: [
      { label: "Track P1/P2 incidents and resolution SLAs", done: false },
      { label: "Report adoption % across Resource Managers and Partners", done: false },
      { label: "Report utilization uplift vs. baseline", done: false },
      { label: "Report AI Auto-Scheduler acceptance rate", done: false },
      { label: "Capture firm CSAT survey results", done: false },
      { label: "Document open items and ownership", done: false },
      { label: "Hold internal lessons-learned retro", done: false },
      { label: "Build BAU + CSM handover doc", done: false },
      { label: "Formally hand over to Customer Success", done: false },
    ],
  },
  {
    name: "Customer Enablement & Training Plan",
    category: "Enablement",
    phase: "golive",
    downloads: 118,
    rating: 4.8,
    updated: "Mar 25, 2026",
    description: "Structured enablement plan — Resource Manager workshops, Partner briefings, AI Auto-Scheduler technical enablement, knowledge checks, and BAU handover.",
    tasks: [
      { label: "Confirm training audiences (Resource Managers, Partners, Staff, Admin)", done: false },
      { label: "Schedule AI Auto-Scheduler Technical Enablement workshop", done: false },
      { label: "Deliver build-along sessions for the first 3 scheduling scenarios", done: false },
      { label: "Run knowledge checks on booking rules, forecasting, and dashboards", done: false },
      { label: "Record enablement videos and upload to firm LMS", done: false },
      { label: "Stand up office hours during hypercare", done: false },
      { label: "Create firm self-service readiness checklist", done: false },
      { label: "Sign off enablement completion before CSM handover", done: false },
    ],
  },
  {
    name: "Change Order / Scope Change Template",
    category: "Configure & Integrate",
    phase: "build",
    downloads: 104,
    rating: 4.4,
    updated: "Feb 14, 2026",
    description: "Dayshape change order template — documents scope deltas vs. signed order form, effort, pricing, and sign-off.",
    tasks: [
      { label: "Capture the requested change and rationale", done: false },
      { label: "Map change to original scope", done: false },
      { label: "Estimate effort (hours) and timeline impact", done: false },
      { label: "Confirm pricing with Dayshape AE & Delivery Lead", done: false },
      { label: "Send change order to firm for signature", done: false },
      { label: "Update project plan and risk register", done: false },
      { label: "Log additional services revenue", done: false },
    ],
  },
];

const categories = ["All", "Handoff", "Discovery & Kickoff", "Configure & Integrate", "Test & Train", "Go-Live", "Adoption & Handover", "Enablement"];

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
            Dayshape Professional Services Onboarding standard templates — discovery, integration test plans, migration runbooks, cutover runbooks, and adoption reports.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
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
                <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setSelectedTemplate(template)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="rounded-lg bg-primary/10 p-2">
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
                <div className="rounded-lg bg-primary/10 p-2">
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
                    <label key={idx} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${checked ? "opacity-60" : ""}`}>
                      <Checkbox checked={checked} onCheckedChange={() => toggleTask(selectedTemplate, idx)} />
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
