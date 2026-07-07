import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Briefcase, Users, Shield, Sparkles, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

type QA = { q: string; a: string };

const sections: { title: string; icon: React.ElementType; color: string; intro: string; qas: QA[] }[] = [
  {
    title: "JD-Specific: Dayshape & The Senior Implementation Consultant Mission",
    icon: Sparkles,
    color: "text-primary",
    intro: "Questions drawn directly from a Dayshape Senior Software Implementation Consultant lens — professional services firms, resource management, AI Auto-Scheduler, integrations, and Time-to-Value.",
    qas: [
      {
        q: "How do you describe the Dayshape Senior Implementation Consultant role in your own words?",
        a: `It's end-to-end ownership of Dayshape implementations at large accounting and professional services firms — from sales handoff through firm-wide go-live and adoption. I lead configuration, integrations (HRIS, practice management, calendar, finance), data migration from legacy tools like Retain / ProStaff / spreadsheets, and Resource Manager and partner enablement. I sit alongside a Solution Consultant on the technical depth and orchestrate with CSMs, AEs, the firm's COO, Head of Resource Management, IT, and partner sponsors. My job is to shorten Time to First Schedule and Time to First Forecast, drive utilization uplift and forecast accuracy, and hand the firm over to Customer Success on time and at quality.`,
      },
      {
        q: "What's the difference between the Implementation Consultant and the Solution Consultant?",
        a: `The Solution Consultant owns technical depth — API-level integration design, data model choices, edge-case configuration, and platform architecture. I own the program: scope, plan, RACI, status, risk, change orders, stakeholder alignment, and CSAT. In practice I lean in on things like sequencing the Workday sync, brokering practice-management mapping decisions, running UAT, and coaching Resource Managers on the AI Auto-Scheduler. I escalate deep platform calls to the Solution Consultant. The pairing is the unit of delivery — neither of us succeeds alone.`,
      },
      {
        q: "How do you drive fast Time-to-Value on a Dayshape implementation?",
        a: `Four moves. (1) In handoff and kickoff I lock the smallest valuable launch — usually one pilot service line (often audit) with a foundational engagement template and a single office — and protect it from scope creep. (2) I parallelize firm-model configuration, HRIS + practice-management integration, and historical migration from week one instead of running them serially. (3) I set Time to First Schedule and Time to First Forecast as headline KPIs and report against them weekly. (4) I introduce the AI Auto-Scheduler on the pilot service line early with conservative weightings so Resource Managers see acceptance rates climb inside the engagement, not six months later.`,
      },
      {
        q: "How do you handle the firm's IT team or a third-party integrator during implementation?",
        a: `I treat them as a named stakeholder in the RACI from day one — IT lead and any integration partner get the same status emails, same Smartsheet access, and same Teams channel as the firm. I clarify in writing who owns what: typically IT owns identity and network access, the integration partner owns HRIS/practice-management endpoints, my Solution Consultant owns Dayshape configuration, and the firm owns data quality sign-off. I escalate misalignment to the executive sponsor early — the firm signed the SOW with Dayshape, so accountability sits with them.`,
      },
      {
        q: "What's the AI Auto-Scheduler and why does it matter for a Senior Implementation Consultant?",
        a: `It's Dayshape's decisioning engine that matches staff to engagements at scale — balancing utilization, skill match, staff development, and partner preferences. From a consultant lens it matters because it's where firms extract real ROI: instead of a Resource Manager placing thousands of bookings by hand, they review AI-generated schedules and adjust. I run a technical enablement workshop during Test & Train and again pre-Hypercare so Resource Managers understand how to tune weightings, when to override, and how to measure acceptance rate. Firms that treat Auto-Scheduler as a set-and-forget feature don't get the value — my job is to make sure they treat it as an ongoing tuning discipline.`,
      },
      {
        q: "How do you balance customer enablement with execution?",
        a: `Enablement isn't a phase — I weave it through the engagement. Kickoff includes a platform tour, configure/integrate pairs the firm's Head of RM with the Solution Consultant on the pilot service line setup, testing is when I run the AI Auto-Scheduler workshop and Resource Manager knowledge checks, and adoption includes office hours so they can ask "how do I…" questions on real work. By go-live the firm's RM team is already operating Dayshape with me looking over their shoulder, not the other way around.`,
      },
      {
        q: "How do you hand a firm over to the CSM cleanly?",
        a: `I document stakeholder roles and hierarchy in a detailed account record (Managing Partner, COO, Head of RM, Service Line Champions, IT contact), summarize the program — what shipped, what's in the Phase 2 backlog, known risks, adoption metrics, Auto-Scheduler tuning history, integration health — and run a joint warm-handover call with the CSM and executive sponsor. The CSM should walk into week one already knowing the politics, open commitments, and expansion hooks (additional service lines, deeper forecasting, advanced reporting). This is how Dayshape protects net retention and lands firm-wide expansions.`,
      },
      {
        q: "How do you advocate customer feedback to Product?",
        a: `I log feature requests against the use case that generated them — not "firm wants X" but "US mid-market audit firm trying to do Y is blocked by Z." I bring patterns (not one-offs) to Dayshape's product team via the standard PM intake and to the AE for roadmap conversations. On a previous implementation I championed a specific enhancement — the customer's use case became a shipped feature in the next release. I treat product advocacy as a weekly habit, not a quarterly one, because it's what turns me from a task-tracker into a trusted partner.`,
      },
    ],
  },
  {
    title: "About You & Role Fit",
    icon: Briefcase,
    color: "text-primary",
    intro: "Foundational questions about background and why Dayshape.",
    qas: [
      {
        q: "Walk me through your background and why Dayshape.",
        a: `I'm a senior software implementation consultant with experience leading enterprise SaaS rollouts — most recently in workforce, engagement, and operational platforms. I'm drawn to Dayshape because of the depth of the platform (firm-wide resource management, forecasting, and the AI Auto-Scheduler) and because your customers — Plante Moran, Wolf, Baker Tilly, Azets, BDO, Grant Thornton, PwC, RSM — are the kind of firms where a strong implementation consultant makes the difference between a stalled rollout and a clean, adopted go-live. I want to bring rigorous professional-services delivery discipline and clear executive communication to Dayshape's Onboarding team.`,
      },
      {
        q: "What does a Senior Implementation Consultant actually own at a platform like Dayshape?",
        a: `Three things. First, the plan — scope, timeline, RACI, risk, change orders, status. Second, the cross-functional orchestration — pulling in the Solution Consultant, CSM, AE, and the firm's Resource Management, HR, IT, finance, and partner leaders at the right moments. Third, the outcome — Time to First Schedule, Time to First Forecast, on-time firm-wide go-live, AI Auto-Scheduler acceptance rate, and customer CSAT. The Solution Consultant owns the technical design; I own whether the launch happens on time and the firm actually adopts it.`,
      },
      {
        q: "Tell me about a successful implementation you've led.",
        a: `(Use STAR.) Situation: a mid-market accounting firm with ~1,200 staff moving off spreadsheets in 14 weeks tied to the next busy season. Task: own end-to-end delivery — firm model, Workday HRIS sync, CCH Axcess engagement master, historical migration, Resource Manager training, and go-live. Action: phased plan in Smartsheet, weekly executive status, parallel scheduling for two weeks before cutover, Solution Consultant paired with the firm's Head of RM for Auto-Scheduler tuning. Result: launched 4 days early, first-cycle Auto-Scheduler acceptance at 78%, utilization uplift of 6 points in the first quarter, CSAT 4.9, expansion to a second office booked within 90 days.`,
      },
      {
        q: "Why professional services / why accounting firms?",
        a: `Because they're the sweet spot for Dayshape. Accounting and advisory firms have complex, seasonal demand (busy season, year-end, audit cycles), diverse skills, career-progression pressures, and huge margin sensitivity — which is exactly where AI-powered resource management pays back fastest. It's also a domain that rewards a consultant who can talk to a Managing Partner about margin and to a scheduler about client conflicts in the same conversation. That's the work I want to be doing.`,
      },
    ],
  },
  {
    title: "Dayshape Platform & Resource Management Domain",
    icon: Sparkles,
    color: "text-accent-foreground",
    intro: "Dayshape will test whether you understand the firm model, integrations, engagement templates, forecasting, and the AI Auto-Scheduler.",
    qas: [
      {
        q: "Walk me through configuring the firm model in Dayshape.",
        a: `I sequence it deliberately: (1) offices, service lines, teams, and cost centers first — the org spine everything else attaches to; (2) roles and grades (Partner → Analyst) and permission model; (3) skills library and competencies — technical, industry, language; (4) absence and non-chargeable time categories; (5) staff population loaded from Workday/HRIS with grades and skills mapped; (6) engagement templates by service line with role/grade budgets and booking rules. I sign each layer off with the Head of RM before moving to the next — retrofitting the firm model after go-live is painful.`,
      },
      {
        q: "How do you handle a Workday HRIS integration?",
        a: `I use Workday RaaS (Reports-as-a-Service) for reliable delta pulls rather than trying to build custom API calls, because RaaS is what firms' Workday teams already know. I lock the canonical person ID up front and reconcile joiners/leavers/movers with a target of < 24h propagation. I sync absences bidirectionally to avoid double-booking. And I always insist on a data governance sign-off from HR before flipping to production — because the moment RM decisions are driven by HR data, HR owns the data quality.`,
      },
      {
        q: "How do you migrate a firm off Retain / ProStaff / spreadsheets into Dayshape?",
        a: `Standard pattern: audit every active engagement and open booking, rebuild the role/grade/skill taxonomy in Dayshape rather than copying legacy quirks, load rolling 12–24 months of history so partners keep prior-year context, then parallel-run scheduling for one full weekly cycle before cutover. I always push back on 1:1 lift-and-shift — it carries legacy dysfunction forward. If the firm insists, I issue a change order and document the trade-offs in the risk register.`,
      },
      {
        q: "What's the AI Auto-Scheduler and how do you introduce it to a skeptical Resource Manager?",
        a: `The Auto-Scheduler proposes staffing decisions across engagements balancing utilization, skill match, staff development, and partner preferences. Skeptical RMs are usually worried about losing judgment or getting bad staff placements. My approach: (1) pilot on one service line for two cycles with conservative weightings; (2) measure acceptance rate and show it visibly; (3) let the RM override freely and use their overrides to tune the weightings; (4) share stories from other Dayshape firms where acceptance climbed past 80%. Trust is built by giving them the veto and showing the AI learning from them, not the other way around.`,
      },
      {
        q: "How do you configure a firm's first forecast cycle?",
        a: `I start with the horizon the firm actually needs — usually a 3-month operational forecast for busy season, plus a 12-month capacity forecast for hiring decisions. I use historical actuals from the last 2–3 fiscal periods to seed engagement demand, then layer in confirmed pipeline from the AE / partners. I sign KPI definitions off with the COO before publishing — because "utilization" and "realization" mean subtly different things at every firm, and mismatched definitions destroy trust on day one.`,
      },
      {
        q: "How do you connect Dayshape to Power BI or the firm's data warehouse?",
        a: `Scheduled export of engagements, bookings, utilization, forecasts, and time actuals into the firm's warehouse (Snowflake / BigQuery / SQL Server), then a semantic layer (dbt or a Power BI dataset) so partners get consistent metrics across firm dashboards. I version-control the BI model alongside the Dayshape configuration so changes are auditable. If the firm doesn't have an analytics team, I recommend they either add one before scaling or contract for a Dayshape-hosted reporting pack for the first 6 months.`,
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
        a: `Three-part structure: (1) RAG by workstream (Firm Model / Integrations / Engagements / Scheduling / Training) with a one-line "why"; (2) milestones hit this week / next week and any slips; (3) risks, decisions needed, and asks of the firm. I send a written exec summary 24 hours before the call so the meeting is decisions-only. I keep the plan in Smartsheet and a Power BI dashboard the firm trusts.`,
      },
      {
        q: "Describe a project that went off the rails and how you recovered.",
        a: `STAR. Situation: an HRIS integration was 4 weeks behind because the firm's Workday consultant left. Task: protect a busy-season launch. Action: I escalated to the firm's CIO with two options (slip 3 weeks vs. surge a Dayshape-referred Workday specialist for 2 sprints as a change order). They picked the surge. I issued the change order in 48 hours, re-baselined the plan, and re-set executive expectations. Result: launched 5 days late instead of 4 weeks late, and the trust we built by surfacing options early led to an expansion to a second office the next quarter.`,
      },
      {
        q: "How do you manage scope creep / change orders?",
        a: `Three rules: (1) every request gets logged in a change log, even tiny ones; (2) anything outside the signed order form gets a formal change order with effort, dollars, and timeline impact within 5 business days; (3) I never start work on out-of-scope items without a countersigned CO. This protects margin, utilization targets, and the firm relationship — because surprises later are worse than friction now.`,
      },
      {
        q: "How do you build a RACI on a Dayshape implementation?",
        a: `Rows: Discovery, Firm model, HRIS integration, Practice-management integration, Calendar integration, Finance integration, Historical migration, Engagement template build, UAT, Resource Manager training, Partner briefing, Go-Live, Hypercare. Columns: Dayshape SIC, Solution Consultant, CSM, AE; Firm COO, Head of RM, HR Data Owner, Practice-Mgmt Owner, IT, Partner Sponsor. Every cell gets one R and one A. Reviewed in week 1, updated when people change. It's the single best prevention for "I thought you had it" failures.`,
      },
      {
        q: "How do you keep utilization high while doing excellent customer work?",
        a: `I run a 3-tier model: (1) deep work on 2–3 active implementations; (2) office hours on 1–2 hypercare firms; (3) admin / templates / continuous improvement to fill gaps. I time-block the calendar so utilization sits consistently in the 80–85% range, and I flag bench time to my Delivery Lead before it shows up on the report.`,
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
        q: "How would you handle a Managing Partner who's lost confidence?",
        a: `Listen first — book a 1:1, no slides, one open question: "What specifically has changed for you?" Validate, mirror the concerns back, then come back inside 48 hours with a concrete recovery plan — new critical path, named owners, dates, and what I need from them. Over-communicate for the next two weeks: daily summary email, visible burn-down. Confidence is rebuilt through delivery, not slides.`,
      },
      {
        q: "How do you escalate without burning the relationship?",
        a: `"No surprises" principle. Escalate early and quietly — first to the firm's executive sponsor with a clear "here's what I need to keep us on track," then to my Dayshape Delivery Lead if blocked. I always present 2–3 options, never just the problem. The relationship survives because I bring solutions, not panic.`,
      },
      {
        q: "A firm's Head of RM consistently misses deadlines. What do you do?",
        a: `(1) Privately re-baseline expectations — confirm they have bandwidth and authority. (2) If it continues, escalate to the executive sponsor with the impact ("Their delays put busy-season launch at risk by 3 weeks") and propose options — add resources, defer scope, or re-sequence. (3) Document everything in the risk register. It's not about blame — it's about protecting the launch.`,
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
        a: `Smartsheet, MS Project, Asana, Monday, and Jira. For firm implementations I prefer Smartsheet because customers can co-edit and execs love the dashboards. I use Jira for in-sprint engineering work, Confluence/SharePoint for documentation, and Teams / Slack Connect channels for day-to-day firm comms. Tool matters less than discipline: single source of truth, weekly updates, dashboard the firm trusts.`,
      },
      {
        q: "How comfortable are you coordinating API or file-based integrations?",
        a: `Very. I don't write code, but I scope, sequence, and broker decisions. I know what to ask — auth method, payload, frequency, error handling, retry logic, who watches the queue when a nightly Workday RaaS pull fails at 2am. I treat each integration as a mini-project with a spec, test plan, sign-off, and a named owner on both sides. I lean on the Solution Consultant for technical depth but keep schedule and risk in my lane.`,
      },
      {
        q: "How do you stay current on Dayshape's product releases?",
        a: `I'd subscribe to release notes day one, attend every enablement session, and join product office hours. I'd build a "what's new in Dayshape" segment into weekly status calls — customers love hearing about new capabilities, and it positions me as a trusted advisor. New features are also natural change-order conversations and CSM expansion hooks.`,
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
        a: `On a previous launch my Delivery Lead wanted to ship with a known data-quality issue in the HRIS sync to hit go-live. I disagreed because the firm was staking partner compensation on utilization reports out of Dayshape, and bad data would destroy trust in the platform on day one. I escalated with data — projected error rate, impact on partner reporting, and a 5-day fix plan. We delayed 4 days, fixed it, launched clean. The lesson: escalation with data and options is leadership, not insubordination.`,
      },
      {
        q: "How do you juggle 3–5 concurrent firm implementations?",
        a: `Calendar discipline. Every firm gets a fixed weekly cadence (status call, internal team standup, executive checkpoint). I batch admin work (status decks, change orders) into 2–3 daily blocks. P1 issues get pulled out of the schedule immediately, but my system absorbs them because everything else is on rails. The rule: every firm should feel like they're my only firm during their hour.`,
      },
      {
        q: "What's your biggest weakness?",
        a: `Earlier in my career I over-committed because I wanted to be the "yes" consultant. It hurt margin and burned out my team. I've fixed it by treating "no, here's the change order" or "yes, but here's the trade-off" as the right answer. Now I track my own commitments weekly and check them against capacity before saying yes.`,
      },
      {
        q: "Why should we hire you over another candidate?",
        a: `Three reasons: (1) domain fit — I speak firm models, HRIS integrations, engagement templates, forecasting, and utilization, so I'm productive in week one; (2) discipline — I run a clean RACI, weekly status, and change-order process that protects margin and CSAT; (3) executive presence — I can sit in front of a COO or Managing Partner and turn a tough status into a constructive conversation. Low-risk hire who can carry a full book of firms inside 60 days.`,
      },
      {
        q: "What questions do you have for us?",
        a: `Good ones to ask back: (1) What does the average book of firms look like for a Senior Implementation Consultant here — count, ARR, complexity? (2) How does Dayshape measure implementation success — Time to First Schedule, Auto-Scheduler acceptance rate, CSAT, on-time launch, utilization? (3) How does the Implementation Consultant partner with the Solution Consultant, CSM, and AE day-to-day? (4) What's the biggest implementation challenge the Onboarding team is solving for in 2026 — Big 4 rollouts, Retain migrations, multi-region firms, something else? (5) What does a successful first 90 days look like in this role?`,
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
            <h1 className="text-2xl font-semibold">Interview Prep — Dayshape Senior Implementation Consultant</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Common interview questions and ready-to-use answers tailored to the Dayshape Senior Software Implementation Consultant role — firm model, HRIS + practice management integrations, historical migration, AI Auto-Scheduler, and adoption.
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
            <p>End strong: "I'm genuinely excited about this role. The mix of professional-services depth, customer-facing delivery, and the chance to implement Dayshape at firms like the ones in your portfolio is exactly the work I want to do. What are the next steps, and is there anything you'd like me to clarify or expand on before we wrap?"</p>
            <p>Then follow up within 24 hours with a personalized thank-you email referencing one specific thing the interviewer said.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
