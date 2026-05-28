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
    name: "CFO Kickoff Deck",
    category: "Kickoff",
    phase: "kickoff",
    downloads: 168,
    rating: 4.9,
    updated: "Mar 12, 2026",
    description: "Executive kickoff template for the CFO and Controller. Covers entity scope, close-cycle targets, AI automation roadmap, and go-live timeline.",
    tasks: [
      { label: "Customize with customer logo & branding", done: false },
      { label: "Confirm entity list and consolidation scope", done: false },
      { label: "Introduce Sage delivery team and roles", done: false },
      { label: "Walk through 6-phase implementation timeline", done: false },
      { label: "Align on success metrics (days-to-close, automation %)", done: false },
      { label: "Review change management & training plan", done: false },
      { label: "Confirm steering committee cadence", done: false },
      { label: "Send to CFO 24h before kickoff", done: false },
    ],
  },
  {
    name: "Implementation Charter",
    category: "Kickoff",
    phase: "kickoff",
    downloads: 124,
    rating: 4.7,
    updated: "Feb 28, 2026",
    description: "Formal charter defining scope, entities, modules, success criteria, governance, and escalation paths for the Sage Intacct deployment.",
    tasks: [
      { label: "Define implementation objectives & business outcomes", done: false },
      { label: "Document in-scope entities, modules & integrations", done: false },
      { label: "Identify executive sponsor and steering committee", done: false },
      { label: "Outline assumptions, constraints & dependencies", done: false },
      { label: "Set budget, resource plan & timeline", done: false },
      { label: "Define risk register & escalation procedures", done: false },
      { label: "Obtain CFO sign-off", done: false },
    ],
  },
  {
    name: "Discovery & Requirements Workbook",
    category: "Handoff",
    phase: "handoff",
    downloads: 214,
    rating: 4.9,
    updated: "Mar 18, 2026",
    description: "Comprehensive discovery workbook capturing chart of accounts, dimensions, entities, sub-ledgers, approval workflows, and reporting requirements.",
    tasks: [
      { label: "Document legal entity structure & ownership", done: false },
      { label: "Capture current chart of accounts and dimensions", done: false },
      { label: "Map AP, AR, Cash & GL workflows", done: false },
      { label: "List required integrations (Salesforce, ADP, Bill.com, banks)", done: false },
      { label: "Define approval matrices and segregation of duties", done: false },
      { label: "Catalog management & statutory reporting needs", done: false },
      { label: "Document compliance requirements (SOX, GAAP, IFRS)", done: false },
      { label: "Review with customer Controller & IT", done: false },
      { label: "Sign off discovery scope", done: false },
    ],
  },
  {
    name: "Trial Balance & Master Data Migration Checklist",
    category: "Build",
    phase: "build",
    downloads: 96,
    rating: 4.6,
    updated: "Mar 5, 2026",
    description: "Step-by-step checklist for migrating opening trial balances, vendors, customers, items, and open AP/AR transactions into Sage Intacct.",
    tasks: [
      { label: "Inventory source ERP / accounting systems", done: false },
      { label: "Map source COA to Sage Intacct COA & dimensions", done: false },
      { label: "Cleanse vendor & customer master data", done: false },
      { label: "Build CSV templates for opening balances", done: false },
      { label: "Run trial migration to sandbox", done: false },
      { label: "Reconcile balances to source trial balance", done: false },
      { label: "Document rollback procedure", done: false },
      { label: "Schedule production cutover window", done: false },
      { label: "Execute final migration", done: false },
      { label: "Controller sign-off on data integrity", done: false },
    ],
  },
  {
    name: "Record-to-Report UAT Plan",
    category: "Testing",
    phase: "testing",
    downloads: 138,
    rating: 4.8,
    updated: "Feb 20, 2026",
    description: "User acceptance testing plan covering AP, AR, GL, multi-entity consolidations, intercompany eliminations, and financial reporting.",
    tasks: [
      { label: "Define R2R test scenarios across modules", done: false },
      { label: "Stage sandbox with representative data", done: false },
      { label: "Assign testers across finance functions", done: false },
      { label: "Execute AP invoice-to-pay test cases", done: false },
      { label: "Execute AR order-to-cash test cases", done: false },
      { label: "Run multi-entity close & elimination cycle", done: false },
      { label: "Validate financial statements & dashboards", done: false },
      { label: "Log defects and retest", done: false },
      { label: "Obtain UAT sign-off from Controller", done: false },
    ],
  },
  {
    name: "Go-Live Cutover Runbook",
    category: "Go-Live",
    phase: "golive",
    downloads: 156,
    rating: 4.9,
    updated: "Mar 15, 2026",
    description: "Detailed cutover runbook covering opening balance load, integration activation, SSO enablement, user comms, and rollback triggers.",
    tasks: [
      { label: "Freeze legacy system & lock prior-period postings", done: false },
      { label: "Load final opening trial balances", done: false },
      { label: "Activate AP, AR & bank feed integrations", done: false },
      { label: "Enable SSO & user access by role", done: false },
      { label: "Define rollback triggers and procedure", done: false },
      { label: "Send go-live comms to finance and approvers", done: false },
      { label: "Run post-cutover smoke tests", done: false },
      { label: "Confirm first journal & invoice posted", done: false },
      { label: "Notify CFO of successful go-live", done: false },
    ],
  },
  {
    name: "Hypercare & First-Close Tracker",
    category: "Hypercare",
    phase: "hypercare",
    downloads: 82,
    rating: 4.5,
    updated: "Jan 30, 2026",
    description: "Tracker for the first full month-end close: monitors close-cycle days, exception volume, AI automation rate, and CSAT during hypercare.",
    tasks: [
      { label: "Set up close-cycle monitoring dashboard", done: false },
      { label: "Schedule daily standups for first 2 weeks", done: false },
      { label: "Track P1/P2 incidents and resolution SLA", done: false },
      { label: "Run first full month-end close with customer", done: false },
      { label: "Measure days-to-close vs. baseline", done: false },
      { label: "Tune AI anomaly thresholds and approvals", done: false },
      { label: "Capture customer CSAT survey", done: false },
      { label: "Build BAU transition document", done: false },
      { label: "Hand off to Customer Success", done: false },
    ],
  },
  {
    name: "Sales-to-Services Handoff Form",
    category: "Handoff",
    phase: "handoff",
    downloads: 232,
    rating: 4.8,
    updated: "Mar 20, 2026",
    description: "Standardized form to capture deal context, entity count, modules sold, integrations promised, and key stakeholders during the sales-to-services handoff.",
    tasks: [
      { label: "Fill in deal summary, ARR, and signed modules", done: false },
      { label: "Document customer goals and success criteria", done: false },
      { label: "List entities, locations, and currencies in scope", done: false },
      { label: "Capture current ERP / accounting stack", done: false },
      { label: "Note integrations and any custom commitments", done: false },
      { label: "Identify executive sponsor and project lead", done: false },
      { label: "Attach sales artifacts & order form", done: false },
      { label: "Schedule internal handoff meeting", done: false },
    ],
  },
  {
    name: "RACI Matrix Template",
    category: "Kickoff",
    phase: "kickoff",
    downloads: 104,
    rating: 4.4,
    updated: "Feb 14, 2026",
    description: "Responsibility assignment matrix clarifying Responsible, Accountable, Consulted, and Informed roles across every Sage Intacct implementation activity.",
    tasks: [
      { label: "List all implementation activities & deliverables", done: false },
      { label: "Identify Sage and customer stakeholders", done: false },
      { label: "Assign R/A/C/I per activity", done: false },
      { label: "Review with executive sponsor", done: false },
      { label: "Review with customer Controller", done: false },
      { label: "Resolve any role conflicts or gaps", done: false },
      { label: "Distribute final matrix to all parties", done: false },
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
          <h1 className="text-2xl font-semibold">Templates Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Standardized Sage Intacct implementation templates across all 6 phases. Click any template to view its task checklist.
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
