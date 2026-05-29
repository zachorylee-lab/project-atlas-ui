import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plug, CheckCircle2, ArrowRight,
  CreditCard, Building2, Shield, Globe, Banknote, RefreshCw,
  DollarSign, Wallet, Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
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
    id: "acquiring",
    label: "Acquiring & Card Processing",
    icon: CreditCard,
    color: "text-violet-500",
    description: "Card processors and acquirers Yeeld implements and supports surcharging on",
    integrations: [
      {
        name: "Stripe",
        description: "Full Stripe integration: Payments, Billing, Connect, Terminal and Tax — wired to Yeeld's surcharging engine",
        status: "available",
        bestPractices: [
          "Use Stripe Billing for recurring + Yeeld surcharge logic at invoice creation",
          "Vault customers with Setup Intents for portable, reusable PMs",
          "Pipe webhooks through retry + DLQ for reconciliation safety",
          "Use Stripe Tax for sales-tax automation alongside surcharge math",
        ],
        clientNeeds: [
          "Stripe account with API access (restricted keys preferred)",
          "Product / pricing catalog confirmed",
          "Webhook endpoint + signing secret",
          "Decision on charge model: direct, destination, or separate charges & transfers",
        ],
        dataFlows: ["Checkout / Invoice → Stripe PaymentIntent", "Webhooks → Yeeld reconciliation", "Payouts → Merchant bank"],
        setupSteps: ["Provision Stripe sandbox", "Configure products & prices", "Wire surcharging engine", "End-to-end UAT", "Phased go-live"],
      },
      {
        name: "Rainforest",
        description: "Embedded payments and acquiring for software platforms — Yeeld's go-to partner for ISVs and marketplaces",
        status: "available",
        bestPractices: [
          "Use Rainforest sub-merchant onboarding (KYB) for fast SaaS payfac flows",
          "Layer Yeeld surcharging on top of Rainforest's processing for compliant recovery",
          "Leverage Rainforest's revenue share for ISV monetization",
        ],
        clientNeeds: [
          "Rainforest partner agreement (via Yeeld referral)",
          "ISV / platform onboarding flow design",
          "Compliance & KYB requirements documented",
        ],
        dataFlows: ["Sub-merchant KYB → Rainforest", "Transactions → Rainforest acquiring", "Surcharge $ → Merchant settlement"],
        setupSteps: ["Yeeld-Rainforest intro & contract", "API integration", "KYB & onboarding UX", "UAT", "Go-live"],
      },
    ],
  },
  {
    id: "surcharging",
    label: "Surcharging & Compliance",
    icon: Shield,
    color: "text-amber-500",
    description: "Yeeld's surcharging infrastructure plus compliance partners",
    integrations: [
      {
        name: "Yeeld Surcharging Engine",
        description: "Yeeld's proprietary surcharging platform — BIN-aware, cap-aware, brand-rule compliant, with full payer disclosures and audit trail",
        status: "available",
        bestPractices: [
          "Always surcharge credit only — never debit or prepaid (Reg II compliance)",
          "Apply lesser-of merchant cost or brand cap (currently 3% Visa, 4% MC)",
          "Show clear disclosures at entry, checkout and on receipt",
          "Re-validate BIN data quarterly and on every chargeback dispute",
          "Log every surcharge with timestamp, BIN, cap reason for audit",
        ],
        clientNeeds: [
          "Merchant cost analysis (effective rate by card brand)",
          "States / regions in scope confirmed",
          "Card brand registration (30-day notice) initiated",
          "Legal review of payer-facing disclosures",
        ],
        dataFlows: ["Checkout → Yeeld rules engine → Surcharge decision", "Surcharge applied → Processor", "Audit log → Merchant reporting"],
        setupSteps: ["Compliance discovery & state map", "Brand network notification", "Engine config & BIN load", "UAT + advisory review", "Phased rollout"],
      },
      {
        name: "Avalara AvaTax",
        description: "Sales-tax automation and nexus monitoring layered alongside surcharging",
        status: "available",
        bestPractices: [
          "Calculate tax at invoice entry to avoid post-close adjustments",
          "Use Avalara nexus monitoring to flag new state obligations",
          "Treat surcharge as non-taxable line item where legally distinct",
          "Sync exemption certificates centrally and re-validate annually",
        ],
        clientNeeds: [
          "Avalara account with AvaTax + Returns",
          "List of nexus states and product tax codes",
          "Exemption certificate inventory",
        ],
        dataFlows: ["Invoice lines → AvaTax", "Tax + surcharge → Processor", "Returns → Avalara filings"],
        setupSteps: ["Connect AvaTax", "Map tax codes", "Load exemptions", "Test calc", "Go-live"],
      },
    ],
  },
  {
    id: "fx-banking",
    label: "FX, Treasury & Global Payments",
    icon: Globe,
    color: "text-cyan-500",
    description: "Cross-border payments, FX, and global account infrastructure",
    integrations: [
      {
        name: "Airwallex",
        description: "Multi-currency accounts, FX, and global payments — Yeeld's preferred BaaS / treasury partner",
        status: "available",
        bestPractices: [
          "Open local-currency receiving accounts to avoid FX on inbound",
          "Use Airwallex FX API for transparent mid-market conversion",
          "Issue virtual cards for vendor / contractor spend with controls",
          "Batch payouts to reduce per-transaction wire fees",
        ],
        clientNeeds: [
          "Airwallex account (via Yeeld partner link)",
          "Target currencies and payment corridors confirmed",
          "KYC / compliance docs ready for entity onboarding",
        ],
        dataFlows: ["Customer pays in local FX → Airwallex collection", "FX conversion → Merchant base currency", "Payouts → Global suppliers"],
        setupSteps: ["Yeeld-Airwallex intro", "Account opening & KYC", "API integration", "Currency UAT", "Go-live"],
      },
      {
        name: "OFX",
        description: "Enterprise-grade FX, hedging and international payments — used by Yeeld for high-volume merchants",
        status: "available",
        bestPractices: [
          "Use forward contracts to lock FX for predictable settlements",
          "Compare effective FX across OFX + Airwallex per corridor",
          "Automate beneficiary payments via OFX API for high-value B2B",
        ],
        clientNeeds: [
          "OFX corporate account (via Yeeld partner link)",
          "Treasury / FX policy",
          "Hedging requirements",
        ],
        dataFlows: ["Invoices → OFX FX booking", "Forward contracts → Settlement", "International payouts → Beneficiaries"],
        setupSteps: ["Yeeld-OFX intro", "Corporate onboarding", "API integration", "Hedge policy review", "Go-live"],
      },
    ],
  },
  {
    id: "payouts",
    label: "AP Automation & Payouts",
    icon: Wallet,
    color: "text-emerald-500",
    description: "Mass payouts and supplier payments for platforms and marketplaces",
    integrations: [
      {
        name: "Tipalti",
        description: "Global mass payouts, supplier onboarding, tax compliance and AP automation",
        status: "available",
        bestPractices: [
          "Onboard suppliers via Tipalti self-service portal with W-9 / W-8 collection",
          "Use Tipalti for 1099 / 1042 reporting automation",
          "Pay across ACH, wire, PayPal and global ACH from one workflow",
          "Sync supplier master + payment status back to merchant ERP",
        ],
        clientNeeds: [
          "Tipalti account (via Yeeld partner link)",
          "Supplier list with tax classification",
          "Approval matrix and payment policies",
        ],
        dataFlows: ["Bills approved → Tipalti", "Tax forms → Tipalti collection", "Payouts → Suppliers globally"],
        setupSteps: ["Yeeld-Tipalti intro", "Account setup", "Supplier migration", "Approval workflow config", "Go-live"],
      },
    ],
  },
  {
    id: "engineering",
    label: "Engineering & Advisory",
    icon: Code2,
    color: "text-blue-500",
    description: "Yeeld's development services and trusted engineering partners",
    integrations: [
      {
        name: "Yeeld Advisory & Dev Services",
        description: "Yeeld's in-house payments engineers deliver code reviews, integrations, and end-to-end implementations",
        status: "available",
        bestPractices: [
          "Engage Yeeld advisory pre-RFP to avoid costly architecture rework",
          "Use Yeeld code reviews on every processor integration before go-live",
          "Embed a Yeeld engineer for 90 days during high-stakes launches",
        ],
        clientNeeds: [
          "Signed SOW with Yeeld",
          "Access to merchant engineering team",
          "Repo access for code reviews",
        ],
        dataFlows: ["Discovery → Architecture review", "Build → Pair programming + reviews", "Launch → On-call support"],
        setupSteps: ["Discovery call", "SOW + advisory scope", "Engineer assignment", "Sprint cadence", "Hand-off to BAU"],
      },
      {
        name: "Lemon.io",
        description: "Vetted senior engineering talent on-demand for payments and platform builds (Yeeld partner)",
        status: "available",
        bestPractices: [
          "Use Lemon.io to staff payment integrations Yeeld scopes but doesn't build",
          "Pair Yeeld advisory with Lemon.io engineers for cost-effective delivery",
          "Maintain code review gates with Yeeld even on Lemon.io builds",
        ],
        clientNeeds: [
          "Engineering role spec",
          "Tech stack & seniority requirements",
          "Engagement length",
        ],
        dataFlows: ["Role spec → Lemon.io match", "Engineer onboarded → Merchant team", "Reviews → Yeeld advisory"],
        setupSteps: ["Scoping call", "Lemon.io engineer match", "Onboarding", "Yeeld review cadence", "Delivery"],
      },
    ],
  },
  {
    id: "custom",
    label: "Custom & Orchestration",
    icon: Plug,
    color: "text-rose-500",
    description: "Custom API integrations and payment orchestration",
    integrations: [
      {
        name: "Custom Payment APIs",
        description: "Yeeld engineers custom integrations against any processor, gateway, or banking API",
        status: "custom",
        bestPractices: [
          "Always use sandbox environments for integration development",
          "Authenticate via OAuth or scoped API keys; rotate quarterly",
          "Implement idempotency keys on every state-changing call",
          "Throttle and respect rate limits; queue overflow",
          "Log every transaction for audit and replay",
        ],
        clientNeeds: [
          "Integration design document",
          "Developer access to source / target systems",
          "Security & compliance sign-off",
        ],
        dataFlows: ["Source system → Yeeld middleware → Processor", "Webhooks → Reconciliation", "Audit log → Merchant reporting"],
        setupSteps: ["Design integration", "Build in sandbox", "Security review", "UAT", "Go-live"],
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
            <h1 className="text-2xl font-bold text-foreground">Partner Integrations</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Yeeld's curated stack of processors, FX & treasury, AP automation, compliance and engineering partners — with best practices and setup guides for every integration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
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
                <Shield className="h-5 w-5 text-amber-500" />
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
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">What the Merchant Needs</p>
                <ul className="space-y-1.5">
                  {selectedIntegration.clientNeeds.map((c) => (
                    <li key={c} className="text-sm flex items-start gap-2">
                      <Building2 className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Data Flows</p>
                <ul className="space-y-1.5">
                  {selectedIntegration.dataFlows.map((d) => (
                    <li key={d} className="text-sm flex items-start gap-2">
                      <RefreshCw className="h-3.5 w-3.5 text-cyan-500 mt-0.5 shrink-0" />
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
