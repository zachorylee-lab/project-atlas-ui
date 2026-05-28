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
    id: "crm",
    label: "CRM & Quote-to-Cash",
    icon: Users,
    color: "text-blue-500",
    description: "CRM and CPQ platforms feeding orders, contracts, and revenue into Sage Intacct",
    integrations: [
      {
        name: "Salesforce",
        description: "Bi-directional Salesforce integration for accounts, opportunities, contracts, and invoices",
        status: "available",
        bestPractices: [
          "Sync accounts and contacts as the single customer source of truth",
          "Trigger Sage Intacct contract & invoice creation on Closed-Won",
          "Push invoice status and payment data back to Salesforce for AE visibility",
          "Use Salesforce CPQ for complex SaaS billing schedules",
        ],
        clientNeeds: [
          "Salesforce Enterprise+ org with API access",
          "Customer & opportunity field mapping",
          "Product/SKU catalog alignment",
          "Admin contact for sandbox & production deployment",
        ],
        dataFlows: ["Closed-Won opps → Sage contracts", "Customer master → Bi-directional sync", "Invoices & payments → Salesforce account view"],
        setupSteps: ["Install Sage Intacct package", "Configure OAuth", "Map objects & fields", "Test in sandbox", "Deploy to production"],
      },
      {
        name: "HubSpot",
        description: "CRM sync for SMB and growth-stage customers using HubSpot",
        status: "available",
        bestPractices: [
          "Sync companies & deals to drive automated invoicing",
          "Use HubSpot deal stages to gate Sage Intacct contract creation",
          "Push AR aging back to HubSpot for CS visibility",
        ],
        clientNeeds: [
          "HubSpot Sales Hub Pro or Enterprise",
          "Deal pipeline definitions",
          "Mapping of HubSpot products to Sage items",
        ],
        dataFlows: ["Deals → Sage orders", "Companies → Customer master", "Invoice status → HubSpot timeline"],
        setupSteps: ["Connect HubSpot API", "Map deal stages", "Configure product sync", "Test", "Go live"],
      },
    ],
  },
  {
    id: "ap-automation",
    label: "AP Automation & Spend",
    icon: CreditCard,
    color: "text-emerald-500",
    description: "AP automation, expense management, and corporate card platforms",
    integrations: [
      {
        name: "Bill.com",
        description: "Native AP automation for invoice capture, approvals, and ACH payments",
        status: "available",
        bestPractices: [
          "Route vendor invoices through Bill.com OCR for touchless AP",
          "Mirror Sage Intacct approval matrix in Bill.com workflows",
          "Sync paid bills nightly to Sage GL with full audit trail",
        ],
        clientNeeds: [
          "Bill.com subscription with Sage Intacct sync enabled",
          "Approver list with spend thresholds",
          "Vendor master file and W-9s",
          "Bank account funding setup",
        ],
        dataFlows: ["Vendor invoices → Bill.com → Sage AP", "Payments → Sage cash entries", "Vendor master → Bi-directional sync"],
        setupSteps: ["Enable Sage Intacct sync app", "Map GL accounts & dimensions", "Configure approval policies", "Test invoice flow", "Go live"],
      },
      {
        name: "Expensify",
        description: "Employee expense reports and corporate card reconciliation",
        status: "available",
        bestPractices: [
          "Map Expensify policies to Sage dimensions (department, project, location)",
          "Auto-export approved reports to Sage AP nightly",
          "Use SmartScan for receipt OCR to reduce manual coding",
        ],
        clientNeeds: [
          "Expensify Control plan",
          "Corporate card program details",
          "Expense policy & approval rules",
        ],
        dataFlows: ["Expense reports → Sage AP", "Card transactions → GL coding", "Reimbursements → Cash management"],
        setupSteps: ["Connect Expensify", "Map dimensions", "Configure auto-export", "Test", "Go live"],
      },
      {
        name: "Ramp",
        description: "Corporate cards and spend management with native Sage Intacct sync",
        status: "available",
        bestPractices: [
          "Enforce coding at swipe to eliminate month-end clean-up",
          "Use Ramp approval workflows for non-PO spend",
          "Sync transactions to Sage Intacct in near-real-time",
        ],
        clientNeeds: [
          "Ramp account with Sage Intacct integration enabled",
          "Card program rollout plan",
          "Spend policies & categories",
        ],
        dataFlows: ["Card transactions → Sage GL", "Bills → Sage AP", "Vendor sync → Bi-directional"],
        setupSteps: ["Connect Ramp", "Map GL & dimensions", "Configure policies", "Test sync", "Go live"],
      },
    ],
  },
  {
    id: "payroll-hcm",
    label: "Payroll & HCM",
    icon: Users,
    color: "text-violet-500",
    description: "Payroll and HCM platforms posting labor cost to Sage Intacct",
    integrations: [
      {
        name: "ADP Workforce Now",
        description: "Payroll journal entries and labor distribution into Sage Intacct",
        status: "available",
        bestPractices: [
          "Post payroll journals automatically each pay run",
          "Map ADP earnings & deduction codes to Sage GL accounts",
          "Use department & location dimensions for labor allocation",
        ],
        clientNeeds: [
          "ADP Workforce Now with GL Interface enabled",
          "Earnings & deduction code mapping",
          "Department, location, and project dimension list",
        ],
        dataFlows: ["Payroll journals → Sage GL", "Labor allocations → Project accounting", "Tax & benefits → AP accruals"],
        setupSteps: ["Enable ADP GL Interface", "Map codes to GL", "Test journal post", "Reconcile", "Go live"],
      },
      {
        name: "Paylocity",
        description: "Payroll posting and HR data sync for mid-market customers",
        status: "available",
        bestPractices: [
          "Auto-post pay-period journals with full dimensional detail",
          "Reconcile payroll liabilities monthly in Sage",
          "Sync employee master to keep T&E approvers current",
        ],
        clientNeeds: [
          "Paylocity Web Pay with GL integration",
          "Account mapping spreadsheet",
          "Approval hierarchy",
        ],
        dataFlows: ["Payroll → Sage GL", "Liabilities → Sage AP", "Employee master → T&E approvers"],
        setupSteps: ["Connect Paylocity", "Map accounts", "Test post", "Reconcile", "Go live"],
      },
    ],
  },
  {
    id: "banking",
    label: "Banking & Cash",
    icon: DollarSign,
    color: "text-orange-500",
    description: "Bank feeds, reconciliation, and treasury connectivity",
    integrations: [
      {
        name: "Bank Feeds (Plaid / Direct)",
        description: "Daily bank feeds for cash management and automated reconciliation",
        status: "available",
        bestPractices: [
          "Connect every operating, payroll, and trust account",
          "Enable AI-assisted match rules to auto-clear high-volume transactions",
          "Reconcile daily, not monthly, to keep close cycles short",
        ],
        clientNeeds: [
          "Bank credentials or direct connection approval",
          "List of accounts and ownership",
          "Reconciliation policies",
        ],
        dataFlows: ["Bank transactions → Sage cash management", "Match rules → Auto-reconciliation", "Exceptions → Controller review"],
        setupSteps: ["Connect bank feeds", "Configure match rules", "Run parallel reconciliation", "Tune AI", "Go live"],
      },
      {
        name: "Sage AP Automation Payments",
        description: "Native ACH, check, and virtual card payments from Sage Intacct",
        status: "available",
        bestPractices: [
          "Default to virtual card or ACH to reduce check costs and earn rebates",
          "Use positive-pay file output for fraud protection",
          "Schedule payment runs aligned to cash forecasts",
        ],
        clientNeeds: [
          "Banking details and signer list",
          "Payment policy and approval thresholds",
          "Vendor remittance preferences",
        ],
        dataFlows: ["AP bills → Payment runs", "Payments → Bank reconciliation", "Remittance → Vendor notifications"],
        setupSteps: ["Enable AP Automation", "Configure bank", "Set approvals", "Test pay run", "Go live"],
      },
    ],
  },
  {
    id: "tax-compliance",
    label: "Tax & Compliance",
    icon: Shield,
    color: "text-rose-500",
    description: "Sales tax, VAT, and compliance automation",
    integrations: [
      {
        name: "Avalara AvaTax",
        description: "Real-time sales tax calculation, filing, and exemption certificate management",
        status: "available",
        bestPractices: [
          "Calculate tax at invoice entry to avoid post-close adjustments",
          "Sync exemption certificates centrally and re-validate annually",
          "Use Avalara Returns for automated multi-state filing",
        ],
        clientNeeds: [
          "Avalara account with AvaTax & Returns",
          "List of nexus states and tax codes",
          "Exemption certificate inventory",
        ],
        dataFlows: ["Invoice line items → Tax calc", "Tax liability → Sage GL", "Filings → Avalara Returns"],
        setupSteps: ["Connect AvaTax", "Map tax codes", "Load exemptions", "Test calc", "Go live"],
      },
    ],
  },
  {
    id: "data-bi",
    label: "Data & Analytics",
    icon: BarChart3,
    color: "text-cyan-500",
    description: "Data warehouse and BI platforms for FP&A and board reporting",
    integrations: [
      {
        name: "Sage Intelligent Insights",
        description: "Native AI-powered analytics, anomaly detection, and forecasting",
        status: "available",
        bestPractices: [
          "Enable AI anomaly detection on AP, AR, and GL postings",
          "Use outlier alerts to investigate before close",
          "Share interactive dashboards with CFO & Board",
        ],
        clientNeeds: [
          "Sage Intacct subscription with Intelligent GL enabled",
          "KPI definitions and target thresholds",
          "Dashboard distribution list",
        ],
        dataFlows: ["Transactions → AI scoring", "Anomalies → Alert queue", "Dashboards → CFO/Board"],
        setupSteps: ["Enable Intelligent GL", "Configure KPIs", "Tune thresholds", "Publish dashboards", "Train users"],
      },
      {
        name: "Snowflake / BI Warehouse",
        description: "Export Sage Intacct data to Snowflake, Power BI, Tableau, or Looker",
        status: "available",
        bestPractices: [
          "Nightly incremental load to warehouse for FP&A modeling",
          "Preserve Sage dimensions for drill-down reporting",
          "Govern access via warehouse roles, not Sage logins",
        ],
        clientNeeds: [
          "Warehouse connection credentials",
          "FP&A reporting requirements",
          "Refresh schedule",
        ],
        dataFlows: ["GL & sub-ledgers → Warehouse", "Dimensions → BI models", "Reports → CFO dashboards"],
        setupSteps: ["Connect warehouse", "Map data model", "Schedule loads", "Validate", "Go live"],
      },
    ],
  },
  {
    id: "ecommerce-billing",
    label: "Billing & Revenue",
    icon: Zap,
    color: "text-teal-500",
    description: "Subscription billing and revenue recognition platforms",
    integrations: [
      {
        name: "Stripe",
        description: "Sync Stripe invoices, payments, and payouts to Sage Intacct",
        status: "available",
        bestPractices: [
          "Auto-create Sage invoices from Stripe charges with proper dimensions",
          "Reconcile Stripe payouts against bank deposits daily",
          "Use Sage Contracts module for ASC 606 revenue recognition",
        ],
        clientNeeds: [
          "Stripe account with API access",
          "Product to GL account mapping",
          "Revenue recognition policy",
        ],
        dataFlows: ["Stripe charges → Sage AR", "Payouts → Bank reconciliation", "Refunds → Sage credits"],
        setupSteps: ["Connect Stripe API", "Map products", "Configure recognition", "Test", "Go live"],
      },
      {
        name: "Sage Intacct Contracts",
        description: "Native SaaS contract billing and ASC 606 / IFRS 15 revenue recognition",
        status: "available",
        bestPractices: [
          "Model performance obligations once and reuse across contracts",
          "Automate deferred revenue and contract asset/liability schedules",
          "Run revenue waterfall reports for Board & auditors",
        ],
        clientNeeds: [
          "Contract templates and pricing models",
          "Revenue recognition policy",
          "Historical contract data",
        ],
        dataFlows: ["Contracts → Billing schedules", "Performance obligations → Revenue schedules", "Recognition → Sage GL"],
        setupSteps: ["Activate Contracts module", "Define obligations", "Migrate contracts", "Test recognition", "Go live"],
      },
    ],
  },
  {
    id: "industry",
    label: "Industry & Custom",
    icon: Globe,
    color: "text-indigo-500",
    description: "Industry-specific platforms and custom API integrations",
    integrations: [
      {
        name: "Custom API / Web Services",
        description: "Build custom integrations using Sage Intacct's REST and XML APIs",
        status: "custom",
        bestPractices: [
          "Use sandbox tenants for all integration development",
          "Authenticate via OAuth and rotate credentials quarterly",
          "Throttle calls and respect API rate limits",
          "Log all transactions for audit and replay",
        ],
        clientNeeds: [
          "Integration design document",
          "Developer access to source system",
          "Security & compliance sign-off",
        ],
        dataFlows: ["Source system → Sage Intacct objects", "Sage events → External webhooks", "Reconciliation → Audit log"],
        setupSteps: ["Design integration", "Build in sandbox", "Security review", "UAT", "Go live"],
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
            Connect Sage Intacct to the systems your finance team relies on — CRM, AP automation, payroll, banking, tax, and BI. Best practices, data requirements, and setup guides for every integration.

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
