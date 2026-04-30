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
    tasks: ["Review sales notes & property portfolio details", "Validate property manager requirements", "Assign onboarding specialist", "Schedule internal alignment call", "Create account in RentFlow"],
    deliverables: ["Handoff document", "Property portfolio summary", "Account setup checklist"],
    stakeholders: ["Sales AE", "Solutions Engineer", "Onboarding Specialist", "CS Lead"],
  },
  kickoff: {
    tasks: ["Conduct internal kickoff", "Host property manager kickoff call", "Confirm timeline & milestones", "Set up communication channels", "Define success metrics (rent collection rate, time-to-first-payment)"],
    deliverables: ["Onboarding plan", "RACI matrix", "Communication plan", "Success criteria doc"],
    stakeholders: ["Onboarding Specialist", "Property Manager", "Finance Lead", "Technical Lead"],
  },
  build: {
    tasks: ["Configure rent collection workflows", "Set up payment gateway integration", "Import property & tenant data", "Build custom lease templates", "Create tenant portal branding"],
    deliverables: ["Configuration document", "Payment integration specs", "Data migration report", "Tenant portal mockups"],
    stakeholders: ["Technical Lead", "Solutions Architect", "Property Manager IT", "Data Engineer"],
  },
  testing: {
    tasks: ["Create test payment scenarios", "Execute UAT with sample tenants", "Test ACH/card payment flows", "Security & compliance review", "Obtain sign-off"],
    deliverables: ["Test plan", "UAT results", "Payment reconciliation report", "Sign-off document"],
    stakeholders: ["QA Lead", "Property Manager Team", "Compliance Team", "Onboarding Specialist"],
  },
  golive: {
    tasks: ["Final tenant data sync", "Activate payment processing", "Enable tenant portal access", "Send tenant welcome communications", "Activate support escalation path"],
    deliverables: ["Go-live checklist", "Tenant communication templates", "Monitoring dashboard", "Support guide"],
    stakeholders: ["Onboarding Specialist", "DevOps", "Property Manager", "Support Team"],
  },
  hypercare: {
    tasks: ["Daily payment monitoring", "Rapid issue resolution", "Gather property manager feedback", "Optimize rent collection timing", "Transition to BAU support"],
    deliverables: ["Issue log", "Collection optimization report", "BAU transition plan", "Account health score"],
    stakeholders: ["CS Manager", "Support Lead", "Property Manager", "Product Team"],
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
