import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard, Home, Users, DollarSign,
  CheckCircle2, Clock, AlertTriangle, Database,
  Upload, Settings, ChevronRight, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

type ModuleId = "financial-close" | "multi-entity" | "ap-automation" | "ai-insights";

type WorkflowTask = { label: string; done: boolean };
type MigrationItem = { source: string; target: string; records: string; status: "pending" | "in-progress" | "complete" | "failed" };
type ConfigStep = { label: string; description: string; done: boolean };

const modulesMeta: Record<ModuleId, { label: string; icon: React.ElementType; color: string; description: string }> = {
  "financial-close": { label: "Financial Close", icon: CheckCircle2, color: "text-blue-500", description: "Close checklist, journal entries, reconciliations, and consolidated reporting" },
  "multi-entity": { label: "Multi-Entity Accounting", icon: Home, color: "text-emerald-500", description: "Inter-entity transactions, consolidations, eliminations, and multi-currency" },
  "ap-automation": { label: "AP Automation", icon: CreditCard, color: "text-violet-500", description: "Invoice capture, approval workflows, payment runs, and vendor management" },
  "ai-insights": { label: "AI Insights & Reporting", icon: DollarSign, color: "text-amber-500", description: "Anomaly detection, AI-powered dashboards, and CFO/Board reporting" },
};

const implementationChecklists: Record<ModuleId, WorkflowTask[]> = {
  "financial-close": [
    { label: "Configure close checklist and task owners", done: false },
    { label: "Define journal entry approval thresholds", done: false },
    { label: "Set up bank reconciliation match rules", done: false },
    { label: "Configure recurring & allocation journals", done: false },
    { label: "Enable period lock & soft/hard close controls", done: false },
    { label: "Build financial statement templates (P&L, BS, CF)", done: false },
    { label: "Configure variance & flux analysis reports", done: false },
    { label: "Run end-to-end month-end close in sandbox", done: false },
  ],
  "multi-entity": [
    { label: "Define legal entity hierarchy & ownership", done: false },
    { label: "Configure inter-entity transaction rules", done: false },
    { label: "Set up multi-currency & FX revaluation", done: false },
    { label: "Build consolidation & elimination rules", done: false },
    { label: "Configure minority interest & equity pickup", done: false },
    { label: "Set up reporting books (GAAP, IFRS, Tax)", done: false },
    { label: "Test full consolidation cycle", done: false },
    { label: "Enable entity-level security & access", done: false },
  ],
  "ap-automation": [
    { label: "Connect Bill.com / Sage AP Automation", done: false },
    { label: "Configure OCR & invoice capture rules", done: false },
    { label: "Build approval matrix by amount & dimension", done: false },
    { label: "Set up 3-way match (PO, receipt, invoice)", done: false },
    { label: "Configure payment runs (ACH, check, vCard)", done: false },
    { label: "Set up 1099 tracking and vendor compliance", done: false },
    { label: "Test end-to-end invoice-to-pay flow", done: false },
    { label: "Enable vendor self-service portal", done: false },
  ],
  "ai-insights": [
    { label: "Enable Intelligent GL anomaly detection", done: false },
    { label: "Tune anomaly thresholds per account category", done: false },
    { label: "Configure AI-assisted bank reconciliation", done: false },
    { label: "Build CFO dashboard with key KPIs", done: false },
    { label: "Build Board reporting pack template", done: false },
    { label: "Configure scheduled report distribution", done: false },
    { label: "Set up budget vs. actual variance alerts", done: false },
    { label: "Train finance team on Insight Console", done: false },
  ],
};

const migrationData: Record<ModuleId, MigrationItem[]> = {
  "financial-close": [
    { source: "Legacy ERP", target: "Chart of Accounts", records: "~450 accounts", status: "pending" },
    { source: "Excel Templates", target: "Close Checklist Tasks", records: "~120 tasks", status: "pending" },
    { source: "Bank Statements", target: "Reconciliation History", records: "12 months", status: "pending" },
    { source: "Legacy GL", target: "Opening Trial Balances", records: "All entities", status: "pending" },
  ],
  "multi-entity": [
    { source: "Legacy Consolidation Tool", target: "Entity Hierarchy", records: "38 entities", status: "pending" },
    { source: "FX System", target: "Historical FX Rates", records: "24 months", status: "pending" },
    { source: "Excel Eliminations", target: "Elimination Rules", records: "~85 rules", status: "pending" },
    { source: "Legacy GL", target: "Inter-Entity Balances", records: "All open items", status: "pending" },
  ],
  "ap-automation": [
    { source: "Legacy AP System", target: "Vendor Master", records: "~1,800 vendors", status: "pending" },
    { source: "Approval Matrix", target: "AP Workflow Rules", records: "~45 rules", status: "pending" },
    { source: "Open AP Aging", target: "Outstanding Bills", records: "~620 invoices", status: "pending" },
    { source: "1099 Records", target: "Vendor Tax Profiles", records: "Prior 2 years", status: "pending" },
  ],
  "ai-insights": [
    { source: "Legacy BI", target: "Report Templates", records: "~60 reports", status: "pending" },
    { source: "Budget Files", target: "Annual Budget", records: "All entities", status: "pending" },
    { source: "Excel KPIs", target: "Dashboard Definitions", records: "~25 KPIs", status: "pending" },
    { source: "Historical GL", target: "AI Training Data", records: "36 months", status: "pending" },
  ],
};

