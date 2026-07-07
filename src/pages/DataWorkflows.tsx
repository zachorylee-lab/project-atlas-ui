import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users, Database, CalendarClock, BarChart3, Sparkles,
  CheckCircle2, Upload, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

type ModuleId = "firm" | "integrations" | "engagements" | "scheduling" | "ai";

type WorkflowTask = { label: string; done: boolean };
type MigrationItem = { source: string; target: string; records: string; status: "pending" | "in-progress" | "complete" | "failed" };
type ConfigStep = { label: string; description: string; done: boolean };

const modulesMeta: Record<ModuleId, { label: string; icon: React.ElementType; color: string; description: string }> = {
  firm:         { label: "Firm Model",        icon: Users,        color: "text-orange-500",  description: "Offices, service lines, teams, roles, grades, skills, and staff hierarchy" },
  integrations: { label: "Integrations",      icon: Database,     color: "text-pink-500",    description: "Workday / BambooHR HRIS, CCH Axcess / Practice Engine, calendar, and finance systems" },
  engagements:  { label: "Engagements",       icon: CalendarClock, color: "text-violet-500", description: "Engagement templates, budgets, role/grade requirements, and booking rules" },
  scheduling:   { label: "Scheduling & Forecast", icon: BarChart3, color: "text-rose-500",   description: "Firm-wide scheduling, forecast cycles, utilization dashboards, and reporting" },
  ai:           { label: "AI Auto-Scheduler", icon: Sparkles,     color: "text-amber-500",   description: "Preference weightings, skill match, staff development, and scenario simulation" },
};

const implementationChecklists: Record<ModuleId, WorkflowTask[]> = {
  firm: [
    { label: "Load offices, service lines, cost centers, and departments", done: false },
    { label: "Define role and grade taxonomy (Partner → Analyst)", done: false },
    { label: "Build competencies and skills library", done: false },
    { label: "Configure absence and non-chargeable time categories", done: false },
    { label: "Load staff population with grades, skills, and start dates", done: false },
    { label: "Configure staff development preferences (aspirations, target hours)", done: false },
    { label: "Define permission roles (Resource Manager, Partner, Staff, Admin)", done: false },
    { label: "Sign off firm model with Head of RM and HR", done: false },
  ],
  integrations: [
    { label: "Identify integration systems (HRIS / practice mgmt / finance / calendar)", done: false },
    { label: "Provision integration users and API credentials", done: false },
    { label: "Configure HRIS person + org + absence sync", done: false },
    { label: "Configure practice management engagement master sync", done: false },
    { label: "Configure calendar (Outlook / Google) two-way sync", done: false },
    { label: "Configure finance / ERP time actuals + rates sync", done: false },
    { label: "Configure SSO (Okta / Azure AD / Google) + SCIM", done: false },
    { label: "Validate end-to-end data quality < 1% error rate", done: false },
  ],
  engagements: [
    { label: "Document engagement types by service line (Audit, Tax, Advisory)", done: false },
    { label: "Build engagement templates with role/grade requirements", done: false },
    { label: "Configure client hierarchy and partner ownership rules", done: false },
    { label: "Define booking rules (min/max hours, conflict checks, overrides)", done: false },
    { label: "Configure budget-vs-actual variance thresholds", done: false },
    { label: "Set up approval workflows (RM → Partner)", done: false },
    { label: "Migrate open engagements from legacy tool", done: false },
    { label: "Reconcile engagement counts with practice management", done: false },
  ],
  scheduling: [
    { label: "Publish first pilot service line schedule", done: false },
    { label: "Run first firm-wide weekly scheduling cycle", done: false },
    { label: "Configure utilization dashboards by grade / office / service line", done: false },
    { label: "Configure realization + budget variance dashboards", done: false },
    { label: "Set up first forecast cycle (3, 6, 12 month horizons)", done: false },
    { label: "Configure staff development metrics (variety, target hours)", done: false },
    { label: "Configure Power BI / Tableau exports", done: false },
    { label: "Sign off KPI definitions with COO + Head of RM", done: false },
  ],
  ai: [
    { label: "Enable AI Auto-Scheduler in the tenant", done: false },
    { label: "Configure preference weightings (utilization, skill match, development)", done: false },
    { label: "Define do-not-book rules (partner overrides, client no-fly)", done: false },
    { label: "Pilot on one service line for two weekly cycles", done: false },
    { label: "Measure Auto-Scheduler acceptance rate (target > 70%)", done: false },
    { label: "Tune weightings based on Resource Manager feedback", done: false },
    { label: "Enable scenario simulation for busy-season planning", done: false },
    { label: "Document AI guardrails with partner steering committee", done: false },
  ],
};

