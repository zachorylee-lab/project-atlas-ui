import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plug, CheckCircle2, ArrowRight,
  Database, Users, Calendar, BarChart3, Briefcase, KeyRound, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

type Integration = {
  name: string;
  description: string;
  status: "available" | "coming-soon" | "custom";
  bestPractices: string[];
  customerNeeds: string[];
  dataFlows: string[];
  setupSteps: string[];
};

type IntegrationCategory = {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
  integrations: Integration[];
};

const categories: IntegrationCategory[] = [
  {
    id: "hris",
    label: "HRIS & People Data",
    icon: Users,
    color: "text-orange-500",
    description: "Human Resource Information Systems that feed staff, roles, grades, skills, and org hierarchy into Dayshape",
    integrations: [
      {
        name: "Workday HCM",
        description: "Enterprise HRIS: person + org sync, roles, grades, competencies, absences, joiners/leavers/movers",
        status: "available",
        bestPractices: [
          "Use Workday RaaS reports for reliable delta pulls",
          "Establish person ID as the canonical join key across all systems",
          "Sync absences bidirectionally to avoid double-booking",
          "Agree JLM SLAs (joiners/leavers/movers) — target < 24h propagation",
        ],
        customerNeeds: ["Workday integration admin", "RaaS report specs", "Data governance sign-off"],
        dataFlows: ["Workday → Dayshape (people, org, grades, absences)", "Dayshape → Workday (utilization signals)"],
        setupSteps: ["Provision integration user", "Build RaaS reports", "Map roles/grades", "Reconcile in sandbox", "Cut over"],
      },
      {
        name: "BambooHR / HiBob / SAP SuccessFactors",
        description: "Mid-market and enterprise HRIS options for firms not on Workday",
        status: "available",
        bestPractices: [
          "Standardize role/grade taxonomy across offices before sync",
          "Handle contractors and secondees with a documented rule set",
        ],
        customerNeeds: ["HRIS admin", "API keys / OAuth", "Data mapping doc"],
        dataFlows: ["HRIS → Dayshape (people, org, absences)"],
        setupSteps: ["Connect API", "Map fields", "Pilot sync", "Reconcile", "Go-live"],
      },
    ],
  },
  {
    id: "practice",
    label: "Practice Management & Engagements",
    icon: Briefcase,
    color: "text-pink-500",
    description: "The system of record for engagements, clients, budgets, WIP, and time actuals",
    integrations: [
      {
        name: "CCH Axcess",
        description: "Wolters Kluwer practice management — engagements, clients, staff, time and billing",
        status: "available",
        bestPractices: [
          "Treat CCH engagement master as source of truth; Dayshape schedules against it",
          "Map CCH engagement types to Dayshape templates before go-live",
          "Push time actuals from CCH into Dayshape for utilization + realization reporting",
          "Reconcile daily during hypercare to catch drift",
        ],
        customerNeeds: ["CCH Axcess admin", "API / integration user", "Engagement type taxonomy"],
        dataFlows: ["CCH → Dayshape (engagements, clients, budgets, time actuals)"],
        setupSteps: ["Provision API user", "Map engagement types", "Backfill open engagements", "Validate WIP tie-out", "Go-live"],
      },
      {
        name: "Practice Engine",
        description: "Practice management platform commonly used by mid-market and large accounting firms",
        status: "available",
        bestPractices: [
          "Use Practice Engine's REST API for engagement master and time actuals",
          "Confirm client hierarchy (parent/child) is respected in Dayshape",
        ],
        customerNeeds: ["Practice Engine admin", "API credentials", "Client + engagement taxonomy"],
        dataFlows: ["Practice Engine → Dayshape (engagements, budgets, time)"],
        setupSteps: ["Enable API", "Map hierarchy", "Sync engagements", "Reconcile", "Go-live"],
      },
      {
        name: "Thomson Reuters Practice CS",
        description: "Practice management for accounting firms — engagements, time, billing",
        status: "available",
        bestPractices: [
          "Confirm export cadence supports at least nightly sync of engagements",
          "Version the engagement type mapping so template changes are auditable",
        ],
        customerNeeds: ["Practice CS admin", "Export mechanism (API or scheduled file)", "Engagement type mapping"],
        dataFlows: ["Practice CS → Dayshape (engagements, actuals)"],
        setupSteps: ["Configure export", "Map engagement types", "Load history", "Reconcile", "Go-live"],
      },
    ],
  },
  {
    id: "finance",
    label: "Finance & ERP",
    icon: BarChart3,
    color: "text-violet-500",
    description: "Finance and ERP systems for WIP, revenue recognition, and realization reporting",
    integrations: [
      {
        name: "NetSuite / Sage Intacct / Deltek Vantagepoint",
        description: "Finance / ERP systems that own billing, WIP, and revenue — Dayshape feeds planned effort and consumes actuals",
        status: "available",
        bestPractices: [
          "Agree the accounting calendar (fiscal periods, close cutoffs) up front",
          "Reconcile WIP monthly during hypercare to build finance team trust",
          "Send planned revenue by engagement into finance for forecast alignment",
        ],
        customerNeeds: ["Finance system admin", "Chart of accounts / cost centers", "Fiscal calendar"],
        dataFlows: ["ERP → Dayshape (actuals, rates)", "Dayshape → ERP (planned effort, planned revenue)"],
        setupSteps: ["Provision integration", "Map cost centers", "Reconcile pilot period", "Sign off with CFO team", "Go-live"],
      },
    ],
  },
  {
    id: "calendar",
    label: "Calendar & Productivity",
    icon: Calendar,
    color: "text-rose-500",
    description: "Publishing Dayshape bookings to individual calendars and pulling personal availability",
    integrations: [
      {
        name: "Microsoft 365 / Outlook",
        description: "Two-way calendar sync so staff bookings appear in Outlook and absences flow back to Dayshape",
        status: "available",
        bestPractices: [
          "Use application permissions with tenant admin consent — not per-user OAuth",
          "Filter which meeting categories flow back to Dayshape",
          "Handle recurring bookings carefully to avoid explosion of events",
        ],
        customerNeeds: ["Microsoft 365 tenant admin", "Graph API app registration", "Calendar sync policy"],
        dataFlows: ["Dayshape → Outlook (bookings)", "Outlook → Dayshape (absences, blocked time)"],
        setupSteps: ["Register app in Entra ID", "Grant Graph API scopes", "Pilot user cohort", "Firm-wide rollout"],
      },
      {
        name: "Google Workspace",
        description: "Two-way calendar sync for firms on Google Workspace",
        status: "available",
        bestPractices: [
          "Use a domain-wide delegation service account",
          "Document handling of shared calendars and delegates",
        ],
        customerNeeds: ["Google Workspace admin", "Service account with domain-wide delegation"],
        dataFlows: ["Dayshape → Google Calendar (bookings)", "Google → Dayshape (absences)"],
        setupSteps: ["Create service account", "Grant scopes", "Pilot", "Rollout"],
      },
    ],
  },
  {
    id: "migration",
    label: "Migrations from Legacy Resourcing",
    icon: ArrowRight,
    color: "text-amber-500",
    description: "Retain, ProStaff, Deltek, spreadsheets, and in-house tools — common Dayshape replacements",
    integrations: [
      {
        name: "Retain / ProStaff / Deltek / Spreadsheets",
        description: "Standard migration pattern: extract → map → load → parallel-run → cutover → decommission",
        status: "available",
        bestPractices: [
          "Inventory every active engagement and open booking before quoting the migration",
          "Migrate a rolling 12–24 months of history so partners keep prior-year context",
          "Rebuild the role/grade/skill taxonomy in Dayshape rather than copying legacy quirks",
          "Run parallel scheduling for one full weekly cycle before cutover",
        ],
        customerNeeds: ["Read-only export from legacy system", "Legacy taxonomy documentation", "Historical time actuals"],
        dataFlows: ["Legacy export → Dayshape (engagements + bookings + history)", "Parallel run → cutover → legacy off"],
        setupSteps: ["Inventory", "Map taxonomy", "Load history", "Parallel run", "Cutover + decommission"],
      },
    ],
  },
  {
    id: "sso",
    label: "SSO & Permissions",
    icon: KeyRound,
    color: "text-blue-500",
    description: "SAML 2.0 SSO and SCIM provisioning for the Dayshape tenant",
    integrations: [
      {
        name: "Okta / Azure AD / Google Workspace",
        description: "SAML SSO + SCIM for Dayshape user provisioning and de-provisioning",
        status: "available",
        bestPractices: [
          "Use SCIM for de-provisioning the moment a staff member leaves",
          "Build groups that map to Dayshape roles (Resource Manager, Partner, Staff, Admin)",
          "Keep one emergency break-glass local admin",
        ],
        customerNeeds: ["IdP admin", "Group/role mapping", "Custom tenant subdomain (optional)"],
        dataFlows: ["IdP → Dayshape via SAML/SCIM"],
        setupSteps: ["Connect IdP", "Map groups", "Pilot users", "Full rollout", "Decommission local logins"],
      },
    ],
  },
  {
    id: "reporting",
    label: "Reporting & Data Warehouse",
    icon: Shield,
    color: "text-emerald-500",
    description: "Export Dayshape data to the firm's warehouse and BI stack for firm-wide reporting and ML",
    integrations: [
      {
        name: "Snowflake / BigQuery / Power BI / Tableau",
        description: "Scheduled export of engagements, bookings, utilization, forecasts, and time actuals into the firm's analytics estate",
        status: "available",
        bestPractices: [
          "Partition tables by fiscal period for efficient BI queries",
          "Design a semantic layer (dbt / Power BI dataset) so partners get consistent metrics",
          "Version-control BI models alongside the Dayshape configuration",
        ],
        customerNeeds: ["Warehouse admin", "BI tool license", "Analytics owner"],
        dataFlows: ["Dayshape → Warehouse → BI (utilization, forecast, realization)"],
        setupSteps: ["Choose destination", "Provision storage", "Schedule export", "Validate counts", "Hand off to analytics"],
      },
    ],
  },
];