const configSteps: Record<ModuleId, ConfigStep[]> = {
  "financial-close": [
    { label: "Close Calendar", description: "Define close days, owners, dependencies, and reminder schedule", done: false },
    { label: "Journal Workflows", description: "Configure JE templates, approval thresholds, and recurring entries", done: false },
    { label: "Reconciliations", description: "Set up bank, GL, and inter-entity reconciliation rules with auto-match", done: false },
    { label: "Period Controls", description: "Configure soft/hard close, period locks, and reopen permissions", done: false },
    { label: "Financial Reports", description: "Build P&L, balance sheet, cash flow, and variance report templates", done: false },
  ],
  "multi-entity": [
    { label: "Entity Structure", description: "Model legal entities, ownership %, and reporting hierarchy", done: false },
    { label: "Inter-Entity Rules", description: "Configure due-to/due-from accounts and automated postings", done: false },
    { label: "Multi-Currency", description: "Set base, transaction, and reporting currencies; configure FX feeds", done: false },
    { label: "Consolidation Rules", description: "Define eliminations, minority interest, and translation methods", done: false },
    { label: "Reporting Books", description: "Configure GAAP, IFRS, Tax, and Management reporting books", done: false },
  ],
  "ap-automation": [
    { label: "Invoice Capture", description: "Configure OCR, email-in addresses, and vendor invoice templates", done: false },
    { label: "Approval Matrix", description: "Define approvers by amount, department, entity, and project", done: false },
    { label: "3-Way Match", description: "Enable PO, receipt, and invoice matching with tolerance rules", done: false },
    { label: "Payment Runs", description: "Configure ACH, check, and virtual card payment methods and schedules", done: false },
    { label: "Vendor Compliance", description: "Set up W-9 collection, 1099 tracking, and OFAC screening", done: false },
  ],
  "ai-insights": [
    { label: "Anomaly Detection", description: "Enable AI scoring on GL postings and tune thresholds per account", done: false },
    { label: "KPI Library", description: "Define days-to-close, automation rate, DSO, DPO, and cash KPIs", done: false },
    { label: "CFO Dashboard", description: "Build CFO and Controller dashboards with drill-down to transactions", done: false },
    { label: "Board Pack", description: "Configure quarterly Board report template and distribution list", done: false },
    { label: "Alerts & Workflows", description: "Set up exception alerts, variance triggers, and approval reminders", done: false },
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
  const [activeModule, setActiveModule] = useState<ModuleId>("financial-close");

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
            <h1 className="text-2xl font-bold tracking-tight">Data Workflows</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Configure, migrate, and validate data for each Sage Intacct module

            </p>
          </div>
          <Badge variant="outline" className="text-xs gap-1.5 px-3 py-1.5">
            <Database className="h-3 w-3" /> {overallDone}/{overallTasks} Complete
          </Badge>
        </div>
      </motion.div>

      <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
        <div className="grid grid-cols-4 gap-3 mb-6">
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
                  <div className="grid grid-cols-[1fr_auto_1fr_auto_auto] gap-0 text-[11px] font-medium text-muted-foreground bg-muted/50 px-4 py-2.5">
                    <span>Source System</span>
                    <span />
                    <span>Target in Sage Intacct</span>

                    <span className="text-center">Records</span>
                    <span className="text-center">Status</span>
                  </div>
                  <Separator />
                  {migrations.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-[1fr_auto_1fr_auto_auto] gap-0 items-center px-4 py-3 border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Database className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{item.source}</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground mx-3" />
                      <span className="text-sm font-medium">{item.target}</span>
                      <span className="text-xs text-muted-foreground text-center min-w-[80px]">{item.records}</span>
                      <button
                        onClick={() => cycleMigrationStatus(idx)}
                        className="min-w-[90px] flex justify-center"
                      >
                        <Badge className={cn("text-[10px] cursor-pointer transition-colors", statusStyles[item.status].classes)}>
                          {statusStyles[item.status].label}
                        </Badge>
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-3">Click a status badge to cycle through: Pending → In Progress → Complete → Failed</p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="config">
          <motion.div {...fadeUp}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{modulesMeta[activeModule].label} Configuration Steps</CardTitle>
                  {configDone === config.length && config.length > 0 && (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Fully Configured
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-1.5 w-full bg-muted rounded-full mb-4 overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${config.length ? (configDone / config.length) * 100 : 0}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="space-y-2">
                  {config.map((step, idx) => {
                    const checked = configChecked[idx];
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "flex items-start gap-3 px-4 py-3 rounded-lg border transition-all cursor-pointer hover:bg-muted/30",
                          checked ? "border-emerald-500/30 bg-emerald-500/5 opacity-75" : "border-border"
                        )}
                        onClick={() => toggleConfig(idx)}
                      >
                        <Checkbox checked={checked} onCheckedChange={() => toggleConfig(idx)} className="mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={cn("text-sm font-medium", checked && "line-through text-muted-foreground")}>
                              {step.label}
                            </span>
                            <Badge variant="outline" className="text-[9px] px-1.5">Step {idx + 1}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground mt-0.5" />
                      </div>
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
