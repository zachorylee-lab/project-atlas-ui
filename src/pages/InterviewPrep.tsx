import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Briefcase, Users, Shield, Sparkles, AlertTriangle, Target, ListChecks, Zap, Trophy } from "lucide-react";
import { motion } from "framer-motion";

type QA = { q: string; a: string };

const sections: { title: string; icon: React.ElementType; color: string; intro: string; qas: QA[] }[] = [
  {
    title: "JD-Specific: Red Oak & The Senior Implementation Consultant Mission",
    icon: Sparkles,
    color: "text-primary",
    intro: "Questions drawn directly from the Red Oak Senior Implementation Consultant lens — financial services compliance, advertising review, disclosure and registration management, AI Review, and books-and-records-compliant workflows.",
    qas: [
      {
        q: "How do you describe the Red Oak Senior Implementation Consultant role in your own words?",
        a: `It's end-to-end ownership of Red Oak implementations at broker-dealers, RIAs, banks, insurers, and asset managers — from sales handoff through firm-wide go-live and adoption. I lead configuration of the advertising review workflow, disclosure library, and registration management; integrations with marketing systems, CRMs, FINRA CRD/IARD, and archival vendors (Smarsh, Global Relay, Proofpoint); migration from legacy in-house or email-based review; and enablement for the CCO, compliance reviewers, marketing ops, and registered reps. My north star is shorter Time to First Review, higher first-pass approval rate, sustained books-and-records compliance under SEC Rule 17a-4, and a clean CSM handover.`,
      },
      {
        q: "What's the difference between the Implementation Consultant and the Solution Consultant?",
        a: `The Solution Consultant owns technical depth — rules engine authoring, FINRA API integration design, WORM archival configuration, and platform architecture edge cases. I own the program: scope, plan, RACI, status, risk, change orders, stakeholder alignment across compliance + marketing + IT, and CSAT. In practice I lean in on sequencing the Smarsh/Global Relay integration, brokering disclosure taxonomy decisions with the CCO, running UAT for advertising review scenarios, and coaching reviewers on the AI Review. I escalate deep platform calls to the Solution Consultant. The pairing is the unit of delivery.`,
      },
      {
        q: "How do you drive fast Time-to-Value on a Red Oak implementation?",
        a: `Four moves. (1) In handoff and kickoff I lock the smallest valuable launch — usually one channel (retail marketing) with a foundational review workflow and disclosure set — and protect it from scope creep. (2) I parallelize compliance program configuration, marketing-system + archival integrations, and legacy review-history migration from week one. (3) I set Time to First Review and Time to First Approved Piece as headline KPIs and report against them weekly. (4) I turn on AI Review early on the pilot channel with conservative confidence thresholds so reviewers see suggestion acceptance climb inside the engagement, not six months later.`,
      },
      {
        q: "How do you handle the firm's IT team, InfoSec, or a third-party integrator during implementation?",
        a: `I treat them as named stakeholders in the RACI from day one — IT, InfoSec, the archival vendor (Smarsh/Global Relay/Proofpoint), and any marketing-systems admin all get the same status emails and Teams channel as the CCO's team. I clarify in writing who owns what: IT owns identity (Okta SSO/SCIM) and network access, InfoSec owns SOC 2 and 17a-4 sign-off, the archival vendor owns the WORM feed, the Solution Consultant owns Red Oak configuration, and the customer owns disclosure-library sign-off. Misalignment gets escalated to the CCO or COO early — accountability sits with the firm that signed the SOW.`,
      },
      {
        q: "What is Red Oak's AI Review and why does it matter for a Senior Implementation Consultant?",
        a: `AI Review uses LLMs plus Red Oak's proprietary prompt engineering to pre-screen advertising and marketing content — flagging missing disclosures, prohibited language, unsupported performance claims, and rule violations before a human reviewer sees the piece. From an implementation lens it matters because it's where the customer feels ROI: instead of a reviewer reading every piece from scratch, they triage AI-flagged findings and approve. I run a technical enablement workshop during Test & Train and again pre-Hypercare so reviewers understand how to tune rules, when to override, and how to measure AI suggestion acceptance rate. Firms that treat AI Review as a black box don't get value — my job is to make it a tuning discipline they own.`,
      },
      {
        q: "How do you balance customer enablement with execution?",
        a: `Enablement isn't a phase — I weave it through the engagement. Kickoff includes a platform tour, Configure & Integrate pairs the CCO's team with the Solution Consultant on the pilot workflow, Test & Train is when I run the AI Review workshop and reviewer knowledge checks, and Adoption & Handover includes office hours so reviewers and marketing ops can ask questions on real work. By go-live the customer is operating Red Oak with me looking over their shoulder — not the other way around.`,
      },
      {
        q: "How do you hand a firm over to the CSM cleanly?",
        a: `I document stakeholder roles (CCO, COO, Chief Marketing Compliance Officer, Marketing Ops lead, IT contact, InfoSec, archival vendor SPOC), summarize the program — what shipped, what's in the Phase 2 backlog, known risks, adoption metrics, AI Review tuning history, integration health, cycle-time trend — and run a joint warm-handover call with the CSM and executive sponsor. The CSM should walk into week one already knowing the politics, open commitments, and expansion hooks (Social Media Compliance, Internet Supervision, Distribution & Engagement). This is how Red Oak protects its 84 NPS and lands module expansions.`,
      },
      {
        q: "How do you advocate customer feedback to Product?",
        a: `I log feature requests against the use case that generated them — not "firm wants X" but "US mid-market RIA doing quarterly performance-report reviews is blocked by Z." I bring patterns (not one-offs) to Red Oak's product team via the standard PM intake and to the AE for roadmap conversations. On a previous implementation I championed a specific enhancement — the customer's use case became a shipped feature in the next release. I treat product advocacy as a weekly habit because it's what turns me from a task-tracker into a trusted partner.`,
      },
    ],
  },
  {
    title: "About You & Role Fit",
    icon: Briefcase,
    color: "text-primary",
    intro: "Foundational questions about background and why Red Oak.",
    qas: [
      {
        q: "Walk me through your background and why Red Oak.",
        a: `I'm a senior software implementation consultant with experience leading enterprise SaaS rollouts in regulated environments. I'm drawn to Red Oak because of the platform depth (Advertising Review, AI Review, Disclosure and Registration Management, Supervision, Distribution & Engagement) and because your customers — over 1,800 firms, more than half of the top 20 asset managers, plus broker-dealers and RIAs like LEO Wealth, Raymond James, Cambridge, Franklin Templeton — are exactly the accounts where a disciplined implementation consultant makes the difference between a stalled compliance rollout and a clean, adopted go-live. I want to bring rigorous delivery and clear executive communication to Red Oak's Onboarding team.`,
      },
      {
        q: "What does a Senior Implementation Consultant actually own at a platform like Red Oak?",
        a: `Three things. First, the plan — scope, timeline, RACI, risk, change orders, status. Second, cross-functional orchestration — pulling in the Solution Consultant, CSM, AE, and the firm's CCO, Compliance Ops, Marketing Ops, IT, InfoSec, and archival vendor at the right moments. Third, the outcome — Time to First Review, Time to First Approved Piece, on-time go-live, first-pass approval rate, AI Review acceptance, and customer CSAT. The Solution Consultant owns technical design; I own whether the launch happens on time and the firm actually adopts it.`,
      },
      {
        q: "Tell me about a successful implementation you've led.",
        a: `(STAR.) Situation: a mid-sized RIA with 2,400 advisors moving off an email + SharePoint advertising-review workflow in 14 weeks tied to a Q4 marketing campaign launch. Task: own end-to-end delivery — review workflow configuration, disclosure library, Marketo + Seismic integration, Smarsh WORM archival, reviewer training, and cutover. Action: phased plan in Smartsheet, weekly CCO-level status, parallel review of one campaign for two weeks before cutover, Solution Consultant paired with the firm's Chief Marketing Compliance Officer on AI Review tuning. Result: launched 4 days early, first-cycle AI Review acceptance at 78%, review cycle time down from 6.2 days to 1.8 days, CSAT 4.9, expansion to Social Media Compliance booked within 90 days.`,
      },
      {
        q: "Why financial services compliance?",
        a: `Because it's the sweet spot for Red Oak. Broker-dealers, RIAs, asset managers, and insurers face constantly-shifting SEC, FINRA, and state regulations, aggressive marketing pipelines, and existential brand and financial risk if a piece goes out non-compliant. It's a domain that rewards a consultant who can talk to a CCO about SEC Rule 17a-4 and to a marketing ops lead about campaign velocity in the same conversation. That's the work I want to be doing.`,
      },
    ],
  },
  {
    title: "Red Oak Platform & Compliance Domain",
    icon: Sparkles,
    color: "text-accent-foreground",
    intro: "Red Oak will test whether you understand the review workflow, disclosure/registration management, supervision, integrations, and AI Review.",
    qas: [
      {
        q: "Walk me through configuring the advertising review workflow in Red Oak.",
        a: `I sequence it deliberately: (1) content types (fact sheets, pitch books, quarterly performance reports, social posts, emails, videos, websites) — the taxonomy everything else attaches to; (2) reviewer roles and routing rules (compliance reviewer, principal reviewer, SME, escalation) and permission model; (3) rules engine — required disclosures by content type + audience + jurisdiction, prohibited terms, performance-claim validation; (4) SLA and escalation policies; (5) integration inbound (Marketo/Seismic/Adobe AEM) and outbound (approved-content library + WORM archival); (6) AI Review confidence thresholds by content type. I sign each layer off with the CCO before moving forward — retrofitting the review workflow after go-live is painful.`,
      },
      {
        q: "How do you handle a Smarsh or Global Relay integration for WORM archival?",
        a: `Smarsh and Global Relay are the customer's system of record for SEC Rule 17a-4 and 17a-3 books-and-records compliance. Red Oak feeds every reviewed piece, every version, every annotation, and every approval decision into the archive on a defined SLA. I lock the payload spec, retention policy (typically 3-7 years plus supervision holds), and legal-hold flow with the customer's InfoSec and legal team before configuration. I always insist on a reconciliation run — sample 100 reviewed pieces, confirm every one lands in the archive with the correct metadata and immutability flag — before flipping to production.`,
      },
      {
        q: "How do you migrate a firm off an email + SharePoint review workflow into Red Oak?",
        a: `Standard pattern: audit every open piece in flight and freeze new intake for 48 hours, rebuild the disclosure library and routing rules in Red Oak rather than copying legacy quirks, migrate 12-24 months of approved-piece history so reviewers keep prior-year context and books-and-records continuity, then parallel-run one campaign in both systems before cutover. I push back on 1:1 lift-and-shift — it carries legacy dysfunction forward. If the customer insists, I issue a change order and document the trade-offs in the risk register.`,
      },
      {
        q: "What is Red Oak's AI Review and how do you introduce it to a skeptical compliance reviewer?",
        a: `AI Review uses LLMs plus Red Oak's compliance-specific prompt engineering to pre-screen content — flagging missing disclosures, unsupported performance claims, prohibited language, and rule violations. Skeptical reviewers worry about losing judgment, missing risks, or being blamed for AI mistakes. My approach: (1) pilot on one content type (say, fact sheets) for two cycles with conservative confidence thresholds; (2) measure suggestion acceptance rate and false-positive/negative rates visibly; (3) let reviewers override freely and use overrides to tune the rules; (4) share stories from other Red Oak customers where cycle time dropped 60% while first-pass approval improved. Trust is built by giving reviewers the veto and showing AI Review learning from them.`,
      },
      {
        q: "How do you configure Disclosure Management and Registration Management together?",
        a: `Disclosure Management centralizes required regulatory disclosures — versioned, tagged by jurisdiction, product, and audience, and auto-applied by the review workflow. Registration Management (via FINRA CRD/IARD integration) tracks rep licenses, jurisdictions, U4/U5 filings, and CE deadlines. The two connect at the rep + jurisdiction level: an ad going to accredited investors in Texas needs Texas-approved disclosures AND a rep who's registered in Texas. I configure the joint validation rule in Red Oak so the review workflow blocks non-compliant combinations at intake — not at approval — which saves enormous cycle time.`,
      },
      {
        q: "How do you connect Red Oak to Power BI or the firm's data warehouse?",
        a: `Scheduled export of review metadata (cycle time, first-pass approval, AI acceptance, deficiency categories, reviewer load, rep-level activity) into the firm's warehouse (Snowflake / BigQuery / SQL Server), then a semantic layer (dbt or a Power BI dataset) so the CCO gets a consistent compliance dashboard. I version-control the BI model alongside the Red Oak configuration so changes are auditable. If the firm doesn't have an analytics team, I recommend Red Oak's Distribution & Engagement analytics for the first 6 months.`,
      },
    ],
  },
  {
    title: "Delivery & Implementation Craft",
    icon: Users,
    color: "text-blue-500",
    intro: "Process, planning, status, RACI, change orders, and SOW management.",
    qas: [
      {
        q: "How do you run weekly status with a firm?",
        a: `Three-part structure: (1) RAG by workstream (Compliance Program / Rules Engine / Integrations / Archival / Reviewer Enablement) with a one-line "why"; (2) milestones hit this week / next week and any slips; (3) risks, decisions needed, and asks of the firm. I send a written exec summary 24 hours before the call so the meeting is decisions-only. Plan lives in Smartsheet; a Power BI dashboard the CCO trusts sits on top.`,
      },
      {
        q: "Describe a project that went off the rails and how you recovered.",
        a: `STAR. Situation: a Smarsh archival integration was 4 weeks behind because the customer's InfoSec team blocked the API keys pending a full SOC 2 re-review. Task: protect a Q4 marketing launch. Action: I escalated to the customer's CISO with two options (slip 3 weeks vs. use Red Oak's pre-approved SOC 2 pack + shorten review to 2 weeks). They picked path 2. I issued the change order in 48 hours, re-baselined the plan, and re-set executive expectations. Result: launched 5 days late instead of 4 weeks late; the trust built by surfacing options early led to expansion into Social Media Compliance next quarter.`,
      },
      {
        q: "How do you manage scope creep / change orders?",
        a: `Three rules: (1) every request gets logged in a change log, even tiny ones; (2) anything outside the signed order form gets a formal change order with effort, dollars, and timeline impact within 5 business days; (3) I never start work on out-of-scope items without a countersigned CO. This protects margin and the customer relationship — surprises later are worse than friction now.`,
      },
      {
        q: "How do you build a RACI on a Red Oak implementation?",
        a: `Rows: Discovery, Compliance program model, Rules engine, Disclosure library, Registration/FINRA integration, Marketing system integration, Archival integration, Historical migration, UAT, Reviewer training, Marketing team briefing, Go-Live, Hypercare. Columns: Red Oak SIC, Solution Consultant, CSM, AE; Customer CCO, Compliance Ops lead, Marketing Ops lead, IT, InfoSec, Archival vendor SPOC, Executive sponsor. Every cell gets one R and one A. Reviewed weekly. It's the single best prevention for "I thought you had it" failures.`,
      },
      {
        q: "How do you keep utilization high while doing excellent customer work?",
        a: `3-tier model: (1) deep work on 2–3 active implementations; (2) office hours on 1–2 hypercare firms; (3) admin / templates / continuous improvement to fill gaps. I time-block the calendar so utilization sits consistently in the 80–85% range, and I flag bench time to my Delivery Lead before it shows up on the report.`,
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
        q: "How would you handle a CCO who's lost confidence?",
        a: `Listen first — 1:1, no slides, one open question: "What specifically has changed for you?" Validate, mirror the concerns back, then come back inside 48 hours with a concrete recovery plan — new critical path, named owners, dates, and what I need from them. Over-communicate for the next two weeks: daily summary email, visible burn-down. Confidence is rebuilt through delivery, not slides.`,
      },
      {
        q: "How do you escalate without burning the relationship?",
        a: `"No surprises" principle. Escalate early and quietly — first to the customer's executive sponsor with a clear "here's what I need to keep us on track," then to my Red Oak Delivery Lead if blocked. I always present 2–3 options, never just the problem. The relationship survives because I bring solutions, not panic.`,
      },
      {
        q: "A firm's Compliance Ops lead consistently misses deadlines. What do you do?",
        a: `(1) Privately re-baseline expectations — confirm they have bandwidth and authority. (2) If it continues, escalate to the CCO with the impact ("Their delays put Q4 marketing launch at risk by 3 weeks") and propose options — add resources, defer scope, or re-sequence. (3) Document in the risk register. Not about blame — it's about protecting the launch.`,
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
        a: `Smartsheet, MS Project, Asana, Monday, and Jira. For customer implementations I prefer Smartsheet because customers co-edit and executives love the dashboards. I use Jira for in-sprint engineering work, Confluence/SharePoint for documentation, and Teams / Slack Connect channels for day-to-day comms. Tool matters less than discipline: single source of truth, weekly updates, dashboard the customer trusts.`,
      },
      {
        q: "How comfortable are you coordinating API or file-based integrations?",
        a: `Very. I don't write code, but I scope, sequence, and broker decisions. I know what to ask — auth method, payload, frequency, error handling, retry logic, who watches the queue when a Smarsh feed fails at 2am, whether the WORM flag is set on every payload. I treat each integration as a mini-project with a spec, test plan, sign-off, and named owners on both sides. I lean on the Solution Consultant for technical depth but keep schedule and risk in my lane.`,
      },
      {
        q: "How do you stay current on Red Oak's product releases?",
        a: `Subscribe to release notes day one, attend every enablement session, join product office hours. I'd build a "what's new in Red Oak" segment into weekly status calls — customers love hearing about new capabilities, and it positions me as a trusted advisor. New features are natural change-order and CSM expansion hooks (e.g., AI Review upgrades, Distribution & Engagement additions).`,
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
        a: `On a previous launch my Delivery Lead wanted to ship with a known gap in the archival feed metadata to hit go-live. I disagreed because the customer was staking books-and-records compliance under SEC Rule 17a-4 on that feed, and gaps would be an audit finding on day one. I escalated with data — projected exposure, regulator risk, and a 5-day fix plan. We delayed 4 days, fixed it, launched clean. Escalation with data and options is leadership, not insubordination.`,
      },
      {
        q: "How do you juggle 3–5 concurrent implementations?",
        a: `Calendar discipline. Every customer gets a fixed weekly cadence (status call, internal team standup, executive checkpoint). I batch admin (status decks, change orders) into 2–3 daily blocks. P1 issues get pulled out of the schedule immediately, but the system absorbs them because everything else is on rails. The rule: every customer should feel like they're my only customer during their hour.`,
      },
      {
        q: "What's your biggest weakness?",
        a: `Earlier in my career I over-committed because I wanted to be the "yes" consultant. It hurt margin and burned out my team. I've fixed it by treating "no, here's the change order" or "yes, but here's the trade-off" as the right answer. Now I track my own commitments weekly and check them against capacity before saying yes.`,
      },
      {
        q: "Why should we hire you over another candidate?",
        a: `Three reasons: (1) domain fit — I speak review workflows, rules engines, disclosure libraries, FINRA, archival, and AI-assisted review, so I'm productive in week one; (2) discipline — I run a clean RACI, weekly status, and change-order process that protects margin and CSAT; (3) executive presence — I can sit in front of a CCO or COO and turn a tough status into a constructive conversation. Low-risk hire who can carry a full book of firms inside 60 days.`,
      },
      {
        q: "What questions do you have for us?",
        a: `Good ones to ask back: (1) What does the average book of firms look like for a Senior Implementation Consultant here — count, ARR, module mix? (2) How does Red Oak measure implementation success — Time to First Review, AI Review acceptance, first-pass approval, CSAT, on-time launch? (3) How does the Implementation Consultant partner with the Solution Consultant, CSM, and AE day-to-day? (4) What's the biggest implementation challenge the Onboarding team is solving for in 2026 — Big 4 asset-manager rollouts, AI Review adoption, migrations from legacy tools, Distribution & Engagement expansion? (5) What does a successful first 90 days look like in this role?`,
      },
    ],
  },
];

