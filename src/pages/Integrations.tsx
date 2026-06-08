import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plug, CheckCircle2, ArrowRight,
  Heart, Shield, KeyRound, Calculator, Briefcase, Code2,
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
    id: "benefits",
    label: "Benefits Carriers (EDI 834)",
    icon: Heart,
    color: "text-rose-500",
    description: "Health, dental, vision, FSA/HSA, and life carrier integrations using ANSI 834 enrollment files",
    integrations: [
      {
        name: "Blue Cross Blue Shield",
        description: "Full 834 enrollment integration: full files for OE, change-only files for life events",
        status: "available",
        bestPractices: [
          "Run a test 834 with carrier 4 weeks before plan year",
          "Use change-only files outside OE to minimize errors",
          "Reconcile membership counts every payroll cycle",
          "Confirm carrier plan IDs and tiers before first production file",
        ],
        clientNeeds: [
          "Carrier EDI contact and SFTP credentials",
          "Plan year effective dates",
          "Group numbers and benefit plan IDs",
          "List of life events that trigger change files",
        ],
        dataFlows: ["Sage HCM Benefits → 834 → Carrier", "Membership recon → Benefits team", "Discrepancy report → Sage PM"],
        setupSteps: ["Engage carrier EDI team", "Generate test file", "Validate counts", "Run parallel", "Production cutover"],
      },
      {
        name: "Aetna / Cigna / United",
        description: "Standard 834 enrollment files; identical pattern across the top medical carriers",
        status: "available",
        bestPractices: [
          "Treat each carrier as its own mini-project",
          "Track open issues per carrier in the PM dashboard",
          "Always schedule a recon meeting 1 week post-cutover",
        ],
        clientNeeds: [
          "Carrier-specific EDI contacts",
          "Plan IDs and rate tables",
        ],
        dataFlows: ["Sage HCM → 834 → Each carrier", "Inbound discrepancy → Sage PM"],
        setupSteps: ["Carrier intake", "Mapping", "Test file", "Recon", "Go-live"],
      },
      {
        name: "Empower / Fidelity 401(k)",
        description: "Contribution and indicative data files to the 401(k) recordkeeper",
        status: "available",
        bestPractices: [
          "Send contributions every pay period; reconcile to penny",
          "Confirm match formula and true-up logic in Sage HCM",
          "Coordinate force-out and rehire scenarios with recordkeeper",
        ],
        clientNeeds: [
          "Recordkeeper SFTP credentials",
          "Plan rules (match, vesting, eligibility)",
        ],
        dataFlows: ["Payroll → 401(k) file → Recordkeeper", "ACH fund transfer → Plan trust"],
        setupSteps: ["Plan discovery", "File format confirmation", "Test file", "Parallel send", "Go-live"],
      },
    ],
  },
  {
    id: "payroll-tax",
    label: "Payroll Tax & GL",
    icon: Calculator,
    color: "text-amber-500",
    description: "Tax filing engines and GL exports to the client's accounting system",
    integrations: [
      {
        name: "MasterTax / Sage HCM Tax Service",
        description: "Federal, state, and local payroll tax calculation, deposits, and filings",
        status: "available",
        bestPractices: [
          "Validate all SUTA rates and FEIN registrations before first live payroll",
          "Confirm quarter-end and year-end calendars early",
          "Run a Q-end dry run in sandbox before first live close",
        ],
        clientNeeds: [
          "All active FEINs and state tax IDs",
          "Current SUTA rates",
          "Power of Attorney where Sage files on behalf",
        ],
        dataFlows: ["Payroll → Tax engine → Tax authorities", "Quarterly filings → State / Federal"],
        setupSteps: ["FEIN intake", "POA collection", "Rate verification", "Parallel quarter", "Go-live"],
      },
      {
        name: "Sage Intacct / NetSuite / QuickBooks GL",
        description: "GL export from Sage HCM payroll postings into the client's financial system",
        status: "available",
        bestPractices: [
          "Confirm cost-center / department dimensions match GL",
          "Reconcile first GL export line-by-line with client controller",
          "Automate file delivery via SFTP or native connector",
        ],
        clientNeeds: [
          "Chart of accounts (current and historic)",
          "Department / cost center hierarchy",
          "GL preferences (summary vs detail)",
        ],
        dataFlows: ["Payroll close → GL file → ERP", "Recon report → Controller"],
        setupSteps: ["COA discovery", "Mapping", "Test export", "Recon", "Go-live"],
      },
    ],
  },
  {
    id: "talent-ats",
    label: "Talent & ATS",
    icon: Briefcase,
    color: "text-violet-500",
    description: "Applicant tracking, background check, and onboarding integrations",
    integrations: [
      {
        name: "Greenhouse / iCIMS / Lever",
        description: "Candidate hand-off from ATS into Sage HCM new-hire onboarding workflow",
        status: "available",
        bestPractices: [
          "Use REST API hand-off rather than CSV imports where possible",
          "Map ATS source codes to Sage HCM source-of-hire field",
          "Trigger background check at offer-accept stage",
        ],
        clientNeeds: [
          "ATS API credentials",
          "Job / requisition mapping",
          "Onboarding workflow design",
        ],
        dataFlows: ["ATS → Sage HCM new-hire stub → Onboarding tasks → Active EE"],
        setupSteps: ["ATS connect", "Field mapping", "Test candidate", "Parallel onboarding", "Go-live"],
      },
      {
        name: "Checkr / Sterling Background",
        description: "Background check ordering and adjudication tied to new-hire workflow",
        status: "available",
        bestPractices: [
          "Order at offer-accept, gate hire date on completion",
          "Document adjudication rules (clear / engaged / consider)",
        ],
        clientNeeds: [
          "Background check vendor account",
          "Adjudication policy by role / state",
        ],
        dataFlows: ["Sage HCM → Background API → Result → Hire-ready flag"],
        setupSteps: ["Vendor connect", "Workflow design", "Test case", "Go-live"],
      },
    ],
  },
  {
    id: "sso-security",
    label: "SSO & Identity",
    icon: KeyRound,
    color: "text-blue-500",
    description: "Single sign-on (SAML / OIDC), SCIM provisioning, and MFA",
    integrations: [
      {
        name: "Okta / Azure AD / Google Workspace",
        description: "SAML 2.0 SSO and SCIM provisioning for Sage HCM",
        status: "available",
        bestPractices: [
          "Use SAML for SSO and SCIM for de-provisioning on termination",
          "Pilot with IT team and admins before broad rollout",
          "Always retain emergency local-admin account",
        ],
        clientNeeds: [
          "IdP admin access",
          "Group / role mapping",
          "Custom domain / vanity URL preference",
        ],
        dataFlows: ["IdP → Sage HCM via SAML/SCIM", "Termination → SCIM deactivate"],
        setupSteps: ["IdP connect", "Group mapping", "Pilot users", "Broad rollout", "Decommission legacy auth"],
      },
    ],
  },
  {
    id: "time-attendance",
    label: "Time & Attendance",
    icon: Shield,
    color: "text-emerald-500",
    description: "Time clocks, scheduling, and legacy T&A migrations",
    integrations: [
      {
        name: "Kronos / UKG Time Migration",
        description: "Migrate from Kronos / UKG T&A into Sage HCM Time & Attendance module",
        status: "available",
        bestPractices: [
          "Audit pay rules, shift differentials and rounding in legacy first",
          "Run T&A parallel for at least 2 pay cycles",
          "Validate accrual balances at cutover to the second",
        ],
        clientNeeds: [
          "Pay rule documentation",
          "Schedule patterns and union work rules",
          "Accrual balances at cutover",
        ],
        dataFlows: ["Time clocks → Sage HCM Time → Payroll batch"],
        setupSteps: ["Pay rule discovery", "Build in Sage", "T&A parallel", "Accrual cutover", "Go-live"],
      },
    ],
  },
  {
    id: "custom",
    label: "Custom & APIs",
    icon: Code2,
    color: "text-rose-500",
    description: "Custom REST/SOAP APIs, file-based exports, and Sage HCM extensibility",
    integrations: [
      {
        name: "Sage HCM REST API",
        description: "Custom integrations against the Sage HCM REST API for client-specific extensions",
        status: "custom",
        bestPractices: [
          "Use sandbox tenant for all development",
          "Authenticate via OAuth client credentials; rotate quarterly",
          "Respect rate limits; throttle and retry with backoff",
          "Use webhooks where available instead of polling",
        ],
        clientNeeds: [
          "Integration design document",
          "Developer access to source/target systems",
          "Security & compliance sign-off",
        ],
        dataFlows: ["Source system → Sage HCM API → Sage HCM data"],
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
            <h1 className="text-2xl font-bold text-foreground">Sage HCM Integrations</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Standard Sage HCM integration patterns the PM coordinates across benefits carriers, payroll tax, GL, ATS, SSO and time & attendance vendors.
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
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Client Needs</p>
                <ul className="space-y-1.5">
                  {selectedIntegration.clientNeeds.map((c) => (
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
