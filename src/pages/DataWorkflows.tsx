import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users, DollarSign, Heart, Award, Clock,
  CheckCircle2, Database,
  Upload, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

type ModuleId = "hr" | "payroll" | "benefits" | "talent" | "time";

type WorkflowTask = { label: string; done: boolean };
type MigrationItem = { source: string; target: string; records: string; status: "pending" | "in-progress" | "complete" | "failed" };
type ConfigStep = { label: string; description: string; done: boolean };

const modulesMeta: Record<ModuleId, { label: string; icon: React.ElementType; color: string; description: string }> = {
  hr: { label: "HR Core", icon: Users, color: "text-blue-500", description: "Org structure, positions, workflows, employee self-service" },
  payroll: { label: "Payroll", icon: DollarSign, color: "text-amber-500", description: "Pay groups, earnings & deductions, taxes, GL mapping" },
  benefits: { label: "Benefits", icon: Heart, color: "text-rose-500", description: "Plans, rates, eligibility, life events, OE & EDI 834 carriers" },
  talent: { label: "Talent", icon: Award, color: "text-violet-500", description: "Performance, comp planning, succession, learning" },
  time: { label: "Time & Attendance", icon: Clock, color: "text-emerald-500", description: "Schedules, pay rules, accruals, time clocks, shift differentials" },
};

const implementationChecklists: Record<ModuleId, WorkflowTask[]> = {
  hr: [
    { label: "Configure org structure, locations & legal entities", done: false },
    { label: "Build job catalog and position management", done: false },
    { label: "Configure new-hire, transfer, termination workflows", done: false },
    { label: "Enable employee self-service (ESS)", done: false },
    { label: "Configure manager self-service (MSS) approvals", done: false },
    { label: "Set up document storage (I-9, W-4, custom)", done: false },
    { label: "Configure role-based permissions and security", done: false },
    { label: "End-to-end UAT for hire-to-retire flow", done: false },
  ],
  payroll: [
    { label: "Configure pay groups, pay frequencies and FEINs", done: false },
    { label: "Build earnings, deductions and tax codes", done: false },
    { label: "Configure direct deposit and pay card", done: false },
    { label: "Map GL accounts (department, cost center)", done: false },
    { label: "Configure garnishments and child support", done: false },
    { label: "Validate state tax registrations and SUTA rates", done: false },
    { label: "Run two to three parallel payrolls vs. legacy", done: false },
    { label: "Reconcile gross-to-net to the penny", done: false },
  ],
  benefits: [
    { label: "Build benefit plans (medical, dental, vision, FSA/HSA)", done: false },
    { label: "Configure rates, tiers and effective dates", done: false },
    { label: "Define eligibility rules and waiting periods", done: false },
    { label: "Build life-event qualifying changes workflow", done: false },
    { label: "Design Open Enrollment experience", done: false },
    { label: "Build EDI 834 files for each carrier", done: false },
    { label: "Test 834 with each carrier (member count recon)", done: false },
    { label: "Validate payroll deductions against benefit elections", done: false },
  ],
  talent: [
    { label: "Configure performance review templates and cycle", done: false },
    { label: "Build goal cascade and OKR templates", done: false },
    { label: "Configure compensation planning and merit cycle", done: false },
    { label: "Build succession planning org chart", done: false },
    { label: "Configure learning courses and assignments", done: false },
    { label: "Enable career profiles and internal mobility", done: false },
    { label: "Train HRBPs on talent workflows", done: false },
    { label: "UAT end-to-end performance cycle", done: false },
  ],
  time: [
    { label: "Configure pay rules, overtime and shift differentials", done: false },
    { label: "Build schedule templates and rotations", done: false },
    { label: "Configure accruals (PTO, sick, FMLA)", done: false },
    { label: "Connect time clocks / mobile punch", done: false },
    { label: "Configure approval workflows for time edits", done: false },
    { label: "Map time codes to payroll earnings", done: false },
    { label: "Run T&A parallel for two pay cycles", done: false },
    { label: "Validate accrual balances at cutover", done: false },
  ],
};

