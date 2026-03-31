import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp, Calendar, Users, DollarSign,
  CheckCircle2, Clock, AlertTriangle, Database,
  Upload, Settings, ChevronRight, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

type ModuleId = "forecasting" | "scheduling" | "hr" | "payroll";

type WorkflowTask = { label: string; done: boolean };
type MigrationItem = { source: string; target: string; records: string; status: "pending" | "in-progress" | "complete" | "failed" };
type ConfigStep = { label: string; description: string; done: boolean };

const modulesMeta: Record<ModuleId, { label: string; icon: React.ElementType; color: string; description: string }> = {
  forecasting: { label: "Forecasting", icon: TrendingUp, color: "text-blue-500", description: "Demand planning, labour optimisation, and real-time insights" },
  scheduling: { label: "Scheduling", icon: Calendar, color: "text-emerald-500", description: "Auto-scheduling, time & attendance, and compliance" },
  hr: { label: "HR", icon: Users, color: "text-violet-500", description: "Onboarding, absence management, and documentation" },
  payroll: { label: "Payroll", icon: DollarSign, color: "text-amber-500", description: "Auto-calculations, error reduction, and audit-ready payroll" },
};

const implementationChecklists: Record<ModuleId, WorkflowTask[]> = {
  forecasting: [
    { label: "Collect historical demand data (12+ months)", done: false },
    { label: "Define demand drivers (covers, footfall, orders)", done: false },
    { label: "Configure location-level demand models", done: false },
    { label: "Set forecasting granularity (half-hourly/hourly)", done: false },
    { label: "Map staffing ratios to demand levels", done: false },
    { label: "Validate forecast accuracy against actuals", done: false },
    { label: "Enable real-time demand adjustments", done: false },
    { label: "Train managers on forecast dashboard", done: false },
  ],
  scheduling: [
    { label: "Define shift templates and patterns", done: false },
    { label: "Configure role types and skill requirements", done: false },
    { label: "Set up time & attendance rules", done: false },
    { label: "Import existing employee availability", done: false },
    { label: "Configure auto-scheduling parameters", done: false },
    { label: "Set compliance rules (max hours, breaks, etc.)", done: false },
    { label: "Test shift swap and open shift workflows", done: false },
    { label: "Enable manager schedule publishing", done: false },
    { label: "Configure clock-in/out integrations", done: false },
  ],
  hr: [
    { label: "Map employee data fields to Sona schema", done: false },
    { label: "Configure onboarding checklists per role", done: false },
    { label: "Set up right-to-work verification workflow", done: false },
    { label: "Import existing employee records", done: false },
    { label: "Configure absence types and policies", done: false },
    { label: "Set up document storage and templates", done: false },
    { label: "Enable training assignment workflows", done: false },
    { label: "Test certification tracking and expiry alerts", done: false },
  ],
  payroll: [
    { label: "Map pay rules to Sona payroll engine", done: false },
    { label: "Configure overtime thresholds per location", done: false },
    { label: "Set up holiday pay and premium rates", done: false },
    { label: "Define payroll approval workflow", done: false },
    { label: "Configure exception flagging rules", done: false },
    { label: "Test payroll run with sample data", done: false },
    { label: "Set up export format for payroll provider", done: false },
    { label: "Validate calculations against parallel run", done: false },
    { label: "Enable audit trail and reporting", done: false },
  ],
};