type StarScenario = {
  title: string;
  prompt: string;
  tags: string[];
  situation: string;
  task: string;
  action: string[];
  result: string[];
  soundbite: string;
};

const starScenarios: StarScenario[] = [
  {
    title: "Migrating a Broker-Dealer off Email + SharePoint Advertising Review",
    prompt: "Tell me about a time you led a high-stakes platform migration under a hard deadline.",
    tags: ["Migration", "Advertising Review", "Smarsh", "Hard deadline"],
    situation:
      "A mid-sized independent broker-dealer with 2,400 reps was running advertising review over email + SharePoint. The CCO had committed the board to a Q4 retail-marketing campaign, and the SEC exam cycle was 90 days out. Cycle times were 6+ days, first-pass approval was under 40%, and there was no defensible audit trail into their Smarsh archive.",
    task:
      "Own the 14-week Red Oak implementation end-to-end: review workflow, disclosure library, Marketo + Seismic integration, Smarsh WORM archival, historical migration, reviewer enablement, and cutover — with go-live locked before the Q4 campaign and no SEC-exam disruption.",
    action: [
      "Locked the smallest valuable launch in kickoff — retail marketing channel only, with Social and Advisor-generated content deferred to Phase 2 in the change log.",
      "Ran three parallel workstreams from week 1: compliance program config (with the CCO), Smarsh + Marketo integrations (with the Solution Consultant + IT), and 18 months of prior-approval history migration.",
      "Escalated the InfoSec SOC 2 review to the CISO in week 3 with two options — 3-week slip vs. Red Oak's pre-approved SOC 2 pack — and got a decision inside 48 hours.",
      "Turned AI Review on the pilot fact-sheet workflow at conservative thresholds in week 8 so reviewers saw acceptance data before UAT sign-off.",
      "Ran a two-week parallel review of one live campaign in both systems before cutover, plus a 100-piece Smarsh reconciliation to prove the WORM feed.",
    ],
    result: [
      "Launched 4 days ahead of the Q4 campaign date.",
      "Review cycle time dropped from 6.2 days → 1.8 days inside 60 days of go-live.",
      "AI Review suggestion acceptance hit 78% in the first cycle, 84% by day 90.",
      "First-pass approval climbed from 38% → 71%.",
      "Zero findings on the subsequent SEC exam for the advertising-review book of record.",
      "CSAT 4.9/5, and the firm expanded into Social Media Compliance within 90 days of handover.",
    ],
    soundbite:
      "The unlock wasn't the tool — it was refusing to lift-and-shift the legacy dysfunction and forcing the CCO to sign off on a rebuilt disclosure taxonomy in week 2.",
  },
  {
    title: "Recovering a Stalled Smarsh Archival Integration",
    prompt: "Tell me about a project that went off the rails and how you recovered it.",
    tags: ["Recovery", "InfoSec", "17a-4", "Escalation"],
    situation:
      "Eight weeks into a Red Oak rollout at a hybrid RIA/BD, the Smarsh archival integration was 4 weeks behind. The customer's InfoSec team had blocked the API keys pending a full SOC 2 re-review, and the CCO was quietly telling the AE they were considering pausing the project. A Q4 marketing launch and books-and-records defensibility under SEC Rule 17a-4 both depended on that feed.",
    task:
      "Protect the Q4 date, restore CCO confidence, and get the WORM archival flow production-ready without cutting a compliance corner.",
    action: [
      "Called a same-day 1:1 with the CCO — no slides, one open question: 'What has actually changed for you?' — and mirrored the concerns back in writing within 24 hours.",
      "Escalated to the customer's CISO with two costed options: 3-week slip on full re-review, or accept Red Oak's pre-approved SOC 2 attestation pack and shorten the internal review to 2 weeks. Named owners and dates on both.",
      "Issued the change order within 48 hours of the CISO's decision, re-baselined the plan in Smartsheet, and re-set executive expectations on the next status call.",
      "Instituted a daily 15-minute integration standup with Red Oak's Solution Consultant, the Smarsh SPOC, and the customer's IT lead until the feed was green.",
      "Ran a 100-piece reconciliation sample end-to-end before flipping to production so the CCO could sign off with evidence, not a promise.",
    ],
    result: [
      "Launched 5 days late instead of 4 weeks late — inside the Q4 campaign window.",
      "Zero gaps on the WORM feed at go-live; every reviewed piece landed with correct metadata and immutability flag.",
      "CCO NPS moved from a detractor to a promoter in the post-launch survey.",
      "Trust rebuilt through delivery led directly to a Social Media Compliance module expansion the next quarter.",
    ],
    soundbite:
      "Escalation with data and two options isn't panic — it's leadership. The relationship survived because I brought the CISO a decision, not a problem.",
  },
  {
    title: "Landing AI Review with a Skeptical Compliance Team",
    prompt: "Tell me about a time you drove adoption of a new capability against internal resistance.",
    tags: ["AI Review", "Adoption", "Change management"],
    situation:
      "A top-20 asset manager had bought Red Oak with AI Review included, but the Chief Marketing Compliance Officer and her four senior reviewers were openly skeptical — worried about losing judgment, missing risks, and personal accountability for AI mistakes. Two months post-config, AI Review was switched off and the ROI case for the exec sponsor was slipping.",
    task:
      "Get AI Review live on at least one high-volume content type, hit measurable suggestion acceptance, and give the CMCO a defensible tuning story to tell her board — without steamrolling the reviewer team.",
    action: [
      "Ran a 90-minute Decisioning workshop with the CMCO and reviewers — reframed AI Review as 'a first-pass reviewer that you tune and veto,' not a replacement.",
      "Piloted on fact sheets only, at conservative confidence thresholds, for two review cycles. Explicitly told reviewers to override freely and logged every override.",
      "Built a weekly tuning ritual: suggestion acceptance rate, false-positive categories, and the top 5 override reasons were reviewed with the CMCO every Friday for six weeks.",
      "Shared anonymized benchmarks from two comparable Red Oak firms so the reviewers saw the destination, not just the process.",
      "Turned the reviewer team into co-authors of the rule tuning — every override became a proposed rule refinement they approved.",
    ],
    result: [
      "AI Review acceptance climbed from 41% (week 1) → 79% (week 8) on fact sheets.",
      "Cycle time on fact sheets dropped 62%; first-pass approval up 18 points.",
      "Expanded from fact sheets to pitch books and quarterly performance reports by month 4.",
      "The CMCO presented the tuning discipline as a case study at Red Oak's customer summit.",
      "The reviewer team went from AI-skeptics to internal champions — one of them is now the customer's SPOC on Phase 2.",
    ],
    soundbite:
      "Reviewers don't trust AI because it's smart — they trust it because they get to veto it and watch it learn from them. My job is to make that loop visible weekly.",
  },
  {
    title: "Configuring FINRA CRD/IARD + Disclosure Management Jointly",
    prompt: "Walk me through a complex configuration decision you brokered across compliance and marketing.",
    tags: ["Disclosure", "Registration", "FINRA", "Cross-functional"],
    situation:
      "A national wirehouse-adjacent BD wanted to run multi-state retail campaigns but was routinely shipping ads into states where the sponsoring rep wasn't registered — a repeat FINRA finding. Marketing blamed compliance for slow reviews; compliance blamed marketing for sloppy intake; the CCO wanted the problem gone in this implementation.",
    task:
      "Configure Red Oak so that jurisdictional non-compliance was blocked at intake, not caught at approval — without adding friction that would make marketing route around the tool.",
    action: [
      "Ran a joint working session with the CCO, Head of Marketing, and IT to map the required data: rep, jurisdiction, product, audience, and disclosure set.",
      "Configured Disclosure Management with jurisdiction-tagged, versioned disclosure libraries owned by the compliance team.",
      "Wired the FINRA CRD/IARD integration through Registration Management so rep licensure and CE status were current in Red Oak nightly.",
      "Built a joint validation rule: at intake, Red Oak checks (rep × jurisdiction × product) against Registration Management and auto-applies the correct disclosure set from Disclosure Management — non-compliant combinations are rejected before hitting a reviewer.",
      "Wrote the enablement doc for marketing ops so intake failures came back with a clear, self-serve remediation path — not a compliance ticket.",
    ],
    result: [
      "Jurisdictional deficiencies at approval dropped from 14% of pieces to under 1%.",
      "Reviewer cycle time on multi-state campaigns dropped 34% because non-compliant intake was filtered upstream.",
      "The next FINRA exam closed with no jurisdictional-registration findings on the advertising book.",
      "Marketing's satisfaction score with compliance rose materially — the CCO cited it in her board update.",
    ],
    soundbite:
      "The win was moving the compliance check from approval back to intake. Same rule, radically different customer experience.",
  },
  {
    title: "Championing a Customer Use Case into Red Oak's Product Roadmap",
    prompt: "Tell me about a time you advocated for customer feedback with product or engineering.",
    tags: ["Product advocacy", "Voice of customer"],
    situation:
      "Three of my implementations — an RIA, a BD, and an asset manager — independently flagged the same gap: quarterly performance-report reviews required reviewers to manually cross-check performance claims against a source-of-truth dataset, adding 2–3 days per piece. It wasn't in the roadmap.",
    task:
      "Turn a pattern of one-off customer complaints into a fundable product decision — without becoming the AE who cries wolf on every feature request.",
    action: [
      "Logged each request against the specific customer use case, not as generic feedback: 'US mid-market RIA doing quarterly performance-report reviews is blocked by X.'",
      "Wrote a one-page brief showing the pattern across three customers with the cycle-time impact, revenue-at-risk if any of them didn't renew, and the CSAT signal.",
      "Took it to the Red Oak PM through the standard product intake and to the AEs on those three accounts so it hit the roadmap conversation from two directions.",
      "Volunteered my three customers as design partners once it was scoped, and ran the beta validation sessions myself.",
    ],
    result: [
      "The capability shipped in the next major release cycle as a native AI Review check on performance claims.",
      "Cycle time on quarterly performance-report reviews dropped ~40% at the three design-partner firms.",
      "All three renewed and two expanded module coverage — the PM cited the brief as the template for future customer-led feature intake.",
    ],
    soundbite:
      "Product doesn't act on complaints — it acts on patterns with dollars attached. My job is to convert three angry emails into one fundable decision.",
  },
  {
    title: "Clean CSM Handover on a Complex Wirehouse Rollout",
    prompt: "Tell me about a time you set a customer up for success beyond your own engagement.",
    tags: ["CSM transition", "Adoption", "Handover"],
    situation:
      "Wrapping a 22-week Red Oak rollout at a large asset manager with multiple regional compliance teams, three archival vendors, and an unresolved Phase 2 backlog. The CSM was new to the account and the CCO had been burned by prior vendors dropping the ball at handover.",
    task:
      "Deliver a warm CSM handover that protected NPS, surfaced expansion hooks, and made sure the CSM walked into week one already knowing the politics and open commitments.",
    action: [
      "Built a written handover pack: stakeholder map (CCO, COO, Chief Marketing Compliance Officer, Marketing Ops lead, IT, InfoSec, three archival SPOCs), what shipped, Phase 2 backlog, open risks, adoption metrics, AI Review tuning history, integration health, and cycle-time trend.",
      "Ran a joint warm-handover call with the CSM, AE, and executive sponsor — I introduced the CSM, walked the pack, and explicitly transferred the relationship in front of the sponsor.",
      "Scheduled two 30-minute shadow calls in the following two weeks so the CSM could observe office hours before running them solo.",
      "Flagged two expansion hooks (Social Media Compliance and Distribution & Engagement) with the AE, pre-qualified against the customer's Phase 2 backlog.",
    ],
    result: [
      "CSM was operating the account solo by week 3 post-handover with no re-escalations to me.",
      "Post-handover CSAT held at 4.8/5; the CCO cited the handover explicitly as the best she'd experienced from a SaaS vendor.",
      "One of the two expansion hooks closed inside 60 days.",
      "The handover pack was adopted as the Onboarding team's template.",
    ],
    soundbite:
      "A clean handover is how Red Oak protects its 84 NPS and lands module expansions — it's not the last mile, it's the first mile of the next contract.",
  },
];


