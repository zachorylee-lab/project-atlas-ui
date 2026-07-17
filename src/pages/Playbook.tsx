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
      "Review signed order form, licensed modules (Advertising Review, AI Review, Disclosure Management, Registration Management, Monitoring), and reviewer seat counts",
      "Confirm firm profile: Broker-Dealer / RIA / Bank / Insurance, AUM, rep count, branch/OSJ footprint",
      "Identify source systems: CRM (Salesforce Financial Services Cloud, Redtail), marketing (Marketo, HubSpot, Seismic), archival (Smarsh, Global Relay, Proofpoint), and FINRA CRD/IARD feeds",
      "Confirm legacy review workflow being replaced (RegEd, MCO, Hearsay, SharePoint, email/PDF markup)",
      "Provision Red Oak tenant + sandbox; assign Senior Implementation Consultant, Solution Consultant, CSM, and AE",
    ],
    deliverables: [
      "Sales-to-Delivery handoff brief (fixed-scope SOW locked)",
      "In-scope modules, regulated entities, and integrations confirmed",
      "Red Oak sandbox tenant + admin credentials",
      "Statement of Work + Time-to-Value targets (TTFR / TTAP) confirmed",
    ],
    stakeholders: ["Red Oak AE", "Delivery Lead", "Senior Implementation Consultant", "Solution Consultant", "CSM", "CCO / Deputy CCO / Head of Marketing Compliance"],
  },
  kickoff: {
    tasks: [
      "Host kickoff with Compliance, Marketing, Legal, IT, and the executive sponsor (CCO)",
      "Lock target Time to First Review (TTFR) and Time to First Approved Piece (TTAP)",
      "Walk through the Red Oak Implementation Methodology and shared RACI",
      "Discover current-state review workflow: intake channels, reviewer tiers, escalation, SLAs, and books-and-records obligations (SEC 17a-4, FINRA 2210, 3110)",
      "Audit disclosure library, approved language, and firm-specific rules/lexicons",
      "Set weekly status cadence and executive steering committee",
      "Define success criteria: TTFR, first-pass approval rate, review cycle time, AI Review acceptance rate, reviewer adoption",
    ],
    deliverables: [
      "Project charter & timeline",
      "RACI across Red Oak and firm teams",
      "Risk & assumption register (regulatory + operational)",
      "Current-state review workflow map + disclosure library inventory",
    ],
    stakeholders: ["Senior Implementation Consultant", "CCO / Deputy CCO", "Head of Marketing Compliance", "Marketing Operations", "IT / Integrations Lead", "Legal", "Executive Sponsor"],
  },
  build: {
    tasks: [
      "Configure firm hierarchy: legal entities, broker-dealer / RIA affiliations, branches, OSJs, reviewer groups",
      "Build review workflows by material type (advertising, sales literature, correspondence, social, RFPs, website, video)",
      "Load and version-control the disclosure library and approved language repository",
      "Configure the rules engine: prohibited terms, required disclosures, performance-claim rules, and firm-specific lexicons",
      "Tune AI Review models on historical approved / rejected material to seed acceptance rates",
      "Stand up integrations: Salesforce FSC / Redtail (rep + client data), Marketo / HubSpot / Seismic (marketing intake), Smarsh / Global Relay / Proofpoint (WORM archival), FINRA CRD/IARD (rep registration + U4/U5)",
      "Configure Registration Management: rep licensing, CE tracking, U4/U5 workflows, branch OSJ inspections",
      "Migrate historical review records + audit trail from legacy tool to preserve books-and-records continuity",
      "Build reporting: reviewer productivity, cycle time, first-pass approval, exceptions, and regulatory audit packs",
    ],
    deliverables: [
      "Fully configured review workflows in sandbox with CCO sign-off",
      "Disclosure library + rules engine ratified by Legal and Compliance",
      "Integration pipelines live (CRM + marketing + archival + FINRA)",
      "AI Review tuning parameters and baseline acceptance report",
      "Historical review + registration records loaded with reconciliation report",
    ],
    stakeholders: ["Senior Implementation Consultant", "Solution Consultant", "Firm IT / Integrations Lead", "Compliance Data Owner", "Marketing Operations", "Legal", "Registration Team"],
  },
  testing: {
    tasks: [
      "Lead UAT scenarios: submit an ad piece, trigger AI Review, escalate to Principal, request revision, approve with conditions, archive to WORM store",
      "Test regulated edge cases: performance claims, testimonials (SEC Marketing Rule), social media posts, hypothetical performance, third-party content",
      "Run parallel review for one full cycle against the legacy tool; reconcile decisions and cycle times",
      "Validate WORM archival, retention, legal hold, and e-discovery retrieval (SEC 17a-4 compliant)",
      "Validate FINRA CRD/IARD sync: registration status, U4/U5 events, disclosures",
      "Deliver Reviewer Technical Enablement workshop and knowledge checks (Compliance + Principals)",
      "Deliver Marketing / Advisor briefings on submission, disclosures, and turnaround expectations",
      "Pilot with one business line or region before firm-wide cutover",
      "Sign Go/No-Go decision with CCO and executive sponsor",
    ],
    deliverables: [
      "UAT test scripts & sign-off log (with regulatory scenario coverage)",
      "Parallel-run reconciliation report",
      "WORM archival + retrieval validation evidence",
      "Trained reviewer cohort with knowledge-check pass rates",
      "Pilot business-line adoption metrics",
      "Go/No-Go decision document signed by CCO",
    ],
    stakeholders: ["Senior Implementation Consultant", "QA", "Compliance Reviewers", "Principals", "Marketing", "Registration Team", "CCO / Executive Sponsor"],
  },
  golive: {
    tasks: [
      "Execute cutover: production tenant, live CRM / marketing / archival sync, retire legacy review tool",
      "Route first live advertising, correspondence, and social submissions through Red Oak with SIC + Solution Consultant on-call",
      "Confirm WORM archival is capturing 100% of reviewed material with tamper-evident audit trail",
      "Deliver Advanced AI Review + Rules Engine enablement so Compliance can self-tune",
      "Open command center / Teams war room for launch week; daily CCO standup",
      "Send firm-wide comms: submission portal, SLAs, escalation paths, training links",
      "Track P1/P2 issues to closure; monitor first-pass approval rate and cycle time daily",
    ],
    deliverables: [
      "Go-live runbook & rollback plan",
      "First-week review pipeline health report (volume, cycle time, first-pass approval)",
      "Reviewer & permissions matrix (Reviewer, Principal, Admin, Read-only Auditor)",
      "Day-1 supervision dashboard for CCO",
      "Customer enablement sign-off (training + knowledge checks completed)",
    ],
    stakeholders: ["Senior Implementation Consultant", "Firm Compliance Team", "Marketing", "Red Oak Support", "CCO / Executive Sponsor"],
  },
  hypercare: {
    tasks: [
      "Run 30–60 day hypercare with daily then weekly check-ins",
      "Stabilize the first peak-volume event (product launch, earnings, campaign season)",
      "Tune AI Review acceptance rate; iterate on rules, disclosures, and lexicons based on reviewer feedback",
      "Capture CSAT + adoption metrics and surface expansion opportunities to AE + CSM (additional modules: Disclosure Management, Registration, Monitoring, Social)",
      "Document stakeholder hierarchy and hand over to Customer Success Manager (CSM)",
      "Feed regulated use-case feedback to Product as advocacy input (new SEC/FINRA rule guidance, AI improvements)",
      "Hold enablement office hours and knowledge checks to confirm BAU readiness",
      "Run internal Red Oak retro: what to repeat, what to fix",
      "Prepare firm for its next regulatory exam with an audit-ready reporting pack",
    ],
    deliverables: [
      "Hypercare exit report (incidents, MTTR, cycle-time reduction, first-pass approval uplift, AI acceptance rate)",
      "CSAT + adoption scorecard",
      "BAU handover document for CSM with stakeholder roles and hierarchy",
      "Audit-ready regulatory reporting pack (FINRA 2210 / SEC Marketing Rule evidence)",
      "Lessons-learned retro deck",
    ],
    stakeholders: ["Senior Implementation Consultant", "Firm Compliance Team", "Red Oak CSM", "Red Oak Support", "CCO"],
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
