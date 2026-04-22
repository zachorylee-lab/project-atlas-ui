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
    name: "Brand Kickoff Deck",
    category: "Kickoff",
    phase: "kickoff",
    downloads: 142,
    rating: 4.8,
    updated: "Mar 12, 2026",
    description: "Presentation template for the first brand stakeholder meeting. Covers launch markets, catalog scope, returns policy, and timeline.",
    tasks: [
      { label: "Customize with brand colors and logo", done: false },
      { label: "Fill in target markets and currency list", done: false },
      { label: "Add team member bios and roles", done: false },
      { label: "Define launch timeline milestones", done: false },
      { label: "List success criteria (intl. AOV, return rate, duties accuracy)", done: false },
      { label: "Prepare Q&A talking points on cross-border tax & duties", done: false },
      { label: "Review with internal stakeholders", done: false },
      { label: "Send to brand 24h before kickoff", done: false },
    ],
  },
  {
    name: "Onboarding Charter Template",
    category: "Kickoff",
    phase: "kickoff",
    downloads: 98,
    rating: 4.6,
    updated: "Feb 28, 2026",
    description: "Formal onboarding charter defining objectives, market scope, integration architecture, compliance posture, and escalation paths.",
    tasks: [
      { label: "Define onboarding objectives and goals", done: false },
      { label: "Document launch markets and SKU scope", done: false },
      { label: "Identify key brand stakeholders", done: false },
      { label: "Outline integration architecture (storefront, ERP, 3PL)", done: false },
      { label: "Set budget and resource allocation", done: false },
      { label: "Define escalation procedures", done: false },
      { label: "Get executive sponsor sign-off", done: false },
    ],
  },
  {
    name: "Catalog & Compliance Data Requirements",
    category: "Handoff",
    phase: "handoff",
    downloads: 187,
    rating: 4.9,
    updated: "Mar 18, 2026",
    description: "Comprehensive data requirements document capturing SKU details, HS codes, country of origin, restricted markets, and GPSR responsible person.",
    tasks: [
      { label: "Gather full SKU catalog with attributes and images", done: false },
      { label: "Capture HS codes and country of origin per SKU", done: false },
      { label: "Document restricted SKUs and prohibited markets", done: false },
      { label: "Define GPSR responsible person for EU sales", done: false },
      { label: "List CE / RoHS / FDA documentation as applicable", done: false },
      { label: "Confirm IOSS / VAT registration status per market", done: false },
      { label: "Review with brand legal & tax", done: false },
      { label: "Get data ingestion approval", done: false },
      { label: "Create environment setup checklist", done: false },
    ],
  },
  {
    name: "Catalog Migration Checklist",
    category: "Build",
    phase: "build",
    downloads: 76,
    rating: 4.5,
    updated: "Mar 5, 2026",
    description: "Step-by-step checklist for migrating product catalog, inventory, customers, and order history from legacy ecommerce platforms.",
    tasks: [
      { label: "Inventory source storefront platform & ERP", done: false },
      { label: "Define data mapping rules (products, variants, inventory)", done: false },
      { label: "Build extraction scripts for legacy platform", done: false },
      { label: "Create data validation rules for prices & stock", done: false },
      { label: "Run trial migration on staging", done: false },
      { label: "Document rollback procedure", done: false },
      { label: "Schedule production cutover window", done: false },
      { label: "Execute final migration", done: false },
      { label: "Run post-migration reconciliation", done: false },
      { label: "Sign off on data integrity", done: false },
    ],
  },
  {
    name: "Cross-Border Checkout UAT Plan",
    category: "Testing",
    phase: "testing",
    downloads: 112,
    rating: 4.7,
    updated: "Feb 20, 2026",
    description: "User acceptance testing plan for international checkout, duties & taxes calculation, currency conversion, and payment methods per market.",
    tasks: [
      { label: "Define test scenarios per launch market", done: false },
      { label: "Set up staging with full catalog and inventory", done: false },
      { label: "Assign testers across regions (US, EU, UK, AU)", done: false },
      { label: "Prepare test cards & local payment methods", done: false },
      { label: "Execute checkout test cases per market", done: false },
      { label: "Validate duties, taxes, and FX at checkout", done: false },
      { label: "Log and triage discrepancies", done: false },
      { label: "Retest resolved issues", done: false },
      { label: "Get UAT sign-off from brand", done: false },
    ],
  },
  {
    name: "Returns Portal Configuration Guide",
    category: "Build",
    phase: "build",
    downloads: 134,
    rating: 4.8,
    updated: "Mar 14, 2026",
    description: "Configuration guide for the branded returns portal: exchange-first flows, store credit incentives, return reasons, and policy windows per market.",
    tasks: [
      { label: "Configure return reason taxonomy", done: false },
      { label: "Set return window per market (US, EU, UK)", done: false },
      { label: "Enable exchange-first flow with bonus credit", done: false },
      { label: "Configure store credit incentive (e.g. +10%)", done: false },
      { label: "Wire up label generation with regional carriers", done: false },
      { label: "Set restocking and inspection rules", done: false },
      { label: "Test refund-to-original-payment flow", done: false },
      { label: "QA branded returns portal UX", done: false },
    ],
  },
  {
    name: "Launch Runbook",
    category: "Go-Live",
    phase: "golive",
    downloads: 134,
    rating: 4.9,
    updated: "Mar 15, 2026",
    description: "Detailed runbook for launch day including checkout activation, market enablement sequence, monitoring checkpoints, and rollback triggers.",
    tasks: [
      { label: "Finalize market activation sequence", done: false },
      { label: "Set up checkout & duties monitoring dashboards", done: false },
      { label: "Define rollback triggers and procedure", done: false },
      { label: "Prepare customer comms (launch email, banners)", done: false },
      { label: "Brief on-call support team", done: false },
      { label: "Execute pre-launch smoke tests on real cards", done: false },
      { label: "Activate live checkout and returns portal", done: false },
      { label: "Run post-launch verification per market", done: false },
      { label: "Send launch confirmation to brand", done: false },
    ],
  },
  {
    name: "Post-Launch Hypercare Tracker",
    category: "Hypercare",
    phase: "hypercare",
    downloads: 63,
    rating: 4.4,
    updated: "Jan 30, 2026",
    description: "Post-launch tracker for monitoring conversion, returns rate, duties accuracy, support tickets, and transition to steady-state operations.",
    tasks: [
      { label: "Set up checkout success rate monitoring", done: false },
      { label: "Define SLA thresholds for failures", done: false },
      { label: "Schedule daily check-ins for week 1", done: false },
      { label: "Monitor returns portal adoption metrics", done: false },
      { label: "Track and resolve P1/P2 issues", done: false },
      { label: "Conduct mid-hypercare review with brand", done: false },
      { label: "Gather merchant satisfaction feedback", done: false },
      { label: "Create BAU transition plan", done: false },
      { label: "Hand off to CSM team", done: false },
    ],
  },
  {
    name: "Sales Handoff Form",
    category: "Handoff",
    phase: "handoff",
    downloads: 201,
    rating: 4.8,
    updated: "Mar 20, 2026",
    description: "Standardized form for capturing deal context, GMV, target markets, current platform stack, and key contacts during sales-to-onboarding handoff.",
    tasks: [
      { label: "Fill in deal summary and contract terms", done: false },
      { label: "Document brand expectations and goals", done: false },
      { label: "List key contacts and roles at brand", done: false },
      { label: "Capture current ecommerce platform & ERP details", done: false },
      { label: "Note any special compliance or tax requirements", done: false },
      { label: "Attach relevant sales artifacts", done: false },
      { label: "Schedule handoff meeting with onboarding pod", done: false },
    ],
  },
  {
    name: "RACI Matrix Template",
    category: "Kickoff",
    phase: "kickoff",
    downloads: 89,
    rating: 4.3,
    updated: "Feb 14, 2026",
    description: "Responsibility assignment matrix to clarify who is Responsible, Accountable, Consulted, and Informed for every onboarding activity.",
    tasks: [
      { label: "List all onboarding activities and deliverables", done: false },
      { label: "Identify all stakeholders", done: false },
      { label: "Assign R/A/C/I for each activity", done: false },
      { label: "Review with onboarding sponsor", done: false },
      { label: "Review with brand team", done: false },
      { label: "Resolve any conflicts or gaps", done: false },
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
            Standardized templates across all onboarding phases. Click any template to view tasks.
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