export default function Integrations() {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const totalIntegrations = categories.reduce((sum, c) => sum + c.integrations.length, 0);
  const availableCount = categories.reduce((sum, c) => sum + c.integrations.filter(i => i.status === "available").length, 0);

  return (
    <DashboardLayout>
      <motion.div {...fadeUp} className="space-y-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Plug className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Dayshape Integrations & Data</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Standard Dayshape integration patterns the Implementation Consultant coordinates: HRIS, practice management, finance, calendar, migrations, SSO, and warehouse export.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Plug className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalIntegrations}</p>
                <p className="text-xs text-muted-foreground">Total Integrations</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{availableCount}</p>
                <p className="text-xs text-muted-foreground">Native / Pre-built</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Database className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{categories.length}</p>
                <p className="text-xs text-muted-foreground">Integration Categories</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            return (
              <Card key={cat.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-muted", cat.color)}>
                      <CatIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{cat.label}</CardTitle>
                      <CardDescription className="text-xs">{cat.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cat.integrations.map((i) => (
                      <button
                        key={i.name}
                        onClick={() => setSelectedIntegration(i)}
                        className="text-left rounded-lg border p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-semibold">{i.name}</p>
                          <Badge variant="secondary" className="text-[10px]">
                            {i.status === "available" ? "Ready" : i.status === "custom" ? "Custom" : "Soon"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{i.description}</p>
                        <div className="flex items-center gap-1 text-[11px] text-primary mt-2">
                          View details <ArrowRight className="h-3 w-3" />
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>

      <Dialog open={!!selectedIntegration} onOpenChange={(open) => !open && setSelectedIntegration(null)}>
        {selectedIntegration && (
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedIntegration.name}</DialogTitle>
              <DialogDescription>{selectedIntegration.description}</DialogDescription>
            </DialogHeader>
            <Separator />
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Best Practices</p>
                <ul className="space-y-1.5">
                  {selectedIntegration.bestPractices.map((b) => (
                    <li key={b} className="text-sm flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Customer Needs</p>
                <ul className="space-y-1.5">
                  {selectedIntegration.customerNeeds.map((c) => (
                    <li key={c} className="text-sm flex items-start gap-2">
                      <span className="h-1 w-1 rounded-full bg-foreground/30 mt-2 shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Data Flows</p>
                <ul className="space-y-1.5">
                  {selectedIntegration.dataFlows.map((d) => (
                    <li key={d} className="text-sm flex items-start gap-2 font-mono text-xs">
                      <ArrowRight className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Setup Steps</p>
                <ol className="space-y-1.5 list-decimal list-inside">
                  {selectedIntegration.setupSteps.map((s) => (
                    <li key={s} className="text-sm">{s}</li>
                  ))}
                </ol>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </DashboardLayout>
  );
}
