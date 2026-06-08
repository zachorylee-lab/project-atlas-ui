import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Briefcase, Users, Shield, Sparkles, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

type QA = { q: string; a: string };

const sections: { title: string; icon: React.ElementType; color: string; intro: string; qas: QA[] }[] = [
  {
    title: "About You & Role Fit",
    icon: Briefcase,
    color: "text-primary",
    intro: "Foundational questions about background and why Sage HCM.",
    qas: [
      {
        q: "Walk me through your background and why Sage HCM.",
        a: `I'm a project manager with 2+ years leading SaaS implementations — most recently in HCM and payroll. I'm drawn to Sage HCM because of the breadth of the suite (HR, Payroll, Benefits, Talent, Time) and because Sage's customer base sits in the mid-market sweet spot where a strong PM can make the difference between a struggling rollout and a reference client. I want to bring rigorous project delivery and clear executive communication to your Professional Services team.`,
      },
      {
        q: "Why a hybrid role / 3 days onsite in Atlanta or Austin?",
        a: `I'm fully comfortable with the hybrid model. Client-facing PM work benefits from in-person collaboration with implementation managers, configuration specialists, QA and developers — especially during kickoffs, parallel payroll review, and go-live planning. I'd treat onsite days as the time for whiteboarding, war rooms, and stakeholder alignment, and reserve remote days for deep work like project plan upkeep, status reporting, and client async work.`,
      },
      {
        q: "Tell me about a successful implementation you've led.",
        a: `(Use STAR.) At my last role I led a payroll + benefits implementation for a ~1,500 EE client moving off ADP. Situation: aggressive 14-week timeline tied to plan-year start. Task: own end-to-end delivery, coordinate config, QA, integrations, and client SMEs. Action: built a phased plan in Smartsheet, ran weekly status with execs, drove three parallel payrolls, and managed two EDI 834 carriers in parallel. Result: launched on time with $0.00 variance on parallel #3, CSAT 4.8/5, and the client referred two new logos in the next quarter.`,
      },
      {
        q: "What's your PMP / Agile background?",
        a: `I work fluently in both. Implementations are inherently waterfall at the phase level (Handoff → Kickoff → Build → Test → Go-Live → Hypercare) because of dependencies like parallel payroll and carrier cutovers. Within Build and Test I run two-week sprints with config specialists and QA, with a standup, demo, and retro cadence. I'm pursuing PMP and already use PMBOK frameworks for risk, scope, and change management.`,
      },
    ],
  },
  {
    title: "HCM, Payroll & Benefits Domain",
    icon: Sparkles,
    color: "text-accent-foreground",
    intro: "Sage will test that you actually understand HR/Payroll/Benefits/Talent/Time mechanics.",
    qas: [
      {
        q: "Walk me through how you'd run a parallel payroll.",
        a: `Goal: prove Sage HCM matches the legacy system gross-to-net before go-live. Steps: (1) load identical EE master + YTD balances in Sage and legacy; (2) run the same pay period in both; (3) reconcile gross wages by EE, then pre-tax deductions, then post-tax, then employer taxes (FICA/FUTA/SUTA), and finally net pay; (4) my target is < $0.01 variance per EE on parallel #3; (5) document every variance, root-cause, and remediate (often a tax setup or a deduction code mapping issue); (6) gain client Payroll Director sign-off before Go/No-Go.`,
      },
      {
        q: "What's an EDI 834 and what risks come with it?",
        a: `834 is the ANSI standard for benefit enrollment files between an employer/HCM and a carrier (medical, dental, vision, life, etc.). Risks: (a) carrier-specific quirks in plan IDs or tier codes cause silent rejections; (b) full-file vs. change-only files can re-enroll or terminate the wrong members; (c) OE timing — files sent too late cause Jan 1 ID-card delays. Mitigation: test with each carrier ~4 weeks before plan year, reconcile member counts every cycle, and treat each carrier as its own mini-project.`,
      },
      {
        q: "A client wants to go live mid-quarter — what's your reaction?",
        a: `I push back politely and propose a date tied to a pay-period or plan-year boundary. Going live mid-quarter complicates tax filings, GL postings, and YTD balances. If the client insists, I document the additional risk in the project plan, secure executive sign-off acknowledging the trade-offs, and over-resource hypercare for the first close.`,
      },
      {
        q: "How do you handle a client who wants every legacy quirk replicated?",
        a: `I use "show me how it's used today, and let's design how it should work tomorrow." I confirm scope against the SOW, then split requests into (1) standard Sage HCM configuration, (2) acceptable customization within product, (3) change-order territory. If it's #3, I issue a formal change order with effort, cost, and timeline impact rather than absorbing scope creep silently.`,
      },
      {
        q: "Which Sage HCM module is hardest to implement and why?",
        a: `Honestly, Time & Attendance — because it sits between payroll, scheduling, and union/state work rules. A single rounding or shift-differential mistake compounds across thousands of timecards into payroll variances. I always plan for two T&A parallel cycles before cutover, audit pay rules with the client's HR & payroll managers, and validate accrual balances to the second at go-live.`,
      },
    ],
  },
  {
    title: "Project Management Craft",
    icon: Users,
    color: "text-blue-500",
    intro: "Process, planning, status reporting, RACI, change orders, and SOW management.",
    qas: [
      {
        q: "How do you run weekly status with clients?",
        a: `Three-part structure: (1) RAG status by workstream (HR / Payroll / Benefits / Integrations / Test) with a one-line "why"; (2) milestones hit this week / next week and any slips; (3) risks, decisions needed, and asks of the client. I send a written executive summary 24 hours before the call so the meeting is decisions-only. I keep the project plan in Smartsheet or MS Project and a dashboard in our PM tool that I share live.`,
      },
      {
        q: "Describe a project that went off the rails and how you recovered.",
        a: `STAR. Situation: benefits build was 3 weeks behind because the client's broker hadn't finalized rates. Task: protect the OE go-live. Action: I called a steering committee, presented two paths (slip 2 weeks vs. de-scope optional voluntary plans), got an exec decision in 48 hours, re-baselined the plan and communicated the new critical path. Result: launched OE on time with the voluntary plans deferred to a 30-day post-launch micro-project. The escalation actually strengthened the executive relationship because we surfaced the trade-off early instead of slipping silently.`,
      },
      {
        q: "How do you manage scope creep / change orders?",
        a: `Three rules: (1) every request gets logged in a change log, even tiny ones; (2) anything off-SOW gets a formal change order with effort, dollars, and timeline impact within 5 business days; (3) I never start work on out-of-scope items without a countersigned CO. This protects margin, utilization targets, and the client relationship — because surprises later are worse than friction now.`,
      },
      {
        q: "How do you keep utilization high while still doing excellent client work?",
        a: `I run a 3-tier model: (1) deep client work on 2-3 active implementations; (2) "office hours" on 1-2 hypercare clients; (3) admin / templates / continuous improvement work to fill gaps. I time-block in the calendar so utilization shows up consistently in the 80-85% range, and I flag bench time to my director before it shows up on the utilization report.`,
      },
      {
        q: "How do you build a RACI?",
        a: `I list workstreams down the rows (Discovery, HR Config, Payroll Config, Benefits, Carrier Files, GL, SSO, UAT, Go-Live, Hypercare) and stakeholders across the columns (Sage PM, IM, Config, QA, Dev, Client CHRO, Payroll Mgr, Benefits Mgr, IT, Exec Sponsor). Every cell gets exactly one R and one A. I review with the client in week 1 and update whenever roles change. It's the single best document for preventing "I thought you had it" failures.`,
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
        q: "How would you handle a client executive who's lost confidence in the project?",
        a: `Listen first — book a 1:1, no slides, just an open question: "What specifically has changed for you?" Then validate, summarize the concerns back, and within 48 hours come back with a concrete recovery plan (new critical path, names, dates, and what I need from them). Re-establish trust by over-communicating for the next two weeks: daily summary email, named owners, visible burn-down on the agreed actions. Confidence is rebuilt through delivery, not slides.`,
      },
      {
        q: "How do you escalate without burning the relationship?",
        a: `I use the "no surprises" principle. I escalate early and quietly — first to the client project sponsor with a clear "here's what I need to keep us on track," then to my Sage PS Director if blocked. I always present 2-3 options, not just the problem. The relationship survives because I'm bringing them solutions, not dumping risk on them.`,
      },
      {
        q: "A client SME consistently misses deadlines. What do you do?",
        a: `(1) Privately re-baseline expectations — confirm they have the bandwidth and authority. (2) If it continues, escalate to the executive sponsor with the impact ("Their delays put OE go-live at risk by 3 weeks") and propose options — add resources, defer scope, or re-sequence. (3) Document everything in the risk register so when timeline shifts, there's no surprise. It's not about blaming — it's about protecting the project.`,
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
        a: `I've used Smartsheet, MS Project, Asana, Monday, and Jira. For HCM implementations I prefer Smartsheet because clients can co-edit and execs love the dashboards. I use Jira for any in-sprint dev or integration work and a shared Confluence or SharePoint for documentation. The tool matters less than the discipline: a single source of truth, weekly updates, and a dashboard the client and execs trust.`,
      },
      {
        q: "How comfortable are you coordinating API or file-based integrations?",
        a: `Very. I don't write code, but I scope, sequence, and broker decisions. I know what to ask — auth method, payload, frequency, error handling, retry logic, who watches the inbox when a file fails at 2am. I treat each integration as a mini-project with a spec, test plan, sign-off, and a named owner on both sides. I lean on my Implementation Manager and developer for technical decisions but keep the schedule and risk in my lane.`,
      },
      {
        q: "How do you stay current on quarterly Sage HCM releases?",
        a: `I'd subscribe to release notes the day I start, attend every PS enablement session, and join product office hours. I'd also build a "what's new" segment into my client status calls — clients love hearing about new capabilities and it positions me as a trusted advisor, not just a task tracker. New features are also natural change-order conversations.`,
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
        a: `On a previous project my PS Director wanted to ship a known reconciliation bug to hit go-live. I disagreed because the client was a finance buyer who'd catch it on the first close. I escalated respectfully with data — projected ticket volume, CSAT risk, and a 5-day fix plan. We delayed 4 days, fixed it, launched clean. The director thanked me later; the lesson was that escalation done with data and options is leadership, not insubordination.`,
      },
      {
        q: "How do you juggle 3-5 concurrent clients?",
        a: `Calendar discipline. Every client gets a fixed weekly cadence (status call, internal team standup, executive checkpoint). I batch admin work (status decks, change orders) into 2-3 daily blocks. P1 issues get pulled out of the schedule immediately, but my system absorbs them because everything else is on rails. The number-one rule: every client should feel like they're my only client during their hour.`,
      },
      {
        q: "What's your biggest weakness?",
        a: `Earlier in my career I over-committed because I wanted to be the "yes" PM. It hurt me on margins and burned out my team. I've fixed it by treating "no, here's the change order" or "yes, but here's the trade-off" as the right answer. Now I track my own commitments weekly and check them against capacity before I say yes to anything new.`,
      },
      {
        q: "Why should we hire you over another candidate?",
        a: `Three reasons: (1) HCM domain — I already speak the language of pay groups, deduction codes, 834s, and parallel payroll, so I'm productive in week 1; (2) discipline — I run a clean RACI, weekly status, and change-order process that protects margin and CSAT; (3) executive presence — I can sit in front of a CHRO or CFO and turn a tough status into a constructive conversation. I'd be a low-risk hire who can carry a full book of clients within 60 days.`,
      },
      {
        q: "What questions do you have for us?",
        a: `Good ones to ask back: (1) What does the average book of clients look like for a PM here — count, modules, size? (2) How does Sage measure PM success — utilization, CSAT, on-time go-live? (3) How does the PM partner with the Implementation Manager day-to-day? (4) What's the biggest delivery challenge the PS team is trying to solve right now? (5) What does a successful first 90 days look like in this role?`,
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
            <h1 className="text-2xl font-semibold">Interview Prep — Sage HCM Project Manager</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Common interview questions and ready-to-use answers tailored to the Sage HCM Project Manager role across HR, Payroll, Benefits, Talent, and Time & Attendance.
          </p>
        </motion.div>

        <Card className="border-accent/40 bg-accent/5">
          <CardContent className="p-5 space-y-2">
            <p className="text-sm font-semibold">How to use this page</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Each section maps to a likely interview block: fit, domain, PM craft, stakeholders, tools, and behavioral.</li>
              <li>Answers use the STAR framework where relevant (Situation, Task, Action, Result).</li>
              <li>Personalize the metrics and client names with your own examples before the interview.</li>
              <li>Don't memorize — internalize the structure so you sound natural.</li>
            </ul>
          </CardContent>
        </Card>

        {sections.map((section, sIdx) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sIdx * 0.04 }}
            >
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
            <p>
              <strong className="text-foreground">Confirm interest:</strong> "Based on what we've discussed, I'm even more excited about this role. The combination of mid-market HCM clients, the breadth of the suite, and the structure of your PS team is exactly where I want to be."
            </p>
            <p>
              <strong className="text-foreground">Ask about next steps:</strong> "What does the rest of your interview process look like, and what's a realistic timeline for a decision?"
            </p>
            <p>
              <strong className="text-foreground">Follow up:</strong> Send a thank-you email within 24 hours with one specific detail from the conversation and a short note on how you'd tackle a challenge they mentioned.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