export default function InterviewPrep() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-semibold">Interview Prep — Red Oak Senior Implementation Consultant</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Common interview questions and ready-to-use answers tailored to the Red Oak Senior Implementation Consultant role — advertising review, AI Review, disclosure and registration management, FINRA and archival integrations, and adoption.
          </p>
        </motion.div>

        <Card className="border-accent/40 bg-accent/5">
          <CardContent className="p-5 space-y-2">
            <p className="text-sm font-semibold">How to use this page</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Each section maps to a likely interview block: fit, platform/domain, delivery craft, stakeholders, tools, and behavioral.</li>
              <li>Answers use the STAR framework where relevant (Situation, Task, Action, Result).</li>
              <li>Personalize the metrics and firm names with your own examples before the interview.</li>
              <li>Don't memorize — internalize the structure so you sound natural.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-primary/40">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Trophy className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">STAR Scenarios — Red Oak Senior Implementation Consultant</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Full Situation / Task / Action / Result stories built for the Red Oak domain — advertising review, AI Review, disclosure &amp; registration, FINRA, Smarsh archival, CSM handover, and product advocacy. Swap the metrics for your own numbers before the interview.
                </p>
              </div>
              <Badge variant="secondary" className="ml-auto text-[10px]">
                {starScenarios.length} scenarios
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="space-y-2">
              {starScenarios.map((s, i) => (
                <AccordionItem key={i} value={`star-${i}`} className="border rounded-lg px-3">
                  <AccordionTrigger className="hover:no-underline text-sm font-medium text-left py-3">
                    <div className="flex flex-col gap-1 pr-3">
                      <span>{s.title}</span>
                      <span className="text-xs text-muted-foreground font-normal italic">"{s.prompt}"</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {s.tags.map((t) => (
                        <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-lg border p-3 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <Target className="h-3.5 w-3.5 text-primary" /> Situation
                        </div>
                        <p className="text-sm leading-relaxed">{s.situation}</p>
                      </div>
                      <div className="rounded-lg border p-3 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <ListChecks className="h-3.5 w-3.5 text-primary" /> Task
                        </div>
                        <p className="text-sm leading-relaxed">{s.task}</p>
                      </div>
                    </div>

                    <div className="rounded-lg border p-3 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <Zap className="h-3.5 w-3.5 text-primary" /> Action
                      </div>
                      <ul className="text-sm leading-relaxed space-y-1.5 list-disc list-inside marker:text-primary/60">
                        {s.action.map((a, idx) => <li key={idx}>{a}</li>)}
                      </ul>
                    </div>

                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                        <Trophy className="h-3.5 w-3.5" /> Result
                      </div>
                      <ul className="text-sm leading-relaxed space-y-1.5 list-disc list-inside marker:text-primary">
                        {s.result.map((r, idx) => <li key={idx}>{r}</li>)}
                      </ul>
                    </div>

                    <div className="text-sm italic text-muted-foreground border-l-2 border-primary/40 pl-3">
                      Soundbite: {s.soundbite}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
            <p>End strong: "I'm genuinely excited about this role. The mix of financial-services compliance depth, customer-facing delivery, and the chance to implement Red Oak at firms like the ones in your portfolio is exactly the work I want to do. What are the next steps, and is there anything you'd like me to clarify or expand on before we wrap?"</p>
            <p>Then follow up within 24 hours with a personalized thank-you email referencing one specific thing the interviewer said.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
