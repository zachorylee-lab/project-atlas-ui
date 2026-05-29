import { DashboardLayout } from "@/components/DashboardLayout";
import { PHASES } from "@/lib/phases";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ArrowRightLeft,
  Rocket,
  Hammer,
  FlaskConical,
  Zap,
  HeartPulse,
  CheckSquare,
  FileText,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const phaseIcons: Record<string, React.ElementType> = {
  ArrowRightLeft, Rocket, Hammer, FlaskConical, Zap, HeartPulse,
};

const phaseDetails: Record<string, { tasks: string[]; deliverables: string[]; stakeholders: string[] }> = {
  handoff: {
    tasks: [
      "Review signed SOW, processor agreements & merchant scope",
      "Validate target payment rails (cards, ACH, wires, FX)",
      "Confirm surcharging eligibility by state/region & card brand rules",
      "Assign Yeeld lead consultant, payments engineer & advisory partner",
      "Provision processor sandboxes (Stripe, Rainforest, Airwallex, etc.)",
    ],
    deliverables: [
      "Sales-to-delivery handoff brief",
      "Payment stack inventory (gateway, processor, vault, orchestration)",
      "Compliance pre-check (Visa/MC/AmEx surcharge rules, state laws)",
      "Statement of Work confirmation",
    ],
    stakeholders: ["Yeeld AE", "Solutions Architect", "Payments Engineer", "Merchant CFO / Finance Ops"],
  },
  kickoff: {
    tasks: [
      "Conduct internal Yeeld delivery kickoff",
      "Host merchant kickoff with Finance, Product, Engineering & Legal",
      "Confirm KPI targets (recovery rate, decline rate, chargeback ratio)",
      "Set go-live window aligned to billing & settlement cycles",
      "Define compliance posture (PCI DSS, surcharge disclosures, Reg E/Z)",
    ],
    deliverables: [
      "Implementation plan & milestone timeline",
      "RACI across Yeeld, merchant, processor & ISV partners",
      "Risk & compliance register",
      "Discovery workbook (rails, geos, BIN coverage, fees)",
    ],
    stakeholders: ["Implementation Lead", "Merchant CFO / Controller", "VP Engineering", "Legal & Compliance"],
  },
  build: {
    tasks: [
      "Integrate surcharging engine with checkout & invoicing",
      "Configure BIN-level rules, cap logic & dual-pricing disclosures",
      "Wire processor connections (Stripe, Rainforest, Airwallex, OFX)",
      "Implement Avalara for surcharge tax handling & nexus monitoring",
      "Build Tipalti / AP automation for vendor payout flows where in scope",
      "Implement webhooks, vault tokens, retries & idempotency",
    ],
    deliverables: [
      "Configured surcharging rules engine",
      "Processor integration specs & API contracts",
      "Reconciliation & settlement data model",
      "Merchant-facing reporting dashboard",
    ],
    stakeholders: ["Solutions Architect", "Yeeld Payments Engineers", "Merchant Eng / Product", "Processor Integration Manager"],
  },
  testing: {
    tasks: [
      "Run end-to-end card-present / card-not-present test matrix",
      "Validate surcharge math, caps & disclosures across BINs",
      "Simulate chargebacks, refunds, partial captures & reversals",
      "Compliance review: PCI scope, disclosures, state-by-state legality",
      "Pre-launch review with Yeeld advisory + merchant Legal",
    ],
    deliverables: [
      "UAT test scripts & results",
      "Surcharge compliance attestation",
      "Reconciliation sign-off across processors",
      "Go / No-Go decision document",
    ],
    stakeholders: ["QA Lead", "Merchant Finance & Legal", "Yeeld Advisory", "Processor Solutions"],
  },
  golive: {
    tasks: [
      "Cutover from legacy gateway / acquirer",
      "Enable production surcharging in waves by region or merchant ID",
      "Turn on live processor routing & failover rules",
      "Push merchant comms, payer-facing disclosures & FAQs",
      "Open Yeeld hypercare channel (Slack + on-call rotation)",
    ],
    deliverables: [
      "Go-live runbook & rollback plan",
      "First-day settlement reconciliation",
      "User & API access matrix",
      "Day-1 monitoring dashboard (auth rate, decline, chargeback)",
    ],
    stakeholders: ["Yeeld Implementation Lead", "Merchant Eng & Ops", "Processor Support", "Merchant Customer Support"],
  },
  hypercare: {
    tasks: [
      "Daily monitoring of auth rate, decline reasons & chargebacks",
      "Tune surcharging rules & BIN exceptions based on real traffic",
      "Run first full month-end settlement reconciliation with merchant",
      "Capture CSAT, recovery metrics & advisory recommendations",
      "Transition to ongoing Yeeld advisory / managed services",
    ],
    deliverables: [
      "First-month recovery & performance report",
      "Optimization recommendations (rails, routing, fees)",
      "BAU & advisory transition document",
      "Merchant health scorecard",
    ],
    stakeholders: ["Yeeld Advisory", "Merchant Finance Ops", "Processor Account Mgmt", "Yeeld Engineering on-call"],
  },
};