const migrationData: Record<ModuleId, MigrationItem[]> = {
  hr: [
    { source: "Legacy HRIS", target: "Employee Master", records: "~1,800 EEs", status: "pending" },
    { source: "Legacy HRIS", target: "Org / Position Data", records: "~240 positions", status: "pending" },
    { source: "Document Vault", target: "I-9 / W-4 Documents", records: "~3,600 docs", status: "pending" },
    { source: "HRIS", target: "History (5 yrs)", records: "Compensation + Job", status: "pending" },
  ],
  payroll: [
    { source: "Legacy Payroll", target: "YTD Balances", records: "Current calendar year", status: "pending" },
    { source: "Legacy Payroll", target: "Deduction Master", records: "Per EE", status: "pending" },
    { source: "Legacy Payroll", target: "Direct Deposit", records: "~1,800 EEs", status: "pending" },
    { source: "Legacy Payroll", target: "Garnishments", records: "~45 active", status: "pending" },
  ],
  benefits: [
    { source: "Legacy Benefits", target: "Current Enrollments", records: "Per EE / plan", status: "pending" },
    { source: "Carrier Files", target: "Beneficiaries / Dependents", records: "~2,400 records", status: "pending" },
    { source: "FSA / HSA Vendor", target: "YTD Contributions", records: "Current year", status: "pending" },
    { source: "401(k) Recordkeeper", target: "Deferral Elections", records: "~1,200 active", status: "pending" },
  ],
  talent: [
    { source: "Legacy Performance Tool", target: "Active Review Cycle", records: "In-flight", status: "pending" },
    { source: "Comp Tool", target: "Historical Comp Decisions", records: "Prior 2 cycles", status: "pending" },
    { source: "LMS", target: "Course Catalog & Completions", records: "~420 courses", status: "pending" },
    { source: "Excel", target: "Succession Plans", records: "~90 critical roles", status: "pending" },
  ],
  time: [
    { source: "Legacy T&A (Kronos/UKG)", target: "Open Time Cards", records: "Current pay period", status: "pending" },
    { source: "Legacy T&A", target: "Accrual Balances", records: "Per EE", status: "pending" },
    { source: "Schedule System", target: "Schedules", records: "~6 weeks forward", status: "pending" },
    { source: "Pay Rules Doc", target: "Pay Rules Library", records: "~30 rules", status: "pending" },
  ],
};

const configSteps: Record<ModuleId, ConfigStep[]> = {
  hr: [
    { label: "Org & Position", description: "Define legal entities, locations, departments, jobs, positions", done: false },
    { label: "Workflows", description: "Configure hire, transfer, termination, and change workflows", done: false },
    { label: "Self-Service", description: "Enable ESS / MSS with branded launch page", done: false },
    { label: "Document Management", description: "Configure I-9, W-4, and custom doc storage", done: false },
    { label: "Security", description: "Build role-based access and field-level permissions", done: false },
  ],
  payroll: [
    { label: "Pay Groups & Calendar", description: "Define pay groups, frequencies, periods, off-cycle rules", done: false },
    { label: "Earnings & Deductions", description: "Configure all earning, deduction, and tax codes", done: false },
    { label: "Tax Setup", description: "Validate FEINs, SUTA rates, state/local tax registrations", done: false },
    { label: "GL Mapping", description: "Map payroll postings to client's chart of accounts", done: false },
    { label: "Direct Deposit", description: "Configure DD splits, pre-notes, pay card option", done: false },
  ],
  benefits: [
    { label: "Plan Setup", description: "Build medical, dental, vision, FSA/HSA, life plans", done: false },
    { label: "Rates & Tiers", description: "Load EE / EE+spouse / EE+child / family rates", done: false },
    { label: "Eligibility Rules", description: "Define waiting periods and class-based eligibility", done: false },
    { label: "Open Enrollment", description: "Build OE wizard and decision support", done: false },
    { label: "EDI 834 Carriers", description: "Build carrier files and complete carrier testing", done: false },
  ],
  talent: [
    { label: "Performance", description: "Configure review template, calibration, cycle dates", done: false },
    { label: "Compensation", description: "Build merit matrix, budget loading, manager workspace", done: false },
    { label: "Succession", description: "Configure 9-box and successor pools for critical roles", done: false },
    { label: "Learning", description: "Set up course catalog, assignments, compliance tracking", done: false },
    { label: "Career Mobility", description: "Enable career profile and internal job posting", done: false },
  ],
  time: [
    { label: "Pay Rules", description: "Configure OT, double-time, shift differentials, blended rates", done: false },
    { label: "Schedules", description: "Build schedule templates and union rotation patterns", done: false },
    { label: "Accruals", description: "Configure PTO, sick, bereavement, FMLA accrual rules", done: false },
    { label: "Time Clocks", description: "Connect physical clocks and mobile punch with geofence", done: false },
    { label: "Approvals", description: "Configure manager approval workflows for time and exceptions", done: false },
  ],
};