const migrationData: Record<ModuleId, MigrationItem[]> = {
  firm: [
    { source: "Legacy org hierarchy", target: "Dayshape offices/teams", records: "~40 units", status: "pending" },
    { source: "Spreadsheet role/grade list", target: "Dayshape taxonomy", records: "~24 grades", status: "pending" },
    { source: "HR skills survey", target: "Dayshape skills library", records: "~120 skills", status: "pending" },
    { source: "Workday people file", target: "Dayshape staff", records: "~6,000 staff", status: "pending" },
  ],
  integrations: [
    { source: "Workday HCM", target: "Dayshape people + org", records: "6,000 records + JLM", status: "pending" },
    { source: "CCH Axcess", target: "Dayshape engagement master", records: "~12,400 engagements", status: "pending" },
    { source: "Outlook calendars", target: "Dayshape bookings sync", records: "Firm-wide", status: "pending" },
    { source: "NetSuite time actuals", target: "Dayshape actuals", records: "Rolling 24 months", status: "pending" },
  ],
  engagements: [
    { source: "Legacy engagement types", target: "Dayshape templates", records: "~35 templates", status: "pending" },
    { source: "Open engagements", target: "Dayshape engagements", records: "~4,800 open", status: "pending" },
    { source: "Historical bookings", target: "Dayshape history", records: "Rolling 24 months", status: "pending" },
    { source: "Client hierarchy", target: "Dayshape clients", records: "~9,200 clients", status: "pending" },
  ],
  scheduling: [
    { source: "Legacy weekly schedule", target: "Dayshape schedule", records: "First live cycle", status: "pending" },
    { source: "Legacy forecast spreadsheet", target: "Dayshape forecast", records: "3-year horizon", status: "pending" },
    { source: "Excel utilization report", target: "Dayshape dashboard", records: "By grade + office", status: "pending" },
    { source: "Static BI cube", target: "Power BI dataset", records: "Semantic layer", status: "pending" },
  ],
  ai: [
    { source: "Manual RM preferences", target: "AI Auto-Scheduler config", records: "Pilot service line", status: "pending" },
    { source: "Skill match rules", target: "Auto-Scheduler weightings", records: "~120 skills", status: "pending" },
    { source: "Partner no-fly list", target: "Do-not-book rules", records: "~40 rules", status: "pending" },
    { source: "Staff development targets", target: "Development weightings", records: "All grades", status: "pending" },
  ],
};

