import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Globe, RotateCcw, ShieldCheck, Sparkles,
  CheckCircle2, Database,
  Upload, Settings, ChevronRight, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

type ModuleId = "cross-border" | "returns" | "compliance" | "agentic-storefront";

type WorkflowTask = { label: string; done: boolean };
type MigrationItem = { source: string; target: string; records: string; status: "pending" | "in-progress" | "complete" | "failed" };
type ConfigStep = { label: string; description: string; done: boolean };

const modulesMeta: Record<ModuleId, { label: string; icon: React.ElementType; color: string; description: string }> = {
  "cross-border": { label: "Global / Cross-Border", icon: Globe, color: "text-blue-500", description: "Landed cost, duties, taxes, multi-currency, and merchant of record setup" },
  returns: { label: "Returns & Exchanges", icon: RotateCcw, color: "text-emerald-500", description: "Branded returns portal, exchanges, store credit, and revenue retention flows" },
  compliance: { label: "Compliance", icon: ShieldCheck, color: "text-violet-500", description: "GPSR, IOSS, tariffs, restricted SKUs, and per-market regulatory rules" },
  "agentic-storefront": { label: "Agentic Storefront", icon: Sparkles, color: "text-amber-500", description: "Catalog feed, attribute enrichment, and AI agent storefront configuration" },
};

const implementationChecklists: Record<ModuleId, WorkflowTask[]> = {
  "cross-border": [
    { label: "Configure landed-cost engine per launch market", done: false },
    { label: "Set up DDP / DAP shipping terms by region", done: false },
    { label: "Enable multi-currency display and FX rules", done: false },
    { label: "Wire IOSS / OSS for EU shipments under €150", done: false },
    { label: "Configure regional payment methods (iDEAL, Klarna, Alipay)", done: false },
    { label: "Set HS codes and country of origin per SKU", done: false },
    { label: "Test checkout end-to-end across each market", done: false },
    { label: "Validate duties calculations against test scenarios", done: false },
  ],
  returns: [
    { label: "Configure branded returns portal", done: false },
    { label: "Set return windows per market and SKU class", done: false },
    { label: "Enable exchange-first flow with bonus credit", done: false },
    { label: "Configure store credit incentive (+10% offer)", done: false },
    { label: "Wire regional return labels (UPS, DHL, Royal Mail)", done: false },
    { label: "Set restocking and inspection rules", done: false },
    { label: "Test refund-to-original-payment per market", done: false },
    { label: "QA branded returns portal UX", done: false },
  ],
  compliance: [
    { label: "Map GPSR responsible-person per EU market", done: false },
    { label: "Validate CE / RoHS / FDA documentation", done: false },
    { label: "Configure restricted SKU rules per market", done: false },
    { label: "Register IOSS and confirm VAT thresholds", done: false },
    { label: "Set up tariff classification audit cadence", done: false },
    { label: "Configure compliant adverse-action notices where needed", done: false },
    { label: "Run compliance dry-run on sample shipments", done: false },
    { label: "Get sign-off from brand legal team", done: false },
  ],
  "agentic-storefront": [
    { label: "Provision agentic storefront API keys", done: false },
    { label: "Sync product feed with attribute enrichment", done: false },
    { label: "Configure brand voice & guardrails", done: false },
    { label: "Map merchandising rules (collections, exclusions)", done: false },
    { label: "Wire inventory & price signals to agent", done: false },
    { label: "Connect order, returns, and shipping context", done: false },
    { label: "QA agent responses against catalog gold set", done: false },
    { label: "Enable analytics & conversation logging", done: false },
    { label: "Run pilot with controlled traffic split", done: false },
  ],
};

