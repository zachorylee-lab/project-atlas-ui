import { DashboardLayout } from "@/components/DashboardLayout";
import { PHASES } from "@/lib/phases";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ArrowRightLeft, Rocket, Hammer, FlaskConical, Zap, HeartPulse,
  CheckSquare, FileText, Users,
} from "lucide-react";
import { motion } from "framer-motion";

const phaseIcons: Record<string, React.ElementType> = {
  ArrowRightLeft, Rocket, Hammer, FlaskConical, Zap, HeartPulse,
};

const phaseDetails: Record<string, { tasks: string[]; deliverables: string[]; stakeholders: string[] }> = {
  handoff: {
    tasks: [
      "Review signed order form, licensed modules (Core RM, AI Review, Forecasting, Reporting), and user count",
      "Confirm service lines in scope (Audit, Tax, Advisory, Consulting) and geographies",
      "Identify source systems: HRIS (Workday / BambooHR / HiBob), practice management (CCH Axcess / Practice Engine / Thomson Reuters), finance (NetSuite / Sage Intacct / Deltek)",
      "Confirm legacy resourcing system being replaced (Retain, ProStaff, Deltek, spreadsheets, in-house)",
      "Provision Red Oak tenant + sandbox; assign Senior Implementation Consultant, Solution Consultant, CSM, and AE",
    ],
    deliverables: [
      "Sales-to-Delivery handoff brief (fixed-scope SOW locked)",
      "In-scope service lines + integrations confirmed",
      "Red Oak sandbox tenant + admin credentials",
      "Statement of Work + Time-to-Value targets confirmed",
    ],
    stakeholders: ["Red Oak AE", "Delivery Lead", "Senior Implementation Consultant", "Solution Consultant", "CSM", "Firm COO / Head of Resource Management / Partner-in-Charge"],
  },
  kickoff: {
    tasks: [
      "Host kickoff with Resource Management, HR, IT, Finance/Practice Ops, and the executive sponsor",
      "Lock target Time to First Review and Time to First Approved Piece",
      "Walk through the Red Oak Implementation Methodology and shared RACI",
      "Discover current resourcing model: how staff are booked today, forecast horizon, WIP visibility, key pain points",
      "Set weekly status cadence and executive steering committee",
      "Define success criteria: TTFR, forecast accuracy, utilization, realization, adoption rate",
    ],
    deliverables: [
      "Project charter & timeline (Smartsheet / Asana)",
      "RACI across Red Oak and firm teams",
      "Risk & assumption register",
      "Current-state resourcing discovery workbook (roles, grades, skills, engagement types, booking rules)",
    ],
    stakeholders: ["Senior Implementation Consultant", "COO / Head of RM", "HR Business Partner", "IT Lead", "Practice Operations", "Partner Sponsor"],
  },
  build: {
    tasks: [
      "Configure firm hierarchy: offices, service lines, departments, teams, cost centers",
      "Load roles, grades, competencies, and skills taxonomy",
      "Set up engagement templates by service line (audit, tax return, advisory project) with role/grade budgets",
      "Stand up integrations: Workday / HRIS person + org sync, Practice Engine / CCH Axcess engagement master data, calendar (Outlook/Google), finance/WIP sync",
      "Migrate historical bookings and engagements from the legacy system for continuity",
      "Configure booking rules, conflict checks, absence & non-chargeable time categories",
      "Enable AI Review and configure preference weightings (utilization, skill match, staff development)",
      "Build Power BI / Tableau / Snowflake feeds for firm reporting",
    ],
    deliverables: [
      "Fully configured firm model in sandbox with sign-off",
      "Integration pipelines live (HRIS + practice management + calendar + finance)",
      "Engagement templates library ratified by service line leaders",
      "Historical bookings loaded with reconciliation report",
      "AI Review tuning parameters documented",
    ],
    stakeholders: ["Senior Implementation Consultant", "Solution Consultant", "Firm IT / Integrations Lead", "HR Data Owner", "Practice Management Owner", "Service Line Champions"],
  },
  testing: {
    tasks: [
      "Lead UAT scenarios: schedule an audit engagement, re-forecast mid-quarter, handle a resignation, resolve a booking conflict, absence request → re-schedule",
      "Run parallel scheduling for one full weekly cycle against the legacy tool",
      "Validate integration data quality: person records, engagement master, time actuals",
      "Deliver Resource Manager Technical Enablement workshop and knowledge checks",
      "Deliver Partner / Service Line Leader briefings on approvals, forecasts, and dashboards",
      "Pilot with 1–2 service lines before firm-wide cutover",
      "Sign Go/No-Go decision with executive sponsor",
    ],
    deliverables: [
      "UAT test scripts & sign-off log",
      "Parallel-run reconciliation report",
      "Trained Resource Manager cohort with knowledge-check pass rates",
      "Pilot service line adoption metrics",
      "Go/No-Go decision document",
    ],
    stakeholders: ["Senior Implementation Consultant", "QA", "Firm Resource Managers", "Service Line Leaders", "Executive Sponsor"],
  },
  golive: {
    tasks: [
      "Execute cutover: production tenant, live HRIS/practice management sync, retire legacy tool",
      "Publish first firm-wide schedule with Senior Implementation Consultant + Solution Consultant on-call",
      "Deliver Advanced Scheduling & AI Review Technical Enablement so Resource Managers self-serve",
      "Open command center / Teams war room for launch week",
      "Send firm-wide comms: tenant access, training links, support routing",
      "Daily executive standup; track P1/P2 issues to closure",
    ],
    deliverables: [
      "Go-live runbook & rollback plan",
      "First firm-wide schedule health report",
      "User & permissions matrix (Resource Manager, Partner, Staff, Admin)",
      "Day-1 utilization + booking dashboard",
      "Customer enablement sign-off (training + knowledge checks completed)",
    ],
    stakeholders: ["Senior Implementation Consultant", "Firm RM Team", "Red Oak Support", "Executive Sponsor"],
  },
  hypercare: {
    tasks: [
      "Run 30–60 day hypercare with daily then weekly check-ins",
      "Stabilize first busy-season / peak-cycle scheduling event",
      "Tune AI Review acceptance rate; iterate on preference weightings",
      "Capture CSAT + adoption metrics and surface expansion opportunities to AE + CSM (additional service lines, forecasting depth, advanced reporting)",
      "Document firm stakeholder hierarchy and hand over to Customer Success Manager (CSM)",
      "Feed firm use-case feedback to Product as advocacy input",
      "Hold enablement office hours and knowledge checks to confirm BAU readiness",
      "Hold internal Red Oak retro: what to repeat, what to fix",
    ],
    deliverables: [
      "Hypercare exit report (incidents, MTTR, utilization uplift, forecast accuracy)",
      "CSAT + adoption scorecard",
      "BAU handover document for CSM with stakeholder roles and hierarchy",
      "Lessons-learned retro deck",
      "Firm self-service readiness assessment",
    ],
    stakeholders: ["Senior Implementation Consultant", "Firm RM Team", "Red Oak CSM", "Red Oak Support"],
  },
};

export default function Playbook() {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold">Red Oak Implementation Playbook</h1>
          <p className="text-sm text-muted-foreground mt-1">
            The 6-phase Red Oak Implementation Methodology used to launch new financial services firms — from sales handoff through adoption — covering configuration, integrations, data migration, training, AI Review tuning, and firm-wide go-live.
          </p>
        </motion.div>

        <div className="flex items-center gap-0 overflow-x-auto pb-2">
          {PHASES.map((phase, i) => {
            const Icon = phaseIcons[phase.icon];
            return (
              <div key={phase.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5 min-w-[110px]">
                  <div className={`phase-badge ${phase.color} p-2 rounded-lg`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[11px] font-medium text-center leading-tight">{phase.label}</span>
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
                            <CheckSquare className="h-3.5 w-3.5" /> Consultant Tasks
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