const configSteps: Record<ModuleId, ConfigStep[]> = {
  firm: [
    { label: "Org Hierarchy", description: "Offices → service lines → teams; cost centers; regional groupings", done: false },
    { label: "Roles & Grades", description: "Partner, Director, Senior Manager, Manager, Senior, Associate, Analyst", done: false },
    { label: "Skills Taxonomy", description: "Technical, industry, language, and certification skills library", done: false },
    { label: "Absences", description: "PTO, training, admin, secondment, parental leave categories", done: false },
    { label: "Permissions", description: "Role-based access for RM, Partner, Staff, Admin, Finance", done: false },
  ],
  integrations: [
    { label: "HRIS Sync", description: "Workday / BambooHR / HiBob person + org + absence", done: false },
    { label: "Practice Management", description: "CCH Axcess / Practice Engine engagement master + actuals", done: false },
    { label: "Calendar", description: "Outlook / Google two-way with meeting category filters", done: false },
    { label: "Finance / ERP", description: "NetSuite / Sage Intacct / Deltek WIP + rates", done: false },
    { label: "SSO", description: "SAML + SCIM with Okta / Azure AD / Google Workspace", done: false },
  ],
  engagements: [
    { label: "Engagement Types", description: "Audit, Tax return, Advisory project, Consulting engagement templates", done: false },
    { label: "Budgets", description: "Role/grade hour budgets per template; realization thresholds", done: false },
    { label: "Booking Rules", description: "Min/max daily hours, conflict logic, override permissions", done: false },
    { label: "Approvals", description: "Multi-step RM → Partner approval workflow", done: false },
    { label: "Client Hierarchy", description: "Parent/child client structure and partner ownership", done: false },
  ],
  scheduling: [
    { label: "Weekly Schedule", description: "Firm-wide publish cadence and lock-down rules", done: false },
    { label: "Forecast Cycles", description: "Rolling 3/6/12-month capacity forecast", done: false },
    { label: "Utilization Dashboards", description: "By grade, office, service line, partner", done: false },
    { label: "Realization Dashboards", description: "Budget vs actual, WIP write-off tracking", done: false },
    { label: "Reporting Exports", description: "Power BI dataset, Tableau extract, Snowflake feed", done: false },
  ],
  ai: [
    { label: "AI Auto-Scheduler", description: "Enable tenant-wide with a documented governance model", done: false },
    { label: "Preference Weightings", description: "Balance utilization, skill match, staff development, partner preferences", done: false },
    { label: "Do-Not-Book Rules", description: "Client no-fly, staff overrides, mandatory training blocks", done: false },
    { label: "Scenario Simulation", description: "Model busy-season demand vs. capacity before committing", done: false },
    { label: "Adoption Metrics", description: "Auto-schedule acceptance rate, override reasons, tuning cadence", done: false },
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
  const [activeModule, setActiveModule] = useState<ModuleId>("firm");
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
            <h1 className="text-2xl font-bold tracking-tight">Dayshape Workstreams</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Configure, migrate, and validate each workstream of a Dayshape firm implementation
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
                  isActive ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-primary/30"
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
                  <h3 className="text-sm font-semibold">{modulesMeta[activeModule].label} Progress</h3>
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
            <Upload className="h-3.5 w-3.5" /> Migration
          </TabsTrigger>
          <TabsTrigger value="config" className="gap-1.5 text-xs">
            <Settings className="h-3.5 w-3.5" /> Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checklist">
          <motion.div {...fadeUp}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{modulesMeta[activeModule].label} Tasks</CardTitle>
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
                      <label key={idx} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-muted/50", checked && "opacity-60")}>
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
                <CardTitle className="text-sm">Data & Asset Migration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {migrations.map((m, idx) => {
                    const style = statusStyles[m.status];
                    return (
                      <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{m.source} → {m.target}</p>
                          <p className="text-xs text-muted-foreground">{m.records}</p>
                        </div>
                        <button onClick={() => cycleMigrationStatus(idx)} className={cn("text-[11px] font-medium px-2.5 py-1 rounded-full", style.classes)}>
                          {style.label}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="config">
          <motion.div {...fadeUp}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Configuration Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {config.map((s, idx) => {
                    const checked = configChecked[idx];
                    return (
                      <label key={idx} className={cn("flex items-start gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 border", checked && "opacity-60")}>
                        <Checkbox checked={checked} onCheckedChange={() => toggleConfig(idx)} className="mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm font-medium", checked && "line-through text-muted-foreground")}>{s.label}</p>
                          <p className="text-xs text-muted-foreground">{s.description}</p>
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