const statusStyles: Record<string, { label: string; classes: string }> = {
  pending: { label: "Pending", classes: "bg-muted text-muted-foreground" },
  "in-progress": { label: "In Progress", classes: "bg-primary/10 text-primary" },
  complete: { label: "Complete", classes: "bg-emerald-500/10 text-emerald-600" },
  failed: { label: "Failed", classes: "bg-destructive/10 text-destructive" },
};

const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

export default function DataWorkflows() {
  const [activeModule, setActiveModule] = useState<ModuleId>("hr");

  const [checklistStates, setChecklistStates] = useState<Record<string, boolean[]>>({});
  const [migrationStates, setMigrationStates] = useState<Record<string, MigrationItem[]>>({});
  const [configStates, setConfigStates] = useState<Record<string, boolean[]>>({});

  const checklist = implementationChecklists[activeModule];
  const checklistChecked = checklistStates[activeModule] ?? checklist.map(t => t.done);
  const checklistDone = checklistChecked.filter(Boolean).length;

  const migrations = migrationStates[activeModule] ?? migrationData[activeModule];

  const config = configSteps[activeModule];
  const configChecked = configStates[activeModule] ?? config.map(s => s.done);
  const configDone = configChecked.filter(Boolean).length;

  const overallTasks = checklist.length + migrations.length + config.length;
  const overallDone = checklistDone + migrations.filter(m => m.status === "complete").length + configDone;
  const overallProgress = overallTasks > 0 ? Math.round((overallDone / overallTasks) * 100) : 0;

  function toggleChecklist(idx: number) {
    const updated = [...checklistChecked];
    updated[idx] = !updated[idx];
    setChecklistStates(prev => ({ ...prev, [activeModule]: updated }));
  }

  function cycleMigrationStatus(idx: number) {
    const order: MigrationItem["status"][] = ["pending", "in-progress", "complete", "failed"];
    const updated = [...migrations];
    const currentIdx = order.indexOf(updated[idx].status);
    updated[idx] = { ...updated[idx], status: order[(currentIdx + 1) % order.length] };
    setMigrationStates(prev => ({ ...prev, [activeModule]: updated }));
  }

  function toggleConfig(idx: number) {
    const updated = [...configChecked];
    updated[idx] = !updated[idx];
    setConfigStates(prev => ({ ...prev, [activeModule]: updated }));
  }

  const ModuleIcon = modulesMeta[activeModule].icon;

  return (
    <DashboardLayout>
      <motion.div {...fadeUp}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sage HCM Modules</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Configure, migrate and validate each module of the Sage HCM suite
            </p>
          </div>
          <Badge variant="outline" className="text-xs gap-1.5 px-3 py-1.5">
            <Database className="h-3 w-3" /> {overallDone}/{overallTasks} Complete
          </Badge>
        </div>
      </motion.div>

      <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {(Object.keys(modulesMeta) as ModuleId[]).map((id) => {
            const meta = modulesMeta[id];
            const Icon = meta.icon;
            const isActive = activeModule === id;
            return (
              <button
                key={id}
                onClick={() => setActiveModule(id)}
                className={cn(
                  "rounded-xl border p-4 text-left transition-all hover:shadow-md",
                  isActive
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/30"
                )}
              >
                <Icon className={cn("h-5 w-5 mb-2", meta.color)} />
                <p className="text-sm font-semibold">{meta.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{meta.description}</p>
              </button>
            );
          })}
        </div>
      </motion.div>

      <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
        <Card className="mb-6">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3 mb-3">
              <ModuleIcon className={cn("h-5 w-5", modulesMeta[activeModule].color)} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{modulesMeta[activeModule].label} Module Progress</h3>
                  <span className="text-sm font-semibold">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2 mt-2" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center rounded-lg bg-muted/50 p-3">
                <p className="text-[11px] text-muted-foreground">Checklist</p>
                <p className="text-lg font-semibold">{checklistDone}/{checklist.length}</p>
              </div>
              <div className="text-center rounded-lg bg-muted/50 p-3">
                <p className="text-[11px] text-muted-foreground">Migrations</p>
                <p className="text-lg font-semibold">{migrations.filter(m => m.status === "complete").length}/{migrations.length}</p>
              </div>
              <div className="text-center rounded-lg bg-muted/50 p-3">
                <p className="text-[11px] text-muted-foreground">Configuration</p>
                <p className="text-lg font-semibold">{configDone}/{config.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="checklist" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="checklist" className="gap-1.5 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" /> Implementation Checklist
          </TabsTrigger>
          <TabsTrigger value="migration" className="gap-1.5 text-xs">
            <Upload className="h-3.5 w-3.5" /> Data Migration
          </TabsTrigger>
          <TabsTrigger value="config" className="gap-1.5 text-xs">
            <Settings className="h-3.5 w-3.5" /> Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checklist">
          <motion.div {...fadeUp}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{modulesMeta[activeModule].label} Implementation Tasks</CardTitle>
                  {checklistDone === checklist.length && checklist.length > 0 && (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> All Complete
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-1.5 w-full bg-muted rounded-full mb-4 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${checklist.length ? (checklistDone / checklist.length) * 100 : 0}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="space-y-0.5">
                  {checklist.map((task, idx) => {
                    const checked = checklistChecked[idx];
                    return (
                      <label
                        key={idx}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                          checked && "opacity-60"
                        )}
                      >
                        <Checkbox checked={checked} onCheckedChange={() => toggleChecklist(idx)} />
                        <span className={cn("text-sm", checked && "line-through text-muted-foreground")}>{task.label}</span>
                      </label>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="migration">
          <motion.div {...fadeUp}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{modulesMeta[activeModule].label} Data Migration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 text-[11px] font-medium text-muted-foreground bg-muted/50 px-4 py-2.5">
                    <span>Source System</span>
                    <span>Target in Sage HCM</span>
                    <span className="text-center">Records</span>
                    <span className="text-center">Status</span>
                  </div>
                  <div className="divide-y">
                    {migrations.map((m, idx) => {
                      const status = statusStyles[m.status];
                      return (
                        <div key={idx} className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 items-center px-4 py-3 text-sm">
                          <span>{m.source}</span>
                          <span className="font-medium">{m.target}</span>
                          <span className="text-xs text-muted-foreground text-center">{m.records}</span>
                          <button
                            onClick={() => cycleMigrationStatus(idx)}
                            className={cn("text-[10px] px-2 py-1 rounded-full font-medium transition-colors", status.classes)}
                          >
                            {status.label}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="config">
          <motion.div {...fadeUp}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{modulesMeta[activeModule].label} Configuration Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {config.map((step, idx) => {
                    const checked = configChecked[idx];
                    return (
                      <label
                        key={idx}
                        className={cn(
                          "flex items-start gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                          checked && "opacity-60"
                        )}
                      >
                        <Checkbox checked={checked} onCheckedChange={() => toggleConfig(idx)} className="mt-0.5" />
                        <div>
                          <p className={cn("text-sm font-medium", checked && "line-through text-muted-foreground")}>{step.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