export default function Playbook() {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold">Yeeld Implementation Playbook</h1>
          <p className="text-sm text-muted-foreground mt-1">
            A repeatable 6-phase framework for shipping compliant surcharging programs and complex payment systems — from sales handoff to ongoing advisory.
          </p>
        </motion.div>

        <div className="flex items-center gap-0 overflow-x-auto pb-2">
          {PHASES.map((phase, i) => {
            const Icon = phaseIcons[phase.icon];
            return (
              <div key={phase.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5 min-w-[100px]">
                  <div className={`phase-badge ${phase.color} p-2 rounded-lg`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-medium">{phase.label}</span>
                </div>
                {i < PHASES.length - 1 && (
                  <div className="h-px w-8 bg-border shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        <Accordion type="multiple" defaultValue={["handoff"]} className="space-y-3">
          {PHASES.map((phase, i) => {
            const Icon = phaseIcons[phase.icon];
            const details = phaseDetails[phase.id];
            return (
              <motion.div key={phase.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <AccordionItem value={phase.id} className="border rounded-xl px-4 bg-card">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <div className={`phase-badge ${phase.color} p-1.5 rounded-md`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <span className="font-semibold text-sm">Phase {i + 1}: {phase.label}</span>
                        <p className="text-xs text-muted-foreground font-normal mt-0.5">{phase.description}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <Card className="border-dashed">
                        <CardHeader className="pb-2 pt-4 px-4">
                          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <CheckSquare className="h-3.5 w-3.5" /> Key Tasks
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                          <ul className="space-y-1.5">
                            {details.tasks.map((task) => (
                              <li key={task} className="text-sm flex items-start gap-2">
                                <span className="h-1 w-1 rounded-full bg-foreground/30 mt-2 shrink-0" />
                                {task}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      <Card className="border-dashed">
                        <CardHeader className="pb-2 pt-4 px-4">
                          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" /> Deliverables
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                          <ul className="space-y-1.5">
                            {details.deliverables.map((d) => (
                              <li key={d} className="text-sm flex items-start gap-2">
                                <span className="h-1 w-1 rounded-full bg-foreground/30 mt-2 shrink-0" />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      <Card className="border-dashed">
                        <CardHeader className="pb-2 pt-4 px-4">
                          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" /> Stakeholders
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                          <ul className="space-y-1.5">
                            {details.stakeholders.map((s) => (
                              <li key={s} className="text-sm flex items-start gap-2">
                                <span className="h-1 w-1 rounded-full bg-foreground/30 mt-2 shrink-0" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            );
          })}
        </Accordion>
      </div>
    </DashboardLayout>
  );
}
