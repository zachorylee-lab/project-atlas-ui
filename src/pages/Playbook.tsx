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
      "Review sales notes, target markets, and SKU catalog scope",
      "Validate cross-border markets, currencies, and shipping zones",
      "Capture returns policy and compliance posture (GPSR, tariffs)",
      "Assign solutions architect and onboarding lead",
      "Provision merchant workspace in CommerceOS",
    ],
    deliverables: ["Brand handoff brief", "Market & catalog scope sheet", "Account setup checklist"],
    stakeholders: ["Sales AE", "Solutions Engineer", "Onboarding Lead", "CS Lead"],
  },
  kickoff: {
    tasks: [
      "Run internal kickoff with implementation pod",
      "Host brand kickoff with merchant stakeholders",
      "Confirm launch markets, currencies, and go-live date",
      "Set up shared Slack/Teams channel and RACI",
      "Define success metrics (international AOV, return rate, duties accuracy)",
    ],
    deliverables: ["Onboarding plan", "RACI matrix", "Communication plan", "Success criteria doc"],
    stakeholders: ["Onboarding Lead", "Brand PM", "Brand Tech Lead", "Finance / Tax Lead"],
  },
  build: {
    tasks: [
      "Configure landed-cost engine (duties, taxes, VAT, IOSS)",
      "Connect storefront platform (Shopify / BigCommerce / custom)",
      "Wire up returns portal, exchanges, and store credit flows",
      "Map compliance rules per market (GPSR, RoHS, FDA, etc.)",
      "Provision agentic storefront keys & product feed sync",
    ],
    deliverables: ["Configuration doc", "Integration architecture diagram", "Compliance matrix", "Returns flow spec"],
    stakeholders: ["Solutions Architect", "Brand Engineering", "Compliance Lead", "3PL / Logistics Partner"],
  },
  testing: {
    tasks: [
      "End-to-end checkout test across all launch markets",
      "Validate duties, taxes, and currency conversion at checkout",
      "Test returns initiation, label generation, and refund/exchange flows",
      "QA agentic storefront responses against product catalog",
      "Compliance dry-run with sample shipments",
    ],
    deliverables: ["Test plan", "UAT results", "Compliance audit log", "Sign-off document"],
    stakeholders: ["QA Lead", "Brand Ops Team", "Compliance Team", "Onboarding Lead"],
  },
  golive: {
    tasks: [
      "Final catalog & inventory sync",
      "Activate live checkout, duties, and returns portal",
      "Switch DNS / theme blocks for agentic storefront",
      "Send merchant launch comms and customer announcement",
      "Activate 24/7 support escalation path",
    ],
    deliverables: ["Go-live runbook", "Customer comms templates", "Live monitoring dashboard", "Support guide"],
    stakeholders: ["Onboarding Lead", "DevOps", "Brand Marketing", "Support Team"],
  },
  hypercare: {
    tasks: [
      "Daily checkout & returns monitoring",
      "Rapid triage of duties / tax discrepancies",
      "Gather merchant feedback on conversion and return rates",
      "Optimize agentic storefront prompts and product attributes",
      "Transition to BAU CSM ownership",
    ],
    deliverables: ["Issue log", "Conversion & returns optimization report", "BAU transition plan", "Account health score"],
    stakeholders: ["CSM", "Support Lead", "Brand PM", "Product Team"],
  },
};

export default function Playbook() {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold">Onboarding Playbook</h1>
          <p className="text-sm text-muted-foreground mt-1">
            A standardized 6-phase framework for repeatable, scalable brand onboardings across cross-border, returns, compliance, and agentic storefront launches.
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
