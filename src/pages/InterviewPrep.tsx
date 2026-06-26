import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Briefcase, Users, Shield, Sparkles, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

type QA = { q: string; a: string };

const sections: { title: string; icon: React.ElementType; color: string; intro: string; qas: QA[] }[] = [
  {
    title: "JD-Specific: Expert Services & The DM Mission",
    icon: Sparkles,
    color: "text-primary",
    intro: "Questions drawn directly from the Braze Delivery Manager JD — Expert Services, fixed-length engagements, TA partnership, Time-to-Value, Decisioning Studio.",
    qas: [
      {
        q: "How do you describe the Braze Delivery Manager role in your own words?",
        a: `It's end-to-end ownership of fixed-length professional services inside Braze's Expert Services team. I project-manage a portfolio of new and existing customer implementations to accelerate Time-to-Value and protect ROI on their Braze investment. I sit on the Implementation Team next to a Technical Architect, and I orchestrate across AEs, CSMs, customer agencies, and the customer's lifecycle / data / engineering leaders to land launches on time and at quality. The TA owns the technical depth; I own the plan, the relationship, the risk, and the outcome.`,
      },
      {
        q: "What's the difference between the Delivery Manager and the Technical Architect?",
        a: `The TA is the technical authority — they design the data model, recommend SDK and ingestion patterns, and validate Canvas architecture. I'm accountable for the program: scope, plan, RACI, status, risks, change orders, stakeholder alignment, and CSAT. The JD also says DMs can "take ownership of technical workstreams when required" — so I lean in on things like sequencing the SDK install, brokering integration decisions, and running UAT, but I escalate deep platform calls to the TA. The pairing is the unit of delivery — neither of us succeeds alone.`,
      },
      {
        q: "How do you drive fast Time-to-Value on a Braze onboarding?",
        a: `Four moves. (1) In handoff and kickoff I lock the smallest valuable launch — usually one foundational Canvas (welcome) on one or two channels — and protect it from scope creep. (2) I parallelize SDK install, data ingestion, and channel auth from week one instead of running them serially. (3) I set Time to First Send and Time to First Canvas as the headline KPIs and report against them weekly. (4) I introduce BrazeAI features (Intelligent Timing, then Intelligent Channel) on the foundational Canvas so the customer sees measurable lift inside the engagement window, not 6 months later.`,
      },
      {
        q: "How do you handle a customer's agency or third party during implementation?",
        a: `I treat them as a named stakeholder in the RACI from day one — agency lead gets the same status emails, same Smartsheet access, same Slack Connect channel as the customer. I clarify in writing who owns what: usually the agency owns campaign content and Liquid, my TA owns platform configuration, the customer owns data and approvals. I escalate misalignment to the customer sponsor early — the customer signed the SOW with Braze, not with the agency, so the accountability line stays with them.`,
      },
      {
        q: "What's Decisioning Studio and why does it matter for a DM?",
        a: `Decisioning Studio is Braze's environment for orchestrating AI-driven, real-time decisions across the customer journey — channel, content, timing, and offer selection per user. The JD specifically calls out Decisioning Studio Technical Enablement for DMs, so they expect me to stay current on it. From a DM lens it matters because it's where advanced customers extract real ROI from BrazeAI, and it's a natural enablement workshop I'd deliver during Build or pre-Hypercare to set the customer up for self-service.`,
      },
      {
        q: "How do you balance customer enablement with execution?",
        a: `Enablement isn't a phase — I weave it through the engagement. Kickoff includes a platform tour, build phase pairs the customer's lifecycle marketer with the TA on the first two Canvases, testing phase is when I run the Decisioning Studio workshop, and hypercare includes office hours so they can ask "how do I…" questions on real work. By go-live the customer is already operating the platform with me looking over their shoulder, not the other way around. That's also how I keep utilization clean — I'm not the one clicking forever.`,
      },
      {
        q: "How do you transition a customer to the CSM cleanly?",
        a: `I document stakeholder roles and hierarchy in a detailed account record (decision-makers, day-to-day users, technical contacts, agency partners), summarize the program — what shipped, what's in the Phase 2 backlog, known risks, deliverability posture, BrazeAI maturity — and run a joint warm-handoff call with the CSM and customer sponsor. The CSM should walk into week one already knowing the politics, the open commitments, and the upsell hooks. The JD calls this out as a core DM responsibility, and it's how Braze keeps net retention high.`,
      },
      {
        q: "How do you advocate customer feedback to Product?",
        a: `I log feature requests against the use case that generated them — not as "customer wants X" but as "regulated financial services customer trying to do Y is blocked by Z." I bring patterns (not one-offs) to Braze's product team via the standard PM intake and to the AE for roadmap conversations. The JD names "advocating customer business use-cases to product development" explicitly, so I'd treat that as a weekly habit, not a quarterly one.`,
      },
    ],
  },
  {
    title: "About You & Role Fit",
    icon: Briefcase,
    color: "text-primary",
    intro: "Foundational questions about background and why Braze.",
    qas: [
      {
        q: "Walk me through your background and why Braze.",
        a: `I'm a delivery manager with experience leading SaaS implementations — most recently in MarTech and customer engagement. I'm drawn to Braze because of the breadth of the platform (cross-channel messaging, Canvas Flow orchestration, BrazeAI decisioning, Decisioning Studio) and because your customers — Wyndham, MetLife, Delivery Hero, Canva — sit at a scale where a strong delivery manager makes the difference between a six-month stall and a fast, clean launch. I want to bring rigorous Expert Services delivery discipline and clear executive communication to the Customer Onboarding team.`,
      },
      {
        q: "What does a Delivery Manager actually own at a platform like Braze?",
        a: `Three things. First, the plan — scope, timeline, RACI, risk, change orders, status. Second, the cross-functional orchestration — pulling in the Technical Architect, Customer Success Manager, Account Executive, and the customer's lifecycle / data / mobile teams (plus agencies) at the right moments. Third, the outcome — Time to First Send, Time to First Canvas, on-time fixed-length delivery, and customer CSAT. The TA owns the technical design; the DM owns whether the launch happens on time and the customer is happy.`,
      },
      {
        q: "Tell me about a successful implementation you've led.",
        a: `(Use STAR.) Situation: a retailer with 6M customers moving off Iterable in 12 weeks tied to peak season. Task: own end-to-end delivery — SDK reinstall on iOS/Android/Web, Segment data migration, 18 Canvas rebuild, IP warming. Action: phased plan in Smartsheet, weekly executive status, parallel sends for 4 weeks, deliverability seed tests before every cutover step, TA paired with customer mobile lead for SDK. Result: launched 5 days early, deliverability above 98%, +14% conversion vs. legacy baseline, CSAT 4.9. The customer became a Forrester case study.`,
      },
      {
        q: "Why hybrid / are you comfortable with onsite NYC / Austin time?",
        a: `Fully comfortable. Onboarding work benefits from in-person collaboration — kickoffs, war rooms during go-live week, whiteboarding Canvas architecture with the customer's lifecycle and engineering teams. I'd treat onsite days as the time for cross-functional alignment and reserve remote days for status, plan maintenance, and async customer work.`,
      },
    ],
  },
  {
    title: "Braze Platform & MarTech Domain",
    icon: Sparkles,
    color: "text-accent-foreground",
    intro: "Braze will test whether you understand SDKs, Canvas, channels, data ingestion, and BrazeAI.",
    qas: [
      {
        q: "Walk me through a Braze SDK install from a DM perspective.",
        a: `I scope and sequence — I don't write the code, the customer's mobile/web engineers do. From a DM lens: (1) confirm platforms in scope (iOS, Android, Web, React Native, Flutter); (2) confirm push setup — APNs auth key on iOS, FCM v1 service account on Android; (3) get an Technical Architect paired with the customer's engineering lead; (4) validate sessions, custom events, purchases, and changeUser in the dashboard live feed before we declare it done; (5) push a real device test across an OS major version matrix. The single biggest mistake is calling SDK done without device testing.`,
      },
      {
        q: "What's a Canvas and how do you sequence its build during onboarding?",
        a: `Canvas is Braze's journey orchestration — a multi-step, multi-channel flow with branching, delays, audience filters, conversion events, and Intelligent Channel / Intelligent Timing decisioning. During onboarding I sequence: (1) one foundational lifecycle Canvas first — usually welcome series — to prove end-to-end; (2) one revenue Canvas — abandoned cart or trial→paid; (3) one retention Canvas — re-engagement or churn save; (4) transactional via API-triggered Canvas. Always with frequency capping and a global control group from day one.`,
      },
      {
        q: "Compare Segment, mParticle, Snowflake CDI, and direct REST for ingestion.",
        a: `Segment is the fastest start — turn on the destination, map your tracking plan, replay history. mParticle is what enterprises with serious identity-resolution needs use, especially regulated industries. Snowflake Cloud Data Ingestion (and Cloud Data Sharing for the round trip) is warehouse-native — best when the customer's source of truth already lives in the warehouse. Direct REST /users/track is the escape hatch when none of the above fit. A good DM asks "where does the data actually live and who owns it" before picking — not the other way around.`,
      },
      {
        q: "Walk me through an email deliverability launch.",
        a: `Authenticate the sending subdomain (never the root) with SPF, DKIM, and DMARC — DMARC at least p=quarantine. Import suppressions from the legacy ESP day one — no exceptions. Build a 4–6 week IP warming plan that sends to your most engaged audience first and ramps volume gradually. Seed-test inbox placement at Gmail, Yahoo, and Outlook before each warming step. Have a postmaster escalation contact list ready before launch, not during the first incident.`,
      },
      {
        q: "A customer wants to lift-and-shift 40 Iterable workflows. What do you say?",
        a: `Politely push back. Lift-and-shift carries every legacy quirk into Braze, doubles the rebuild time, and forfeits Canvas's branching and AI features. I propose: audit all 40, group by use case, rebuild the top 8–10 in Canvas with modern patterns, sunset 30–50% as duplicates or low-value, and document a Phase 2 backlog for the rest. The customer always launches faster and engagement is higher. If they insist on 1:1, I issue a change order and document the trade-offs in the risk register.`,
      },
      {
        q: "What's BrazeAI and how do you sell it during onboarding?",
        a: `BrazeAI is the suite of AI features: Sage AI Copilot (generative copy + audience), Intelligent Channel (per-user channel selection), Intelligent Timing (per-user send time), and predictive features in Canvas. I introduce them in phases — Intelligent Timing on the welcome Canvas first because it's low-risk and shows immediate lift; Sage AI for copy variants in the build phase; Intelligent Channel after the customer has at least two channels live. Selling AI before they've earned their first send is a credibility loss.`,
      },
    ],
  },
  {
    title: "Delivery Management Craft",
    icon: Users,
    color: "text-blue-500",
    intro: "Process, planning, status, RACI, change orders, and SOW management.",
    qas: [
      {
        q: "How do you run weekly status with customers?",
        a: `Three-part structure: (1) RAG by workstream (SDK / Data / Canvas / Channels / Test) with a one-line "why"; (2) milestones hit this week / next week and any slips; (3) risks, decisions needed, and asks of the customer. I send a written exec summary 24 hours before the call so the meeting is decisions-only. I keep the plan in Smartsheet and a Looker/Mode dashboard the customer trusts.`,
      },
      {
        q: "Describe a project that went off the rails and how you recovered.",
        a: `STAR. Situation: mobile SDK install was 4 weeks behind because the customer's iOS engineer left. Task: protect a holiday launch. Action: I escalated to the customer's VP Engineering with two options (slip 3 weeks vs. surge a Braze Professional Services iOS engineer for 2 sprints at COBRA pricing). They picked the surge. I issued the change order in 48 hours, re-baselined the plan, and re-set executive expectations. Result: launched 5 days late instead of 4 weeks late, and the trust we built by surfacing options early led to an upsell the next quarter.`,
      },
      {
        q: "How do you manage scope creep / change orders?",
        a: `Three rules: (1) every request gets logged in a change log, even tiny ones; (2) anything outside the signed order form gets a formal change order with effort, dollars, and timeline impact within 5 business days; (3) I never start work on out-of-scope items without a countersigned CO. This protects margin, utilization targets, and the customer relationship — because surprises later are worse than friction now.`,
      },
      {
        q: "How do you build a RACI on a Braze onboarding?",
        a: `Rows: Discovery, SDK install, Data ingestion, Identity resolution, Subscription/consent, Channel setup (per channel), Canvas build (per Canvas), Deliverability, UAT, Go-Live, Hypercare. Columns: Braze DM, TA, CSM, AE; Customer VP Lifecycle, Lifecycle Manager, Data Eng, Mobile Eng, Web Eng, Privacy. Every cell gets one R and one A. Reviewed in week 1, updated when people change. It's the single best prevention for "I thought you had it" failures.`,
      },
      {
        q: "How do you keep utilization high while doing excellent customer work?",
        a: `I run a 3-tier model: (1) deep work on 2–3 active onboardings; (2) office hours on 1–2 hypercare customers; (3) admin / templates / continuous improvement to fill gaps. I time-block the calendar so utilization sits consistently in the 80–85% range, and I flag bench time to my Delivery Lead before it shows up on the report.`,
      },
    ],
  },
  {
    title: "Stakeholder & Communication",
    icon: MessageSquare,
    color: "text-violet-500",
    intro: "Executive presence, escalation, and difficult conversations.",
    qas: [
      {
        q: "How would you handle a customer executive who's lost confidence?",
        a: `Listen first — book a 1:1, no slides, one open question: "What specifically has changed for you?" Validate, mirror the concerns back, then come back inside 48 hours with a concrete recovery plan — new critical path, named owners, dates, and what I need from them. Over-communicate for the next two weeks: daily summary email, visible burn-down. Confidence is rebuilt through delivery, not slides.`,
      },
      {
        q: "How do you escalate without burning the relationship?",
        a: `"No surprises" principle. Escalate early and quietly — first to the customer project sponsor with a clear "here's what I need to keep us on track," then to my Braze Delivery Lead if blocked. I always present 2–3 options, never just the problem. The relationship survives because I bring solutions, not panic.`,
      },
      {
        q: "A customer SME consistently misses deadlines. What do you do?",
        a: `(1) Privately re-baseline expectations — confirm they have bandwidth and authority. (2) If it continues, escalate to the executive sponsor with the impact ("Their delays put launch at risk by 3 weeks") and propose options — add resources, defer scope, or re-sequence. (3) Document everything in the risk register. It's not about blaming — it's about protecting the launch.`,
      },
    ],
  },
  {
    title: "Tools, Tech & SaaS",
    icon: Shield,
    color: "text-emerald-500",
    intro: "PM tools, integrations, and comfort in a tech-forward SaaS environment.",
    qas: [
      {
        q: "What PM tools have you used and which do you prefer?",
        a: `Smartsheet, MS Project, Asana, Monday, and Jira. For customer onboardings I prefer Smartsheet because customers can co-edit and execs love the dashboards. I use Jira for in-sprint engineering work, Confluence/SharePoint for documentation, and Slack Connect channels for day-to-day customer comms. Tool matters less than discipline: single source of truth, weekly updates, dashboard the customer trusts.`,
      },
      {
        q: "How comfortable are you coordinating API or file-based integrations?",
        a: `Very. I don't write code, but I scope, sequence, and broker decisions. I know what to ask — auth method, payload, frequency, error handling, retry logic, who watches the queue when ingestion fails at 2am. I treat each integration as a mini-project with a spec, test plan, sign-off, and a named owner on both sides. I lean on the Technical Architect for the technical depth but keep schedule and risk in my lane.`,
      },
      {
        q: "How do you stay current on Braze's quarterly product releases?",
        a: `I'd subscribe to release notes day one, attend every PS enablement, and join product office hours. I'd build a "what's new in Braze" segment into customer status calls — customers love hearing about new capabilities and it positions me as a trusted advisor, not a task tracker. New features are also natural change-order conversations and CSM upsell hooks.`,
      },
    ],
  },
  {
    title: "Curveballs & Behavioral",
    icon: AlertTriangle,
    color: "text-amber-500",
    intro: "Tougher behavioral and judgment questions.",
    qas: [
      {
        q: "Tell me about a time you disagreed with your manager.",
        a: `On a previous launch my Delivery Lead wanted to ship a known deliverability bug to hit go-live. I disagreed because the customer was a regulated financial services brand and the first complaint would damage IP reputation across the shared pool for the rest of the quarter. I escalated with data — projected complaint rate, IP reputation impact, and a 5-day fix plan. We delayed 4 days, fixed it, launched clean. The lesson: escalation with data and options is leadership, not insubordination.`,
      },
      {
        q: "How do you juggle 3–5 concurrent customers?",
        a: `Calendar discipline. Every customer gets a fixed weekly cadence (status call, internal team standup, executive checkpoint). I batch admin work (status decks, change orders) into 2–3 daily blocks. P1 issues get pulled out of the schedule immediately, but my system absorbs them because everything else is on rails. The rule: every customer should feel like they're my only customer during their hour.`,
      },
      {
        q: "What's your biggest weakness?",
        a: `Earlier in my career I over-committed because I wanted to be the "yes" PM. It hurt margin and burned out my team. I've fixed it by treating "no, here's the change order" or "yes, but here's the trade-off" as the right answer. Now I track my own commitments weekly and check them against capacity before saying yes.`,
      },
      {
        q: "Why should we hire you over another candidate?",
        a: `Three reasons: (1) MarTech domain — I already speak SDKs, Canvas, deliverability, CDPs, Liquid, and Connected Content, so I'm productive in week one; (2) discipline — I run a clean RACI, weekly status, and change-order process that protects margin and CSAT; (3) executive presence — I can sit in front of a CMO or VP Lifecycle and turn a tough status into a constructive conversation. Low-risk hire who can carry a full book of customers inside 60 days.`,
      },
      {
        q: "What questions do you have for us?",
        a: `Good ones to ask back: (1) What does the average book of customers look like for a DM here — count, ARR, complexity? (2) How does Braze measure DM success — Time to First Send, CSAT, on-time launch, utilization? (3) How does the DM partner with the Technical Architect, Solutions Consultant, and TAM day-to-day? (4) What's the biggest delivery challenge the Customer Onboarding team is solving for in 2026 — Iterable migrations, BrazeAI adoption, something else? (5) What does a successful first 90 days look like in this role?`,
      },
    ],
  },
];

