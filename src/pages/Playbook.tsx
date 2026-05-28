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
    tasks: ["Review signed order form & entity scope", "Validate multi-entity structure & consolidations needs", "Assign implementation consultant & solutions architect", "Schedule internal alignment with Sales & SE", "Provision Sage Intacct production & sandbox tenants"],
    deliverables: ["Sales-to-Services handoff doc", "Entity & dimensions inventory", "Module activation checklist", "Statement of Work confirmation"],
    stakeholders: ["Sales AE", "Solutions Engineer", "Implementation Consultant", "Customer Success Manager"],
  },
  kickoff: {
    tasks: ["Conduct internal kickoff with delivery team", "Host CFO/Controller kickoff & charter review", "Confirm close-cycle target & go-live date", "Set up shared workspace and weekly cadence", "Define success metrics (days-to-close, automation %, audit readiness)"],
    deliverables: ["Implementation plan & timeline", "RACI matrix", "Risk & issue log", "Discovery workbook"],
    stakeholders: ["Implementation Consultant", "CFO / Controller", "Finance Operations Lead", "IT / Systems Owner"],
  },
  build: {
    tasks: ["Configure chart of accounts, dimensions & entities", "Build inter-entity & consolidation rules", "Migrate trial balances, vendors, customers & open AR/AP", "Configure AP automation, approvals & bank feeds", "Activate AI anomaly detection & close checklist"],
    deliverables: ["Configured COA & dimension structure", "Data migration reconciliation report", "Integration specifications", "Reporting & dashboard pack"],
    stakeholders: ["Solutions Architect", "Data Migration Lead", "Customer Controller", "Integration Engineer"],
  },
  testing: {
    tasks: ["Execute UAT for record-to-report cycle", "Validate multi-entity consolidations & eliminations", "Test AP/AR workflows, approvals & bank reconciliation", "SOC 1 / audit-trail & security review", "Obtain Controller and CFO sign-off"],
    deliverables: ["UAT test scripts & results", "Reconciliation sign-off pack", "Security & roles matrix", "Go/No-Go decision document"],
    stakeholders: ["QA Lead", "Customer Finance Team", "Internal Audit", "Implementation Consultant"],
  },
  golive: {
    tasks: ["Final cutover of opening balances", "Activate live AP, AR & bank integrations", "Enable user access & SSO", "Send cutover comms to finance & approvers", "Open hypercare support channel"],
    deliverables: ["Go-live runbook", "Cutover reconciliation", "User access matrix", "Day-1 monitoring dashboard"],
    stakeholders: ["Implementation Consultant", "Customer Controller", "IT Operations", "Sage Support"],
  },
  hypercare: {
    tasks: ["Daily close-cycle monitoring & exception triage", "Run first full month-end close with customer", "Tune AI automation & approval thresholds", "Gather CSAT & QBR inputs", "Transition to Customer Success / BAU"],
    deliverables: ["First close performance report", "Optimization recommendations", "BAU transition document", "Customer health scorecard"],
    stakeholders: ["Customer Success Manager", "Support Lead", "Customer Controller", "Product Specialist"],
  },
};


export default function Playbook() {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold">Onboarding Playbook</h1>
          <p className="text-sm text-muted-foreground mt-1">
            A standardized 6-phase framework for repeatable, scalable property manager onboardings.
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
          <h1 className="text-2xl font-semibold">Sage Intacct Implementation Playbook</h1>
          <p className="text-sm text-muted-foreground mt-1">
            A standardized 6-phase framework for repeatable, audit-ready Sage Intacct deployments across single and multi-entity finance teams.
          </p>

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
