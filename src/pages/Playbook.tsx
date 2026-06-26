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
      "Review signed order form, channels purchased (Push, Email, SMS, IAM, Content Cards, WhatsApp)",
      "Confirm SDK platforms in scope (iOS, Android, Web, React Native, Flutter)",
      "Identify data source: Segment / mParticle / Snowflake CDI / direct REST",
      "Confirm migration source (Iterable, MoEngage, SFMC, Responsys, Airship)",
      "Provision Braze dashboard + workspaces; assign Delivery Manager, Technical Architect (TA), CSM, and AE per the Expert Services pod model",
    ],
    deliverables: [
      "Sales-to-Delivery handoff brief (fixed-length SOW scope locked)",
      "Channels & SDK scope confirmation",
      "Braze workspace + sandbox credentials",
      "Statement of Work + Time-to-Value targets confirmed",
    ],
    stakeholders: ["Braze AE", "Delivery Lead", "Delivery Manager", "Technical Architect", "CSM", "Customer VP Lifecycle / CRM Director"],
  },
  kickoff: {
    tasks: [
      "Host kickoff with Lifecycle, Data Eng, Mobile Eng, Web Eng, Privacy/Legal",
      "Lock target Time to First Send and Time to First Production Canvas",
      "Walk through the Braze Onboarding Methodology and shared RACI",
      "Set weekly status cadence and executive steering committee",
      "Define success criteria: TTFS, Canvas live, conversion lift, channel opt-in rate",
    ],
    deliverables: [
      "Project charter & timeline (Smartsheet / Asana)",
      "RACI across Braze and customer teams",
      "Risk & assumption register",
      "Use-case discovery workbook (welcome, abandoned cart, churn, re-engagement, transactional)",
    ],
    stakeholders: ["Delivery Manager", "VP Lifecycle / CRM", "Data Eng Lead", "Mobile Eng Lead", "Privacy Counsel"],
  },
  build: {
    tasks: [
      "Install Braze SDKs (iOS Swift, Android Kotlin, Web, React Native) with push certs/keys",
      "Stand up data ingestion: Segment/mParticle source, Cloud Data Ingestion from Snowflake, or REST /users/track",
      "Configure subscription groups, preference center, GDPR/CCPA flows",
      "Set up channels: APNs/FCM push, sending domains + DKIM/SPF/DMARC for email, Twilio short codes for SMS",
      "Build first Canvas journeys (welcome series, onboarding nudge, abandoned cart)",
      "Configure BrazeAI: Sage AI Copilot, Intelligent Channel, Intelligent Timing, content generation",
      "Build Currents / Cloud Data Sharing export to Snowflake/BigQuery for analytics",
    ],
    deliverables: [
      "SDK install confirmed across all platforms (session + event tracking validated)",
      "Data ingestion pipeline live with attribute + custom event mapping",
      "Channel configuration documented (push certs, IP warming plan, sending domains)",
      "First three Canvases built in staging with sign-off",
    ],
    stakeholders: ["Delivery Manager", "Technical Architect", "Customer Mobile/Web Eng", "Customer Data Eng", "Customer Lifecycle Marketer", "Customer agencies / 3rd parties"],
  },
  testing: {
    tasks: [
      "Lead UAT planning: per channel + per Canvas + per audience segment",
      "Run test sends to internal seed lists across all channels",
      "Validate event ingestion latency, attribute fidelity, and segment counts",
      "Test Liquid personalization, Connected Content, and Catalogs",
      "Execute deliverability seed test for email; warm IPs per the warming plan",
      "Sign Go/No-Go decision with executive sponsor",
    ],
    deliverables: [
      "UAT test scripts & sign-off log",
      "Deliverability inbox-placement report",
      "Defect log and resolution status",
      "Go/No-Go decision document",
    ],
    stakeholders: ["Delivery Manager", "QA", "Customer Lifecycle + Eng leads", "Executive Sponsor"],
  },
  golive: {
    tasks: [
      "Execute cutover: production SDK keys, production data sources, DNS authentication live",
      "Send first production campaign with Delivery Manager + Technical Architect on-call",
      "Deliver Decisioning Studio enablement workshop so customer can self-serve advanced logic post-launch",
      "Open command center / Slack war room for launch week",
      "Send customer comms: dashboard access, training links, support routing",
      "Daily executive standup; track P1/P2 issues to closure",
    ],
    deliverables: [
      "Go-live runbook & rollback plan",
      "First production send health report",
      "User & permissions matrix",
      "Day-1 deliverability + engagement dashboard",
    ],
    stakeholders: ["Delivery Manager", "Customer Lifecycle Ops", "Braze Support", "Executive Sponsor"],
  },
  hypercare: {
    tasks: [
      "Run 30–60 day hypercare with daily then weekly check-ins",
      "Stabilize first major campaign cycle (holiday, plan-year, OE-style moment)",
      "Capture CSAT survey and surface expansion use-cases to AE + CSM (additional channels, BrazeAI, Decisioning Studio)",
      "Document stakeholder hierarchy and transition account to Customer Success Manager (CSM)",
      "Feed customer use-case feedback to Product as advocacy input",
      "Hold internal Braze retro: what to repeat, what to fix",
    ],
    deliverables: [
      "Hypercare exit report (incidents, MTTR, deliverability)",
      "CSAT scorecard",
      "BAU transition document for CSM/TAM",
      "Lessons-learned retro deck",
    ],
    stakeholders: ["Delivery Manager", "Customer Lifecycle Ops", "Braze CSM/TAM", "Braze Support"],
  },
};

export default function Playbook() {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold">Braze Onboarding Playbook</h1>
          <p className="text-sm text-muted-foreground mt-1">
            The 6-phase Braze Onboarding Methodology used to launch new customers across SDK integration, data ingestion, Canvas journeys, channels, and BrazeAI — from sales handoff through hypercare.
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
                            <CheckSquare className="h-3.5 w-3.5" /> DM Tasks
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