const migrationData: Record<ModuleId, MigrationItem[]> = {
  forecasting: [
    { source: "POS / EPOS System", target: "Demand History", records: "52 weeks", status: "pending" },
    { source: "Reservation System", target: "Booking Forecast", records: "12 months", status: "pending" },
    { source: "Foot Traffic Sensors", target: "Footfall Data", records: "6 months", status: "pending" },
    { source: "Labour Budget Sheets", target: "Staffing Ratios", records: "All locations", status: "pending" },
  ],
  scheduling: [
    { source: "Legacy Rota System", target: "Shift Templates", records: "~120 templates", status: "pending" },
    { source: "HR System", target: "Employee Availability", records: "~2,400 employees", status: "pending" },
    { source: "Timeclock System", target: "Attendance Records", records: "6 months", status: "pending" },
    { source: "Compliance Documents", target: "Working Time Rules", records: "Per region", status: "pending" },
  ],
  hr: [
    { source: "HRIS / Spreadsheets", target: "Employee Profiles", records: "~2,400 records", status: "pending" },
    { source: "Document Store", target: "Right-to-Work Docs", records: "~2,400 documents", status: "pending" },
    { source: "Training Platform", target: "Certifications", records: "~1,800 certs", status: "pending" },
    { source: "Leave System", target: "Absence History", records: "12 months", status: "pending" },
  ],
  payroll: [
    { source: "Payroll Provider", target: "Pay Rules", records: "~35 rules", status: "pending" },
    { source: "HR System", target: "Employee Pay Rates", records: "~2,400 rates", status: "pending" },
    { source: "Finance", target: "Cost Centres", records: "All locations", status: "pending" },
    { source: "Payroll Reports", target: "Historical Payroll", records: "3 months", status: "pending" },
  ],
};

const configSteps: Record<ModuleId, ConfigStep[]> = {
  forecasting: [
    { label: "Demand Drivers", description: "Select primary demand metric (covers, orders, footfall) per location type", done: false },
    { label: "Forecast Horizon", description: "Set how far ahead the system generates forecasts (1-4 weeks)", done: false },
    { label: "Granularity", description: "Choose half-hourly or hourly demand buckets", done: false },
    { label: "Event Detection", description: "Enable automatic demand spike detection from historical patterns", done: false },
    { label: "Labour Optimisation", description: "Define staffing ratio rules per demand level and role", done: false },
  ],
  scheduling: [
    { label: "Shift Patterns", description: "Define standard shifts (open, mid, close) and break rules", done: false },
    { label: "Role Configuration", description: "Set up roles, skills, and minimum coverage per time block", done: false },
    { label: "Auto-Schedule Rules", description: "Configure fairness, cost, and preference weighting", done: false },
    { label: "Compliance Engine", description: "Set working time directive rules, max hours, and rest periods", done: false },
    { label: "Notifications", description: "Configure shift assignment, swap request, and reminder alerts", done: false },
  ],
  hr: [
    { label: "Onboarding Flows", description: "Build role-specific onboarding checklists with document requirements", done: false },
    { label: "Right-to-Work", description: "Configure verification workflow and document expiry alerts", done: false },
    { label: "Absence Policies", description: "Set up absence types, accrual rules, and approval chains", done: false },
    { label: "Training Matrix", description: "Define required certifications per role and auto-assign on hire", done: false },
    { label: "Document Templates", description: "Upload contract templates and configure e-signature flow", done: false },
  ],
  payroll: [
    { label: "Pay Rules Engine", description: "Map base rates, overtime, night premiums, and holiday pay rules", done: false },
    { label: "Exception Handling", description: "Configure auto-flagging for missed clock-outs, overtime, and shift swaps", done: false },
    { label: "Approval Workflow", description: "Set up manager review → finance approval → export pipeline", done: false },
    { label: "Export Format", description: "Configure CSV/API export format matching your payroll provider", done: false },
    { label: "Audit & Reporting", description: "Enable audit trail, variance reports, and cost-per-location dashboards", done: false },
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
  const [activeModule, setActiveModule] = useState<ModuleId>("forecasting");
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
              Configure, migrate, and validate data for each Sona module
            </p>
          </div>
          <Badge variant="outline" className="text-xs gap-1.5 px-3 py-1.5">
            <Database className="h-3 w-3" /> {overallDone}/{overallTasks} Complete
          </Badge>
        </div>
      </motion.div>

      {/* Module selector */}
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

      {/* Module progress overview */}
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

      {/* Three workflow sections */}
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

        {/* Checklist Tab */}
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

        {/* Migration Tab */}
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
                    <span>Target in Sona</span>
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

        {/* Configuration Tab */}
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
