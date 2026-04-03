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

type ModuleId = "rent-collection" | "tenant-screening" | "property-accounting" | "maintenance";

type WorkflowTask = { label: string; done: boolean };
type MigrationItem = { source: string; target: string; records: string; status: "pending" | "in-progress" | "complete" | "failed" };
type ConfigStep = { label: string; description: string; done: boolean };

const modulesMeta: Record<ModuleId, { label: string; icon: React.ElementType; color: string; description: string }> = {
  "rent-collection": { label: "Rent Collection", icon: CreditCard, color: "text-blue-500", description: "Payment processing, ACH transfers, autopay, and late fee automation" },
  "tenant-screening": { label: "Tenant Screening", icon: Users, color: "text-emerald-500", description: "Credit checks, background verification, income validation, and approval workflows" },
  "property-accounting": { label: "Property Accounting", icon: DollarSign, color: "text-violet-500", description: "Revenue tracking, expense management, owner distributions, and financial reporting" },
  maintenance: { label: "Maintenance", icon: Home, color: "text-amber-500", description: "Work order management, vendor coordination, and preventive maintenance scheduling" },
};

const implementationChecklists: Record<ModuleId, WorkflowTask[]> = {
  "rent-collection": [
    { label: "Configure payment gateway (Stripe/ACH)", done: false },
    { label: "Set up property-level bank accounts", done: false },
    { label: "Define rent due dates and grace periods", done: false },
    { label: "Configure late fee rules per lease type", done: false },
    { label: "Set up autopay enrollment workflows", done: false },
    { label: "Enable tenant payment portal", done: false },
    { label: "Configure payment receipt notifications", done: false },
    { label: "Test end-to-end payment flow", done: false },
  ],
  "tenant-screening": [
    { label: "Connect credit bureau APIs (Experian/TransUnion)", done: false },
    { label: "Configure screening criteria thresholds", done: false },
    { label: "Set up background check workflow", done: false },
    { label: "Define income verification rules (3× rent)", done: false },
    { label: "Configure approval/denial notification templates", done: false },
    { label: "Set up co-signer and guarantor flows", done: false },
    { label: "Test screening application pipeline", done: false },
    { label: "Enable applicant self-service portal", done: false },
  ],
  "property-accounting": [
    { label: "Map chart of accounts to RentFlow schema", done: false },
    { label: "Configure owner distribution schedules", done: false },
    { label: "Set up expense categorization rules", done: false },
    { label: "Import historical financial data", done: false },
    { label: "Configure monthly financial statement generation", done: false },
    { label: "Set up 1099 reporting for owners", done: false },
    { label: "Enable bank reconciliation automation", done: false },
    { label: "Test month-end close process", done: false },
  ],
  maintenance: [
    { label: "Configure work order categories and priorities", done: false },
    { label: "Set up vendor directory and assignments", done: false },
    { label: "Define SLA thresholds by priority level", done: false },
    { label: "Configure tenant maintenance request portal", done: false },
    { label: "Set up preventive maintenance schedules", done: false },
    { label: "Enable photo/video attachment for work orders", done: false },
    { label: "Configure vendor invoice approval workflow", done: false },
    { label: "Test work order lifecycle end-to-end", done: false },
    { label: "Set up maintenance cost tracking per unit", done: false },
  ],
};

const migrationData: Record<ModuleId, MigrationItem[]> = {
  "rent-collection": [
    { source: "Legacy PM Software", target: "Lease Records", records: "~2,400 leases", status: "pending" },
    { source: "Bank Statements", target: "Payment History", records: "12 months", status: "pending" },
    { source: "Spreadsheets", target: "Tenant Balances", records: "All units", status: "pending" },
    { source: "Old Payment Portal", target: "Autopay Enrollments", records: "~800 tenants", status: "pending" },
  ],
  "tenant-screening": [
    { source: "Application Files", target: "Screening Templates", records: "~15 templates", status: "pending" },
    { source: "PM Records", target: "Tenant Profiles", records: "~2,400 tenants", status: "pending" },
    { source: "Credit Reports", target: "Historical Screens", records: "6 months", status: "pending" },
    { source: "Approval Records", target: "Decision History", records: "~500 decisions", status: "pending" },
  ],
  "property-accounting": [
    { source: "QuickBooks/Xero", target: "Chart of Accounts", records: "~120 accounts", status: "pending" },
    { source: "Bank Records", target: "Transaction History", records: "12 months", status: "pending" },
    { source: "Owner Statements", target: "Distribution History", records: "All owners", status: "pending" },
    { source: "Expense Records", target: "Vendor Payments", records: "12 months", status: "pending" },
  ],
  maintenance: [
    { source: "Work Order System", target: "Open Work Orders", records: "~85 orders", status: "pending" },
    { source: "Vendor Contacts", target: "Vendor Directory", records: "~40 vendors", status: "pending" },
    { source: "Maintenance Logs", target: "Service History", records: "24 months", status: "pending" },
    { source: "Inspection Reports", target: "Property Conditions", records: "All units", status: "pending" },
  ],
};

const configSteps: Record<ModuleId, ConfigStep[]> = {
  "rent-collection": [
    { label: "Payment Gateway", description: "Connect Stripe or ACH provider and configure merchant accounts per property", done: false },
    { label: "Rent Schedules", description: "Set due dates, grace periods, and pro-ration rules per lease type", done: false },
    { label: "Late Fees", description: "Configure flat or percentage-based late fees with grace period thresholds", done: false },
    { label: "Autopay Rules", description: "Set up recurring payment options and enrollment/cancellation flows", done: false },
    { label: "Notifications", description: "Configure rent due reminders, payment confirmations, and late notices", done: false },
  ],
  "tenant-screening": [
    { label: "Screening Criteria", description: "Define minimum credit score, income ratio, and background check requirements", done: false },
    { label: "Application Flow", description: "Configure multi-step application with document upload and fee collection", done: false },
    { label: "Bureau Connections", description: "Set up API connections to credit bureaus and background check providers", done: false },
    { label: "Approval Workflow", description: "Define approval, conditional approval, and denial criteria and routing", done: false },
    { label: "Adverse Action", description: "Configure compliant adverse action notice templates per jurisdiction", done: false },
  ],
  "property-accounting": [
    { label: "Chart of Accounts", description: "Map property income, expenses, and trust accounts to standard categories", done: false },
    { label: "Owner Distributions", description: "Configure distribution schedules, reserve holdbacks, and payment methods", done: false },
    { label: "Expense Rules", description: "Set up automatic categorization, approval workflows, and budget alerts", done: false },
    { label: "Financial Reports", description: "Configure P&L, balance sheet, and rent roll report templates", done: false },
    { label: "Bank Reconciliation", description: "Connect bank feeds and configure automated reconciliation matching rules", done: false },
  ],
  maintenance: [
    { label: "Work Order Types", description: "Define categories (plumbing, electrical, HVAC, etc.) and priority levels", done: false },
    { label: "Vendor Assignment", description: "Configure automatic vendor routing based on trade, location, and availability", done: false },
    { label: "SLA Thresholds", description: "Set response and resolution time targets by priority (emergency, urgent, routine)", done: false },
    { label: "Tenant Portal", description: "Enable self-service maintenance requests with photo uploads and status tracking", done: false },
    { label: "Preventive Maintenance", description: "Schedule recurring inspections, filter changes, and seasonal maintenance tasks", done: false },
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
  const [activeModule, setActiveModule] = useState<ModuleId>("rent-collection");
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
              Configure, migrate, and validate data for each RentFlow module
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
                    <span>Target in RentFlow</span>
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
