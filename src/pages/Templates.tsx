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
    name: "Braze Discovery Workbook",
    category: "Handoff",
    phase: "handoff",
    downloads: 214,
    rating: 4.9,
    updated: "Mar 18, 2026",
    description: "Captures customer's channel mix, SDK platforms, data source (CDP / warehouse / REST), legacy ESP, and integration dependencies before onboarding kicks off.",
    tasks: [
      { label: "Document channels purchased (Push / Email / SMS / IAM / WhatsApp / Content Cards)", done: false },
      { label: "Inventory SDK platforms (iOS, Android, Web, RN, Flutter)", done: false },
      { label: "Identify primary data source (Segment / mParticle / CDI / REST)", done: false },
      { label: "Document legacy ESP (Iterable / MoEngage / SFMC / Responsys / Airship)", done: false },
      { label: "Capture launch use cases (welcome, abandoned, churn, transactional)", done: false },
      { label: "Confirm Currents / Cloud Data Sharing destination", done: false },
      { label: "Identify executive sponsor + Lifecycle/Data/Eng leads", done: false },
      { label: "Sign off discovery scope with VP Lifecycle / CMO", done: false },
    ],
  },
  {
    name: "SDK Integration Test Plan",
    category: "Testing",
    phase: "testing",
    downloads: 268,
    rating: 4.9,
    updated: "Mar 22, 2026",
    description: "Validates Braze SDK install across iOS, Android, and Web — session, event, identity, and push delivery on real devices.",
    tasks: [
      { label: "Sessions logged in dashboard live feed", done: false },
      { label: "`changeUser` correctly assigns external_id on login", done: false },
      { label: "Custom events fire with expected props", done: false },
      { label: "Purchase events log with currency + value", done: false },
      { label: "Push received on iOS device (foreground + background)", done: false },
      { label: "Push received on Android device (FCM v1)", done: false },
      { label: "IAM displays on target trigger event", done: false },
      { label: "Content Cards render in app", done: false },
    ],
  },
  {
    name: "Braze Project Charter",
    category: "Kickoff",
    phase: "kickoff",
    downloads: 124,
    rating: 4.7,
    updated: "Feb 28, 2026",
    description: "Charter defining scope, channels, use cases, KPIs, governance, and escalation paths for a Braze onboarding.",
    tasks: [
      { label: "Define business outcomes & success KPIs (TTFS, conversion, retention)", done: false },
      { label: "Document in-scope channels and SDKs", done: false },
      { label: "Identify executive sponsor & steering committee", done: false },
      { label: "Outline assumptions, constraints & dependencies", done: false },
      { label: "Set budget, resource plan & launch timeline", done: false },
      { label: "Define risk register & escalation procedure", done: false },
      { label: "Obtain CMO + VP Lifecycle + Eng sign-off", done: false },
    ],
  },
  {
    name: "Email Deliverability Runbook",
    category: "Build",
    phase: "build",
    downloads: 142,
    rating: 4.7,
    updated: "Mar 10, 2026",
    description: "Sending domain authentication (SPF / DKIM / DMARC), dedicated IP warming, and inbox-placement seed testing.",
    tasks: [
      { label: "Choose sending subdomain (e.g. mail.brand.com)", done: false },
      { label: "Publish SPF include for Braze", done: false },
      { label: "Publish DKIM CNAME records", done: false },
      { label: "Publish DMARC `p=quarantine` minimum", done: false },
      { label: "Build IP warming schedule (4–6 weeks)", done: false },
      { label: "Import suppressions from legacy ESP", done: false },
      { label: "Run inbox seed test (Gmail / Yahoo / Outlook)", done: false },
      { label: "Document escalation contacts for postmaster issues", done: false },
    ],
  },
  {
    name: "Sales-to-Delivery Handoff Form",
    category: "Handoff",
    phase: "handoff",
    downloads: 232,
    rating: 4.8,
    updated: "Mar 20, 2026",
    description: "Standardized Braze handoff capturing customer context, signed order form, channels in scope, and key stakeholders.",
    tasks: [
      { label: "Fill in deal summary, ARR and channels purchased", done: false },
      { label: "Document customer goals & success criteria", done: false },
      { label: "List MAU/DAU, regions, regulated industries", done: false },
      { label: "Capture legacy ESP being replaced", done: false },
      { label: "Note custom commitments & professional services hours", done: false },
      { label: "Identify executive sponsor and DM", done: false },
      { label: "Attach order form and MSA", done: false },
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
    description: "Pre-launch readiness pack covering UAT results, deliverability, SDK validation, data ingestion, and sign-offs.",
    tasks: [
      { label: "Confirm UAT scenarios complete with sign-off", done: false },
      { label: "Validate SDK session + events live on prod build", done: false },
      { label: "Confirm data ingestion latency within SLA", done: false },
      { label: "Confirm deliverability seed test passed", done: false },
      { label: "Review open defects (P1/P2) closed or accepted", done: false },
      { label: "Confirm rollback plan and cutover comms", done: false },
      { label: "Obtain CMO + VP Lifecycle sign-off", done: false },
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
    description: "Step-by-step cutover for promoting Braze from staging to production, sending first production campaign, and command-center support.",
    tasks: [
      { label: "Freeze legacy ESP sends and audiences", done: false },
      { label: "Promote production SDK keys to app stores", done: false },
      { label: "Flip data source to production workspace", done: false },
      { label: "Send first production campaign with DM + OE on-call", done: false },
      { label: "Activate Currents / CDS to warehouse", done: false },
      { label: "Open Slack war room + daily exec standups", done: false },
      { label: "Distribute launch comms and training links", done: false },
      { label: "Confirm 24-hour incident triage queue staffed", done: false },
    ],
  },
  {
    name: "Hypercare Exit Report",
    category: "Hypercare",
    phase: "hypercare",
    downloads: 82,
    rating: 4.5,
    updated: "Jan 30, 2026",
    description: "30–60 day post-launch report covering incident metrics, deliverability, conversion lift, CSAT, and BAU transition to CSM/TAM.",
    tasks: [
      { label: "Track P1/P2 incidents and resolution SLAs", done: false },
      { label: "Report deliverability and inbox placement", done: false },
      { label: "Report conversion lift vs. legacy baseline", done: false },
      { label: "Capture customer CSAT survey results", done: false },
      { label: "Document open items and ownership", done: false },
      { label: "Hold internal lessons-learned retro", done: false },
      { label: "Build BAU + CSM/TAM transition doc", done: false },
      { label: "Formally hand off to Customer Success", done: false },
    ],
  },
  {
    name: "Customer Enablement & Training Plan",
    category: "Enablement",
    phase: "golive",
    downloads: 118,
    rating: 4.8,
    updated: "Mar 25, 2026",
    description: "Structured customer enablement and knowledge-transfer plan — platform workshops, Decisioning Studio technical enablement, knowledge checks, and BAU handoff.",
    tasks: [
      { label: "Confirm customer training audience (Lifecycle, Data, Mobile, Creative)", done: false },
      { label: "Schedule Decisioning Studio Technical Enablement workshop", done: false },
      { label: "Deliver Canvas build-along sessions for first 3 journeys", done: false },
      { label: "Run knowledge checks on segmentation, Liquid, and Canvas Flow", done: false },
      { label: "Record enablement videos and upload to customer portal", done: false },
      { label: "Stand up office hours during hypercare", done: false },
      { label: "Create customer self-service readiness checklist", done: false },
      { label: "Sign off enablement completion before CSM transition", done: false },
    ],
  },
  {
    name: "Change Order / Scope Change Template",
    category: "Build",
    phase: "build",
    downloads: 104,
    rating: 4.4,
    updated: "Feb 14, 2026",
    description: "Braze change order template — documents scope deltas vs. signed order form, impact, pricing and sign-off.",
    tasks: [
      { label: "Capture the requested change and rationale", done: false },
      { label: "Map change to original scope", done: false },
      { label: "Estimate effort (hours) and timeline impact", done: false },
      { label: "Confirm pricing with Braze AE & Delivery Lead", done: false },
      { label: "Send change order to customer for signature", done: false },
      { label: "Update project plan and risk register", done: false },
      { label: "Log additional services revenue", done: false },
    ],
  },
];

const categories = ["All", "Handoff", "Kickoff", "Build", "Testing", "Go-Live", "Hypercare", "Enablement"];

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
            Braze Customer Onboarding standard templates — discovery, SDK test plans, deliverability runbooks, cutover runbooks and hypercare reports.
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
