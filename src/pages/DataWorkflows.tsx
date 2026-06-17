import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Smartphone, Database, GitBranch, Mail, Sparkles,
  CheckCircle2, Upload, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

type ModuleId = "sdk" | "data" | "canvas" | "channels" | "ai";

type WorkflowTask = { label: string; done: boolean };
type MigrationItem = { source: string; target: string; records: string; status: "pending" | "in-progress" | "complete" | "failed" };
type ConfigStep = { label: string; description: string; done: boolean };

const modulesMeta: Record<ModuleId, { label: string; icon: React.ElementType; color: string; description: string }> = {
  sdk: { label: "SDK Integration", icon: Smartphone, color: "text-pink-500", description: "iOS, Android, Web, React Native, Flutter SDK install & session/event tracking" },
  data: { label: "Data Ingestion", icon: Database, color: "text-fuchsia-500", description: "Segment, mParticle, Snowflake CDI, and REST /users/track pipelines" },
  canvas: { label: "Canvas Journeys", icon: GitBranch, color: "text-violet-500", description: "Lifecycle journey orchestration: welcome, abandoned, churn, transactional" },
  channels: { label: "Channels Setup", icon: Mail, color: "text-rose-500", description: "Push (APNs/FCM), Email (DKIM/SPF/DMARC), SMS (10DLC), WhatsApp, IAM, Content Cards" },
  ai: { label: "BrazeAI & Personalization", icon: Sparkles, color: "text-amber-500", description: "Sage AI Copilot, Intelligent Channel, Intelligent Timing, Liquid, Connected Content, Catalogs" },
};

const implementationChecklists: Record<ModuleId, WorkflowTask[]> = {
  sdk: [
    { label: "Install iOS SDK (Swift Package Manager / CocoaPods)", done: false },
    { label: "Install Android SDK (Gradle)", done: false },
    { label: "Install Web SDK (npm or CDN snippet)", done: false },
    { label: "Configure push (APNs auth key, FCM v1 service account)", done: false },
    { label: "Validate session start / end events in test app", done: false },
    { label: "Implement `changeUser` on login with stable `external_id`", done: false },
    { label: "Implement custom events + purchases on key flows", done: false },
    { label: "Verify SDK in staging dashboard live feed", done: false },
  ],
  data: [
    { label: "Identify primary data source (Segment / mParticle / CDI / REST)", done: false },
    { label: "Design custom attribute + custom event schema", done: false },
    { label: "Map `userId` → `external_id` across sources", done: false },
    { label: "Configure consent forwarding (GDPR, CCPA, CDPA)", done: false },
    { label: "Backfill historical user profiles", done: false },
    { label: "Validate event ingestion latency < 1 min p95", done: false },
    { label: "Reconcile DAU/MAU counts vs. source of truth", done: false },
    { label: "Stand up Currents / CDS export to warehouse", done: false },
  ],
  canvas: [
    { label: "Document lifecycle stages and target use cases", done: false },
    { label: "Build welcome series Canvas (3–5 steps)", done: false },
    { label: "Build abandoned cart / abandoned browse Canvas", done: false },
    { label: "Build re-engagement / churn save Canvas", done: false },
    { label: "Build transactional Canvas (order confirm, shipping)", done: false },
    { label: "Configure conversion events on every Canvas", done: false },
    { label: "Set frequency capping and global control group", done: false },
    { label: "QA Canvas branching with seed users", done: false },
  ],
  channels: [
    { label: "Upload APNs auth key + FCM service account", done: false },
    { label: "Authenticate sending domain (SPF / DKIM / DMARC)", done: false },
    { label: "Build IP warming plan (4–6 weeks)", done: false },
    { label: "Register 10DLC brand + campaigns for SMS", done: false },
    { label: "Submit WhatsApp Business templates for approval", done: false },
    { label: "Configure subscription groups + preference center", done: false },
    { label: "Build IAM template library aligned to brand", done: false },
    { label: "Run inbox-placement seed test (Gmail/Yahoo/Outlook)", done: false },
  ],
  ai: [
    { label: "Enable Sage AI Copilot for the workspace", done: false },
    { label: "Turn on Intelligent Channel for cross-channel users", done: false },
    { label: "Enable Intelligent Timing per Canvas step", done: false },
    { label: "Set up Catalogs with product feed", done: false },
    { label: "Build Liquid personalization library", done: false },
    { label: "Configure Connected Content for live data calls", done: false },
    { label: "Run A/B test on AI-generated copy vs. human", done: false },
    { label: "Document AI guardrails with brand/legal", done: false },
  ],
};