const migrationData: Record<ModuleId, MigrationItem[]> = {
  "cross-border": [
    { source: "Legacy Shopify", target: "Product Catalog", records: "~3,200 SKUs", status: "pending" },
    { source: "ERP", target: "HS Codes & Origin", records: "All SKUs", status: "pending" },
    { source: "Tax Provider", target: "Tax Profiles", records: "8 markets", status: "pending" },
    { source: "Pricing Sheet", target: "Multi-Currency Prices", records: "12 currencies", status: "pending" },
  ],
  returns: [
    { source: "Returns Spreadsheet", target: "Return Reasons", records: "~24 reasons", status: "pending" },
    { source: "Legacy Returns Tool", target: "Active RMAs", records: "~180 RMAs", status: "pending" },
    { source: "Order History", target: "Eligibility Rules", records: "12 months", status: "pending" },
    { source: "Carrier Contracts", target: "Label Configs", records: "~12 carriers", status: "pending" },
  ],
  compliance: [
    { source: "Brand Legal Docs", target: "GPSR Records", records: "All EU SKUs", status: "pending" },
    { source: "Tariff Database", target: "Duty Rates", records: "All HS codes", status: "pending" },
    { source: "Restricted Lists", target: "Restricted SKU Map", records: "~340 SKUs", status: "pending" },
    { source: "Tax Registrations", target: "Market Profiles", records: "8 markets", status: "pending" },
  ],
  "agentic-storefront": [
    { source: "PIM / ERP", target: "Enriched Catalog", records: "~3,200 SKUs", status: "pending" },
    { source: "Brand Guidelines", target: "Voice Profile", records: "1 ruleset", status: "pending" },
    { source: "FAQ Knowledge", target: "Agent Knowledge Base", records: "~120 articles", status: "pending" },
    { source: "Order System", target: "Live Order Context", records: "Realtime", status: "pending" },
  ],
};

const configSteps: Record<ModuleId, ConfigStep[]> = {
  "cross-border": [
    { label: "Landed Cost Engine", description: "Connect duties & tax provider; configure DDP vs. DAP per market", done: false },
    { label: "Currencies & FX", description: "Enable display currencies, set FX margins, and rounding rules", done: false },
    { label: "Regional Payments", description: "Enable iDEAL, Klarna, Alipay, and other local payment methods", done: false },
    { label: "Shipping Zones", description: "Configure carrier services and rate shopping per region", done: false },
    { label: "Merchant of Record", description: "Confirm MoR posture per market and IOSS / OSS registration", done: false },
  ],
  returns: [
    { label: "Return Windows", description: "Set return windows per market and product class", done: false },
    { label: "Exchange-First Flow", description: "Configure exchange UX with bonus credit incentives", done: false },
    { label: "Store Credit", description: "Enable store credit option with +10% bonus to retain revenue", done: false },
    { label: "Label Generation", description: "Wire regional carriers (UPS, DHL, Royal Mail) for prepaid labels", done: false },
    { label: "Inspection & Restocking", description: "Define inspection workflow and restocking fee rules", done: false },
  ],
  compliance: [
    { label: "GPSR Responsible Person", description: "Assign and document GPSR responsible person per EU market", done: false },
    { label: "Tariff Classification", description: "Validate HS codes and run quarterly classification audit", done: false },
    { label: "Restricted SKUs", description: "Map per-market restricted SKUs and block at checkout", done: false },
    { label: "Tax Registrations", description: "Confirm IOSS, OSS, and local VAT registrations are active", done: false },
    { label: "Documentation Vault", description: "Store CE / RoHS / FDA docs with expiry monitoring", done: false },
  ],
  "agentic-storefront": [
    { label: "Catalog Sync", description: "Configure product feed sync cadence and attribute enrichment", done: false },
    { label: "Brand Voice", description: "Define tone, style, and guardrails for the AI agent", done: false },
    { label: "Merchandising Rules", description: "Set collection priority, exclusions, and bundling rules", done: false },
    { label: "Live Context Wiring", description: "Connect inventory, price, order, and returns context", done: false },
    { label: "Pilot & Analytics", description: "Enable conversation logging and start a controlled pilot", done: false },
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
  const [activeModule, setActiveModule] = useState<ModuleId>("cross-border");
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
              Configure, migrate, and validate data for each CommerceOS module
            </p>
          </div>
          <Badge variant="outline" className="text-xs gap-1.5 px-3 py-1.5">
            <Database className="h-3 w-3" /> {overallDone}/{overallTasks} Complete
          </Badge>
        </div>
      </motion.div>

      <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
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
                    <span>Target in CommerceOS</span>
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
