import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plug, CheckCircle2, AlertTriangle, ArrowRight,
  CreditCard, Users, Building2, Wrench,
  Shield, FileText, Zap, Globe, Server,
  ChevronRight, DollarSign, BarChart3, MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

type Integration = {
  name: string;
  description: string;
  status: "available" | "coming-soon" | "custom";
  bestPractices: string[];
  clientNeeds: string[];
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
    id: "payments",
    label: "Payment Processing",
    icon: CreditCard,
    color: "text-blue-500",
    description: "Payment gateways and ACH providers for rent collection and disbursements",
    integrations: [
      {
        name: "Stripe",
        description: "Full-stack payment platform for cards, ACH, and wire transfers",
        status: "available",
        bestPractices: [
          "Configure separate Stripe accounts per property for clean fund segregation",
          "Enable ACH as the default payment method for lower processing fees",
          "Set up webhook notifications for failed payments to trigger tenant alerts",
          "Use Stripe Connect for multi-entity disbursements to property owners",
        ],
        clientNeeds: [
          "Stripe business account with Connect enabled",
          "Banking details for each property entity",
          "Payment fee structure agreement (PM-absorbed vs tenant-paid)",
          "PCI compliance documentation",
        ],
        dataFlows: ["Rent payments → RentFlow ledger", "Refunds → Tenant credit", "Payouts → Owner disbursements"],
        setupSteps: ["Create Stripe Connect accounts", "Configure payment methods", "Set up webhooks", "Test payment flows", "Go live"],
      },
      {
        name: "Plaid",
        description: "Bank account verification and ACH payment initiation",
        status: "available",
        bestPractices: [
          "Use Plaid Link for instant bank account verification during tenant onboarding",
          "Enable balance checks before ACH debit to reduce NSF failures",
          "Configure identity verification for fraud prevention",
        ],
        clientNeeds: [
          "Plaid API credentials (production environment)",
          "Tenant bank verification workflow approval",
          "NSF fee policy documentation",
        ],
        dataFlows: ["Bank verification → Tenant payment setup", "Balance checks → Payment validation", "ACH initiation → Rent collection"],
        setupSteps: ["Connect Plaid API", "Configure Link component", "Set up verification flow", "Test ACH transfers", "Enable production"],
      },
      {
        name: "Dwolla",
        description: "ACH payment platform optimized for rent collection",
        status: "available",
        bestPractices: [
          "Use Dwolla's mass payment feature for batch owner disbursements",
          "Configure same-day ACH for faster fund availability",
          "Set up automatic retry for failed ACH payments",
        ],
        clientNeeds: [
          "Dwolla business verified account",
          "Operating agreement for fund holding",
          "ACH authorization forms for tenants",
        ],
        dataFlows: ["Rent invoices → ACH debits", "Fund clearing → Trust account", "Disbursements → Owner bank accounts"],
        setupSteps: ["Set up Dwolla account", "Configure funding sources", "Map payment routes", "Test transfers", "Go live"],
      },
    ],
  },
  {
    id: "screening",
    label: "Tenant Screening",
    icon: Users,
    color: "text-emerald-500",
    description: "Credit checks, background verification, and income validation for applicant screening",
    integrations: [
      {
        name: "TransUnion SmartMove",
        description: "Tenant screening with credit, criminal, and eviction reports",
        status: "available",
        bestPractices: [
          "Configure screening packages per property class (A/B/C properties may have different criteria)",
          "Set up automated adverse action notices for compliance",
          "Enable applicant-initiated screening to reduce PM liability",
        ],
        clientNeeds: [
          "TransUnion SmartMove business account",
          "Screening criteria documentation per property",
          "Fair housing compliance policy",
          "State-specific adverse action notice templates",
        ],
        dataFlows: ["Applications → Screening requests", "Reports → Approval decisions", "Adverse actions → Compliance records"],
        setupSteps: ["Register for SmartMove", "Configure screening packages", "Set up criteria rules", "Test application flow", "Go live"],
      },
      {
        name: "Experian RentBureau",
        description: "Rental payment history and credit reporting for tenants",
        status: "available",
        bestPractices: [
          "Report positive rent payment data to build tenant credit profiles",
          "Use rental history data to supplement traditional credit scores",
          "Configure automated reporting on the 1st of each month",
        ],
        clientNeeds: [
          "Experian RentBureau data furnisher agreement",
          "Tenant consent forms for credit reporting",
          "12 months of historical payment data for initial reporting",
        ],
        dataFlows: ["Payment history → Credit reporting", "Tenant data → Credit profiles", "Delinquencies → Negative marks"],
        setupSteps: ["Sign data furnisher agreement", "Configure reporting schedule", "Map tenant data", "Submit initial data file", "Enable ongoing reporting"],
      },
    ],
  },
  {
    id: "accounting",
    label: "Accounting & Finance",
    icon: DollarSign,
    color: "text-violet-500",
    description: "Accounting platforms for financial reporting, owner statements, and tax preparation",
    integrations: [
      {
        name: "QuickBooks Online",
        description: "Cloud accounting for property management financials",
        status: "available",
        bestPractices: [
          "Map RentFlow chart of accounts to QBO before go-live",
          "Sync transactions daily to keep books current",
          "Use class tracking for per-property P&L reporting",
        ],
        clientNeeds: [
          "QuickBooks Online subscription (Plus or Advanced)",
          "Chart of accounts mapping document",
          "Current financial data export for baseline",
          "Accountant/bookkeeper contact for validation",
        ],
        dataFlows: ["Rent income → QBO revenue entries", "Expenses → QBO expense entries", "Owner distributions → QBO journal entries"],
        setupSteps: ["Connect QBO OAuth", "Map chart of accounts", "Configure sync rules", "Test transaction sync", "Go live"],
      },
      {
        name: "Xero",
        description: "Cloud accounting platform with property management add-ons",
        status: "available",
        bestPractices: [
          "Use Xero tracking categories for property-level reporting",
          "Enable bank feed connections for automated reconciliation",
          "Configure monthly auto-close for financial statements",
        ],
        clientNeeds: [
          "Xero subscription with API access",
          "Tracking category structure",
          "Bank feed credentials",
        ],
        dataFlows: ["Rent transactions → Xero invoices", "Expenses → Xero bills", "Reconciliation → Bank matching"],
        setupSteps: ["Connect Xero API", "Map accounts", "Configure tracking", "Test sync", "Go live"],
      },
    ],
  },
  {
    id: "pms",
    label: "Property Management",
    icon: Building2,
    color: "text-orange-500",
    description: "Legacy property management systems for data migration and coexistence",
    integrations: [
      {
        name: "AppFolio",
        description: "Cloud-based property management software",
        status: "available",
        bestPractices: [
          "Export all tenant, lease, and transaction data before migration",
          "Map AppFolio property structure to RentFlow hierarchy",
          "Plan a parallel run period for financial reconciliation",
        ],
        clientNeeds: [
          "AppFolio data export (CSV format)",
          "Property and unit structure documentation",
          "Lease agreement terms and renewal dates",
          "Open balance report as of migration date",
        ],
        dataFlows: ["Properties → RentFlow portfolio", "Tenants → RentFlow profiles", "Leases → RentFlow agreements", "Balances → Opening ledger"],
        setupSteps: ["Export AppFolio data", "Map data fields", "Run trial migration", "Validate balances", "Cutover"],
      },
      {
        name: "Buildium",
        description: "Property management and accounting platform",
        status: "available",
        bestPractices: [
          "Use Buildium's reporting API for historical data extraction",
          "Align unit numbering conventions before migration",
          "Validate security deposit balances independently",
        ],
        clientNeeds: [
          "Buildium admin access for data export",
          "Property and unit inventory spreadsheet",
          "Financial reconciliation report",
          "Vendor and owner contact lists",
        ],
        dataFlows: ["Units → RentFlow properties", "Tenants → Profiles", "Transactions → Financial history", "Vendors → Directory"],
        setupSteps: ["Export Buildium data", "Clean and map fields", "Test import", "Reconcile financials", "Go live"],
      },
      {
        name: "Yardi Voyager",
        description: "Enterprise property management and accounting",
        status: "custom",
        bestPractices: [
          "Engage Yardi's integration team early for API provisioning",
          "Plan for complex entity and fund structure mapping",
          "Run parallel financials for at least 2 months",
        ],
        clientNeeds: [
          "Yardi API credentials and documentation",
          "Entity structure and fund mapping",
          "IT team availability for firewall configuration",
          "Chart of accounts with fund assignments",
        ],
        dataFlows: ["Properties → RentFlow portfolio", "Resident data → Tenant profiles", "GL transactions → Financial ledger"],
        setupSteps: ["Configure API access", "Map entity structure", "Build data pipeline", "Validate", "Enable sync"],
      },
    ],
  },
  {
    id: "maintenance",
    label: "Maintenance & Vendors",
    icon: Wrench,
    color: "text-rose-500",
    description: "Work order management and vendor coordination platforms",
    integrations: [
      {
        name: "Latchel",
        description: "24/7 maintenance coordination and emergency triage",
        status: "available",
        bestPractices: [
          "Configure emergency triage rules to match PM escalation policy",
          "Sync work orders bidirectionally for real-time visibility",
          "Set up cost thresholds for auto-approval vs PM review",
        ],
        clientNeeds: [
          "Latchel account setup",
          "Emergency escalation policy documentation",
          "Vendor network and preferred vendor list",
          "Cost approval thresholds by category",
        ],
        dataFlows: ["Tenant requests → Latchel triage", "Work orders → RentFlow tracking", "Vendor invoices → Expense records"],
        setupSteps: ["Connect Latchel", "Configure triage rules", "Map vendor network", "Set approval thresholds", "Go live"],
      },
      {
        name: "Property Meld",
        description: "Maintenance coordination and scheduling platform",
        status: "available",
        bestPractices: [
          "Sync maintenance requests from tenant portal to Property Meld automatically",
          "Configure vendor scheduling windows to minimize vacancy downtime",
        ],
        clientNeeds: [
          "Property Meld API credentials",
          "Vendor directory with trade specialties",
          "Scheduling availability preferences",
        ],
        dataFlows: ["Maintenance requests → Work orders", "Scheduling → Vendor dispatch", "Completions → RentFlow updates"],
        setupSteps: ["Connect API", "Import vendor directory", "Configure scheduling", "Test work order flow", "Go live"],
      },
    ],
  },
  {
    id: "communications",
    label: "Communications",
    icon: MessageSquare,
    color: "text-indigo-500",
    description: "Tenant and owner communication platforms for notices, reminders, and messaging",
    integrations: [
      {
        name: "RentFlow Comms (Built-in)",
        description: "Native in-app messaging, SMS, and email notifications",
        status: "available",
        bestPractices: [
          "Enable SMS reminders 3 days before rent due date",
          "Use targeted messaging by property and lease status",
          "Set up automated lease renewal reminders 90 days before expiry",
        ],
        clientNeeds: [
          "Tenant contact info (email and phone)",
          "Communication policy and frequency preferences",
          "Notice templates (late rent, lease renewal, move-out)",
        ],
        dataFlows: ["Rent due → Payment reminders", "Lease events → Automated notices", "Maintenance updates → Tenant alerts"],
        setupSteps: ["Configure notification settings", "Set up message templates", "Define audience segments", "Enable SMS/email"],
      },
    ],
  },
  {
    id: "insurance",
    label: "Renters Insurance",
    icon: Shield,
    color: "text-teal-500",
    description: "Renters insurance verification and enrollment platforms",
    integrations: [
      {
        name: "Sure",
        description: "Embedded renters insurance enrollment at lease signing",
        status: "available",
        bestPractices: [
          "Embed insurance enrollment in the lease signing flow for maximum adoption",
          "Configure automatic compliance tracking for insurance requirements",
          "Set up expiry alerts to maintain continuous coverage",
        ],
        clientNeeds: [
          "Sure partnership agreement",
          "Insurance requirement policy per property",
          "Minimum coverage amounts by unit type",
          "Tenant communication plan for insurance enrollment",
        ],
        dataFlows: ["Lease signing → Insurance enrollment", "Policy data → Compliance tracking", "Expiry alerts → Tenant notifications"],
        setupSteps: ["Set up Sure partnership", "Configure coverage requirements", "Embed in lease flow", "Test enrollment", "Go live"],
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics & Reporting",
    icon: BarChart3,
    color: "text-cyan-500",
    description: "Business intelligence and reporting tools for portfolio performance",
    integrations: [
      {
        name: "Custom BI Integration",
        description: "Connect to any BI platform for advanced portfolio analytics",
        status: "custom",
        bestPractices: [
          "Export rent roll, vacancy, and delinquency data on a nightly schedule",
          "Map property hierarchies for drill-down reporting",
          "Configure real-time dashboards for portfolio-level KPIs",
        ],
        clientNeeds: [
          "BI platform details (Tableau, Power BI, Looker, etc.)",
          "KPI definitions and reporting requirements",
          "Data warehouse connection details",
          "Reporting frequency and distribution list",
        ],
        dataFlows: ["Financial data → BI warehouse", "Occupancy metrics → Dashboards", "Maintenance KPIs → Performance reports"],
        setupSteps: ["Connect data warehouse", "Map data models", "Build report templates", "Validate metrics", "Go live"],
      },
    ],
  },
];

export default function Integrations() {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const totalIntegrations = categories.reduce((sum, c) => sum + c.integrations.length, 0);
  const availableCount = categories.reduce((sum, c) => sum + c.integrations.filter(i => i.status === "available").length, 0);

  return (
    <DashboardLayout>
      <motion.div {...fadeUp} className="space-y-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Plug className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Connect RentFlow to the tools your property managers already use. Best practices, data requirements, and setup guides for every integration.
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
                <p className="text-xs text-muted-foreground">Pre-built & Ready</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Globe className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{categories.length}</p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="all" className="text-xs">All Categories</TabsTrigger>
            <TabsTrigger value="best-practices" className="text-xs">Best Practices</TabsTrigger>
            <TabsTrigger value="client-needs" className="text-xs">Client Requirements</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.div key={category.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={cn("h-5 w-5", category.color)} />
                            <CardTitle className="text-base">{category.label}</CardTitle>
                          </div>
                          <Badge variant="secondary" className="text-[10px]">
                            {category.integrations.length} {category.integrations.length === 1 ? "tool" : "tools"}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs">{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {category.integrations.map((integration) => (
                          <button
                            key={integration.name}
                            onClick={() => { setSelectedIntegration(integration); setSelectedCategory(category.label); }}
                            className="w-full flex items-center justify-between p-2.5 rounded-md border bg-muted/30 hover:bg-muted/60 transition-colors text-left group"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">{integration.name}</span>
                              <Badge
                                variant="outline"
                                className={cn("text-[9px] px-1.5", {
                                  "border-emerald-500/30 text-emerald-600": integration.status === "available",
                                  "border-amber-500/30 text-amber-600": integration.status === "coming-soon",
                                  "border-blue-500/30 text-blue-600": integration.status === "custom",
                                })}
                              >
                                {integration.status === "available" ? "Ready" : integration.status === "coming-soon" ? "Soon" : "Custom"}
                              </Badge>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </button>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="best-practices" className="space-y-4">
            <Accordion type="multiple" defaultValue={[categories[0].id]} className="space-y-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <AccordionItem key={category.id} value={category.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex items-center gap-2">
                        <Icon className={cn("h-4 w-4", category.color)} />
                        <span className="font-semibold text-sm">{category.label}</span>
                        <Badge variant="secondary" className="text-[10px] ml-2">{category.integrations.length}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pb-4">
                      {category.integrations.map((integration) => (
                        <Card key={integration.name} className="border-muted">
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Shield className="h-3.5 w-3.5 text-primary" />
                              {integration.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="px-4 pb-3">
                            <ul className="space-y-1.5">
                              {integration.bestPractices.map((bp, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                  <span>{bp}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </TabsContent>

          <TabsContent value="client-needs" className="space-y-4">
            <Accordion type="multiple" defaultValue={[categories[0].id]} className="space-y-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <AccordionItem key={category.id} value={category.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex items-center gap-2">
                        <Icon className={cn("h-4 w-4", category.color)} />
                        <span className="font-semibold text-sm">{category.label}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pb-4">
                      {category.integrations.map((integration) => (
                        <Card key={integration.name} className="border-muted">
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <FileText className="h-3.5 w-3.5 text-primary" />
                              {integration.name}
                              <span className="text-xs font-normal text-muted-foreground">— What we need from clients</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="px-4 pb-3">
                            <ul className="space-y-1.5">
                              {integration.clientNeeds.map((need, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                                  <span>{need}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedIntegration} onOpenChange={() => setSelectedIntegration(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            {selectedIntegration && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <DialogTitle className="text-lg">{selectedIntegration.name}</DialogTitle>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px]", {
                        "border-emerald-500/30 text-emerald-600": selectedIntegration.status === "available",
                        "border-blue-500/30 text-blue-600": selectedIntegration.status === "custom",
                      })}
                    >
                      {selectedIntegration.status === "available" ? "Pre-built" : "Custom Build"}
                    </Badge>
                  </div>
                  <DialogDescription>{selectedIntegration.description}</DialogDescription>
                  {selectedCategory && (
                    <Badge variant="secondary" className="w-fit text-[10px]">{selectedCategory}</Badge>
                  )}
                </DialogHeader>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-primary" /> Data Flows
                  </h4>
                  <div className="space-y-1.5">
                    {selectedIntegration.dataFlows.map((flow, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-md px-3 py-2">
                        <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                        <span>{flow}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <Server className="h-3.5 w-3.5 text-primary" /> Setup Steps
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedIntegration.setupSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs bg-muted/40 rounded-full px-3 py-1.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">{i + 1}</span>
                        <span className="text-foreground">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-primary" /> Best Practices
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedIntegration.bestPractices.map((bp, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-primary" /> What We Need From Clients
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedIntegration.clientNeeds.map((need, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                        <span>{need}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
}