const migrationData: Record<ModuleId, MigrationItem[]> = {
  sdk: [
    { source: "Iterable SDK", target: "Braze SDK iOS", records: "~iOS app", status: "pending" },
    { source: "Iterable SDK", target: "Braze SDK Android", records: "~Android app", status: "pending" },
    { source: "Web tracker", target: "Braze Web SDK", records: "~Marketing site", status: "pending" },
    { source: "Legacy events", target: "Custom events", records: "~30 event types", status: "pending" },
  ],
  data: [
    { source: "Iterable users", target: "Braze profiles", records: "~28M profiles", status: "pending" },
    { source: "Suppression list", target: "Subscription groups", records: "~3.2M unsubs", status: "pending" },
    { source: "Snowflake `dim_user`", target: "Custom attributes", records: "Nightly sync", status: "pending" },
    { source: "Shopify orders", target: "Purchase events", records: "Last 24 months", status: "pending" },
  ],
  canvas: [
    { source: "Iterable Workflows", target: "Braze Canvases", records: "~22 active programs", status: "pending" },
    { source: "Email templates", target: "Braze email", records: "~180 templates", status: "pending" },
    { source: "Push templates", target: "Braze push", records: "~45 templates", status: "pending" },
    { source: "Triggers/events", target: "Canvas entry", records: "~30 event triggers", status: "pending" },
  ],
  channels: [
    { source: "Legacy ESP IP", target: "New dedicated IPs", records: "4 IPs · 6-wk warm", status: "pending" },
    { source: "Legacy short code", target: "10DLC campaign", records: "1 campaign", status: "pending" },
    { source: "Legacy push certs", target: "APNs auth key", records: "p8 key", status: "pending" },
    { source: "Sender domains", target: "Authenticated subdomain", records: "mail.brand.com", status: "pending" },
  ],
  ai: [
    { source: "Manual copy library", target: "Sage AI Copilot prompts", records: "~50 prompts", status: "pending" },
    { source: "Product feed", target: "Braze Catalogs", records: "~12K SKUs", status: "pending" },
    { source: "Static send time", target: "Intelligent Timing", records: "All lifecycle Canvases", status: "pending" },
    { source: "Single-channel sends", target: "Intelligent Channel", records: "Re-engagement Canvas", status: "pending" },
  ],
};

const configSteps: Record<ModuleId, ConfigStep[]> = {
  sdk: [
    { label: "iOS Setup", description: "SPM install, AppDelegate hooks, push capability, App Group for rich push", done: false },
    { label: "Android Setup", description: "Gradle dep, AndroidManifest, FCM service account, notification channels", done: false },
    { label: "Web Setup", description: "npm or CDN snippet, service worker for web push, IAM container", done: false },
    { label: "Identity", description: "`changeUser` on login, anonymous → identified merge logic", done: false },
    { label: "Event Tracking", description: "Logged events, purchases, custom attributes per analytics plan", done: false },
  ],
  data: [
    { label: "Source Selection", description: "Decide Segment vs. mParticle vs. CDI vs. REST per use case", done: false },
    { label: "Schema Design", description: "Custom attributes & event taxonomy aligned with analytics", done: false },
    { label: "Identity Resolution", description: "external_id strategy across web, mobile, and offline systems", done: false },
    { label: "Consent", description: "Forward GDPR/CCPA consent state to Braze subscription groups", done: false },
    { label: "Warehouse Export", description: "Configure Currents or Cloud Data Sharing to Snowflake/BigQuery", done: false },
  ],
  canvas: [
    { label: "Use-Case Map", description: "Prioritize 5–8 launch use cases and entry triggers", done: false },
    { label: "Welcome / Onboarding", description: "Multi-step welcome with channel branching", done: false },
    { label: "Abandoned / Browse", description: "Catalog-personalized recovery Canvas", done: false },
    { label: "Re-engagement / Churn", description: "Predictive risk → win-back Canvas with Intelligent Channel", done: false },
    { label: "Transactional", description: "Order confirm, shipping, password reset via API-triggered Canvas", done: false },
  ],
  channels: [
    { label: "Push Setup", description: "APNs + FCM, notification permission prompt strategy", done: false },
    { label: "Email Authentication", description: "SPF, DKIM, DMARC; subdomain + IP warming plan", done: false },
    { label: "SMS / WhatsApp", description: "10DLC registration, template approval, opt-in capture", done: false },
    { label: "In-App + Content Cards", description: "Template library + targeting rules", done: false },
    { label: "Subscription Center", description: "Granular subscription groups + preference center", done: false },
  ],
  ai: [
    { label: "Sage AI Copilot", description: "Enable workspace, define brand voice, train on top performers", done: false },
    { label: "Intelligent Channel", description: "Enable on Canvases with 2+ channels per user", done: false },
    { label: "Intelligent Timing", description: "Per-user optimal send time on lifecycle Canvases", done: false },
    { label: "Catalogs", description: "Sync product feed, version it, render via Liquid", done: false },
    { label: "Connected Content", description: "Secure outbound calls to customer APIs at send time", done: false },
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
  const [activeModule, setActiveModule] = useState<ModuleId>("sdk");
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
            <h1 className="text-2xl font-bold tracking-tight">Braze Workstreams</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Configure, migrate and validate each workstream of a Braze onboarding
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
