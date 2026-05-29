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
    name: "Merchant Discovery Workbook",
    category: "Handoff",
    phase: "handoff",
    downloads: 214,
    rating: 4.9,
    updated: "Mar 18, 2026",
    description: "Captures merchant's payment stack, target rails, geo footprint, surcharging eligibility, BIN coverage, and integration dependencies before Yeeld kicks off.",
    tasks: [
      { label: "Inventory current gateways, processors & orchestration layer", done: false },
      { label: "Document target rails (cards, ACH, wires, FX, alt pay)", done: false },
      { label: "Map states / regions in scope for surcharging", done: false },
      { label: "Capture BIN coverage, AVG ticket & monthly volume", done: false },
      { label: "List integrations (Stripe, Rainforest, Airwallex, OFX, Avalara, Tipalti)", done: false },
      { label: "Confirm PCI scope & tokenization approach", done: false },
      { label: "Identify Finance, Legal, Eng & Product sponsors", done: false },
      { label: "Sign off discovery scope with merchant CFO", done: false },
    ],
  },
  {
    name: "Surcharging Compliance Checklist",
    category: "Build",
    phase: "build",
    downloads: 268,
    rating: 4.9,
    updated: "Mar 22, 2026",
    description: "State-by-state and card-brand surcharging compliance checklist used by Yeeld advisory to certify a program before launch.",
    tasks: [
      { label: "Confirm legality per state (incl. historically restricted states)", done: false },
      { label: "Validate Visa / Mastercard / AmEx / Discover brand rules", done: false },
      { label: "Register surcharge intent with card networks (30-day notice)", done: false },
      { label: "Configure surcharge cap (lesser of merchant cost or brand max)", done: false },
      { label: "Implement payer disclosures at entry, checkout & receipt", done: false },
      { label: "Apply credit-only logic (exclude debit / prepaid)", done: false },
      { label: "Enable BIN refresh & re-validation cadence", done: false },
      { label: "Document audit trail for every surcharge applied", done: false },
    ],
  },
  {
    name: "Payments Implementation Charter",
    category: "Kickoff",
    phase: "kickoff",
    downloads: 124,
    rating: 4.7,
    updated: "Feb 28, 2026",
    description: "Charter defining scope, target rails, KPIs, governance, and escalation paths for a Yeeld-led payments implementation.",
    tasks: [
      { label: "Define business outcomes (recovery $, auth rate, time-to-value)", done: false },
      { label: "Document in-scope merchants, MIDs, rails & geos", done: false },
      { label: "Identify executive sponsor & steering committee", done: false },
      { label: "Outline assumptions, constraints & processor dependencies", done: false },
      { label: "Set budget, resource plan & cutover timeline", done: false },
      { label: "Define risk register & escalation procedure", done: false },
      { label: "Obtain merchant CFO + VP Eng sign-off", done: false },
    ],
  },
  {
    name: "Processor Integration Spec",
    category: "Build",
    phase: "build",
    downloads: 142,
    rating: 4.7,
    updated: "Mar 10, 2026",
    description: "Engineering spec template for Stripe / Rainforest / Airwallex / OFX integrations: auth flows, webhooks, vaulting, retries, and idempotency.",
    tasks: [
      { label: "Document auth + capture + refund flows", done: false },
      { label: "Define webhook handlers & retry / DLQ policy", done: false },
      { label: "Specify token vault & cross-processor portability", done: false },
      { label: "Map error codes & decline reasons → user messaging", done: false },
      { label: "Define idempotency keys & duplicate-charge protection", done: false },
      { label: "Specify reconciliation file ingestion & matching rules", done: false },
      { label: "Document FX handling (Airwallex / OFX)", done: false },
      { label: "Code review with Yeeld payments engineer", done: false },
    ],
  },
  {
    name: "Sales-to-Delivery Handoff Form",
    category: "Handoff",
    phase: "handoff",
    downloads: 232,
    rating: 4.8,
    updated: "Mar 20, 2026",
    description: "Standardized handoff capturing merchant context, signed scope, processor relationships, integration commitments, and key stakeholders.",
    tasks: [
      { label: "Fill in deal summary, ARR / MRR and signed services", done: false },
      { label: "Document merchant goals & success criteria", done: false },
      { label: "List rails, regions, MIDs and currencies in scope", done: false },
      { label: "Capture existing gateway / processor stack", done: false },
      { label: "Note custom commitments & advisory hours", done: false },
      { label: "Identify executive sponsor and project lead", done: false },
      { label: "Attach SOW, MSA, processor agreements", done: false },
      { label: "Schedule internal handoff meeting", done: false },
    ],
  },
  {
    name: "Pre-Launch Review Pack",
    category: "Testing",
    phase: "testing",
    downloads: 138,
    rating: 4.8,
    updated: "Feb 20, 2026",
    description: "Yeeld's pre-launch review covering UAT results, surcharging compliance attestation, security review, and Go/No-Go decision.",
    tasks: [
      { label: "Review end-to-end UAT results across all rails", done: false },
      { label: "Validate surcharge math, caps & disclosures by BIN", done: false },
      { label: "Confirm chargeback, refund & reversal flows", done: false },
      { label: "Sign off compliance attestation (states + brand rules)", done: false },
      { label: "Security review — PCI scope, vault, key rotation", done: false },
      { label: "Confirm rollback plan & cutover communications", done: false },
      { label: "Obtain merchant Legal + CFO sign-off", done: false },
      { label: "Issue Yeeld Go/No-Go decision", done: false },
    ],
  },
  {
    name: "Go-Live Cutover Runbook",
    category: "Go-Live",
    phase: "golive",
    downloads: 156,
    rating: 4.9,
    updated: "Mar 15, 2026",
    description: "Step-by-step runbook for cutting over from legacy gateway to the new Yeeld-supported payment stack with phased rollout.",
    tasks: [
      { label: "Freeze legacy gateway changes & lock config", done: false },
      { label: "Stage processor production keys & vault tokens", done: false },
      { label: "Enable surcharging in waves (region / MID)", done: false },
      { label: "Activate live webhooks & monitoring", done: false },
      { label: "Define rollback triggers and procedure", done: false },
      { label: "Send merchant + payer comms and disclosures", done: false },
      { label: "Run post-cutover smoke tests on auth + refund", done: false },
      { label: "Confirm first 100 live transactions reconcile", done: false },
      { label: "Notify CFO + Steering Committee", done: false },
    ],
  },
  {
    name: "Hypercare & First-Month Recovery Tracker",
    category: "Hypercare",
    phase: "hypercare",
    downloads: 82,
    rating: 4.5,
    updated: "Jan 30, 2026",
    description: "Tracker for the first 30 days post-launch: auth rate, decline reasons, chargeback ratio, surcharge $ recovered, and CSAT.",
    tasks: [
      { label: "Set up live dashboard for auth / decline / chargeback", done: false },
      { label: "Schedule daily standups for first 2 weeks", done: false },
      { label: "Track P1/P2 incidents and SLA resolution", done: false },
      { label: "Run first full month-end settlement recon", done: false },
      { label: "Report surcharge $ recovered vs. baseline", done: false },
      { label: "Tune BIN exceptions & routing rules", done: false },
      { label: "Capture merchant CSAT survey", done: false },
      { label: "Build BAU + advisory transition document", done: false },
      { label: "Hand off to Yeeld ongoing advisory", done: false },
    ],
  },
  {
    name: "Advisory Engagement RACI",
    category: "Kickoff",
    phase: "kickoff",
    downloads: 104,
    rating: 4.4,
    updated: "Feb 14, 2026",
    description: "Responsibility matrix for Yeeld advisory engagements — clarifies who owns design, build, compliance, and ongoing optimization.",
    tasks: [
      { label: "List all advisory & implementation workstreams", done: false },
      { label: "Identify Yeeld + merchant + processor stakeholders", done: false },
      { label: "Assign R/A/C/I per workstream", done: false },
      { label: "Review with executive sponsor", done: false },
      { label: "Review with merchant VP Eng & Controller", done: false },
      { label: "Resolve role conflicts or gaps", done: false },
      { label: "Distribute final matrix", done: false },
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
          <h1 className="text-2xl font-semibold">Templates & Compliance Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Yeeld's standardized payment-implementation templates — discovery, surcharging compliance, processor specs, and go-live runbooks across all 6 phases.
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
