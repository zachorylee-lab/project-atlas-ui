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
      "Review signed SOW, modules in scope (HR, Payroll, Benefits, Talent, Time)",
      "Validate employee count, pay groups, FEINs, and entity structure",
      "Confirm carrier list, deduction codes, and benefits plan year",
      "Assign Project Manager, Implementation Manager, Config Specialist, QA",
      "Provision Sage HCM sandbox tenant for client",
    ],
    deliverables: [
      "Sales-to-Delivery handoff brief",
      "Module scope confirmation",
      "Sandbox tenant credentials",
      "Statement of Work confirmation",
    ],
    stakeholders: ["Sage AE", "PS Director", "Project Manager", "Client CHRO / Payroll Director"],
  },
  kickoff: {
    tasks: [
      "Host kickoff with HR, Payroll, Benefits, IT and Executive sponsor",
      "Confirm go-live target tied to a pay period or plan year boundary",
      "Walk through Sage Project Delivery Framework and RACI",
      "Set weekly status cadence and steering committee schedule",
      "Define success criteria: time-to-live, parallel payroll variance, CSAT",
    ],
    deliverables: [
      "Project charter & timeline (MS Project / Smartsheet)",
      "RACI across Sage and client teams",
      "Risk & assumption register",
      "Discovery workbook (orgs, pay groups, deduction codes, carriers)",
    ],
    stakeholders: ["Project Manager", "Client CHRO / Payroll Director", "VP HR Ops", "IT Sponsor"],
  },
  build: {
    tasks: [
      "Configure HR — orgs, jobs, positions, workflows, EE self-service",
      "Configure Payroll — pay groups, earnings/deductions, taxes, GL mapping",
      "Configure Benefits — plans, rates, eligibility, life events, OE flow",
      "Configure Talent — performance, comp planning, succession",
      "Configure Time & Attendance — schedules, accruals, rounding rules",
      "Build EDI carrier files (834), 401(k), GL exports, SSO (SAML/SCIM)",
      "Coordinate data migration from ADP/UKG/Paycom/legacy",
    ],
    deliverables: [
      "Configured tenant per module",
      "Integration specs (carrier 834, GL, 401(k), SSO, custom APIs)",
      "Data migration mapping documents",
      "Configuration playback walkthrough with client",
    ],
    stakeholders: ["Project Manager", "Implementation Manager", "Configuration Specialists", "Client SMEs (HR/Payroll/Benefits)"],
  },
  testing: {
    tasks: [
      "Lead UAT planning: scenarios per module + cross-module flows",
      "Run two to three parallel payrolls; reconcile gross-to-net to the penny",
      "Validate benefits deductions, employer match, and carrier files",
      "Test life events, new hires, terminations, and tax filings",
      "Conduct integration regression with GL, 401(k), carriers, SSO",
      "Sign Go/No-Go decision with executive sponsor",
    ],
    deliverables: [
      "UAT test scripts & sign-off log",
      "Parallel payroll reconciliation report",
      "Defect log and resolution status",
      "Go/No-Go decision document",
    ],
    stakeholders: ["Project Manager", "QA", "Client Payroll & HR SMEs", "Executive Sponsor"],
  },
  golive: {
    tasks: [
      "Execute cutover plan (final data load, sandbox→production promotion)",
      "Run first live payroll with Sage PM and Payroll specialist on-call",
      "Open command center / war room for go-live week",
      "Send client comms: ESS login, manager training, support contacts",
      "Daily executive standup; track P1/P2 issues to closure",
    ],
    deliverables: [
      "Go-live runbook & rollback plan",
      "First live payroll reconciliation",
      "User & permissions access matrix",
      "Day-1 health dashboard",
    ],
    stakeholders: ["Project Manager", "Client Payroll/HR Ops", "Sage Support", "Executive Sponsor"],
  },
  hypercare: {
    tasks: [
      "Run 30–60 day hypercare with daily then weekly check-ins",
      "Stabilize first month-end, quarter-end and tax filings",
      "Capture CSAT survey and identify expansion opportunities",
      "Transition to Customer Success / ongoing support",
      "Hold internal Sage retro: what to repeat, what to fix",
    ],
    deliverables: [
      "Hypercare exit report (incidents, resolution time)",
      "CSAT scorecard",
      "BAU transition document for Customer Success",
      "Lessons-learned retro deck",
    ],
    stakeholders: ["Project Manager", "Client Payroll Ops", "Sage Customer Success", "Sage Support"],
  },
};

export default function Playbook() {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold">Sage HCM Delivery Playbook</h1>
          <p className="text-sm text-muted-foreground mt-1">
            The 6-phase Sage Project Delivery Framework used to implement HR, Payroll, Benefits, Talent, and Time & Attendance — from sales handoff through hypercare.
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
                            <CheckSquare className="h-3.5 w-3.5" /> PM Tasks
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