export default function InterviewPrep() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-semibold">Interview Prep — Braze Delivery Manager</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Common interview questions and ready-to-use answers tailored to the Braze Delivery Manager role across SDKs, Canvas, channels, data, and BrazeAI.
          </p>
        </motion.div>

        <Card className="border-accent/40 bg-accent/5">
          <CardContent className="p-5 space-y-2">
            <p className="text-sm font-semibold">How to use this page</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Each section maps to a likely interview block: fit, platform/domain, delivery craft, stakeholders, tools, and behavioral.</li>
              <li>Answers use the STAR framework where relevant (Situation, Task, Action, Result).</li>
              <li>Personalize the metrics and customer names with your own examples before the interview.</li>
              <li>Don't memorize — internalize the structure so you sound natural.</li>
            </ul>
          </CardContent>
        </Card>

        {sections.map((section, sIdx) => {
          const Icon = section.icon;
          return (
            <motion.div key={section.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: sIdx * 0.04 }}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-muted p-2">
                      <Icon className={`h-4 w-4 ${section.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{section.title}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{section.intro}</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto text-[10px]">
                      {section.qas.length} questions
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="space-y-2">
                    {section.qas.map((qa, i) => (
                      <AccordionItem key={i} value={`${sIdx}-${i}`} className="border rounded-lg px-3">
                        <AccordionTrigger className="hover:no-underline text-sm font-medium text-left py-3">
                          {qa.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4 whitespace-pre-line">
                          {qa.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        <Card className="border-primary/40">
          <CardHeader>
            <CardTitle className="text-base">Closing the interview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>End strong: "I'm genuinely excited about this role. The mix of MarTech depth, customer-facing delivery, and the chance to launch brands like the ones in Braze's portfolio is exactly the work I want to do. What are the next steps, and is there anything you'd like me to clarify or expand on before we wrap?"</p>
            <p>Then follow up within 24 hours with a personalized thank-you email referencing one specific thing the interviewer said.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
