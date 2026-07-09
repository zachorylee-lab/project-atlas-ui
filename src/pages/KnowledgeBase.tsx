import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import {
  BookOpenCheck, Search, LayoutDashboard, BarChart3, ArrowRightLeft, BookOpen,
  Grid3x3, FolderOpen, Kanban, ListChecks, Database, ClipboardList, ClipboardCheck,
  Plug, ShieldAlert, GraduationCap, Activity, Settings2, MessageSquare, Presentation,
  Building2, Sparkles, Users, Target, CheckCircle2, Quote,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";


type Area = {
  group: string;
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
  purpose: string;
  performs: string[];
  inputs: string[];
  outputs: string[];
  usedBy: string[];
  phase: string;
};

const areas: Area[] = [
  {
    group: "Overview",
    title: "Implementation Dashboard",
    url: "/",
    icon: LayoutDashboard,
    phase: "All phases",
    purpose:
      "The SIC's daily start page. A single view of every active Dayshape implementation, what's on fire, and what needs a decision today.",
    performs: [
      "Rolls up status across every active customer (Handoff → Hypercare) into RAG indicators.",
      "Surfaces phase progress, days-to-go-live, and open Sev-1 items per customer.",
      "Highlights the day's must-do actions: sign-offs due, integration approvals, sponsor asks.",
      "Deep-links into the underlying page (workbook, RAID, UAT) with one click.",
    ],
    inputs: ["Project status from Active Implementations", "RAID entries", "Adoption readiness", "Task board completion"],
    outputs: ["RAG summary per customer", "SIC daily action list", "Escalation triggers"],
    usedBy: ["SIC (daily standup)", "Head of Delivery (portfolio scan)"],
  },
  {
    group: "Overview",
    title: "Portfolio Health",
    url: "/metrics",
    icon: BarChart3,
    phase: "All phases",
    purpose:
      "The delivery leadership view. Trends the five KPIs that Dayshape's Professional Services org is measured on across the whole customer book.",
    performs: [
      "Trends Time to First Schedule (TTFS), Time to First Forecast (TTFF), On-Time Go-Live %, CSAT, and CSM Transition Readiness.",
      "Benchmarks each implementation against the target curve for its firm size and complexity.",
      "Slices by practice (Audit / Tax / Advisory), geography, and product module.",
      "Flags outliers so leaders can rebalance SIC capacity before slippage becomes a RAID item.",
    ],
    inputs: ["Milestone dates from every customer project", "Go-live records", "Post-Hypercare CSAT surveys"],
    outputs: ["KPI trend charts", "Portfolio heatmap", "Capacity re-balancing signals"],
    usedBy: ["Head of Professional Services", "Delivery leadership", "CFO (utilisation)"],
  },
  {
    group: "Pre-Kickoff",
    title: "Sales Handoff",
    url: "/handoff",
    icon: ArrowRightLeft,
    phase: "Handoff",
    purpose:
      "The formal transfer of a Closed-Won opportunity from Sales into Delivery. Captures the commercial promise so nothing is lost in translation between AE and SIC.",
    performs: [
      "Loads the signed SOW, commercial terms, in-scope modules, and success criteria.",
      "Records stated pain points, executive sponsors, decision-makers, and named end-user personas.",
      "Confirms integration inventory (Workday, CCH, Salesforce, etc.) and known constraints.",
      "Produces a Handoff Acceptance sign-off — nothing else in Delivery starts until this is complete.",
    ],
    inputs: ["Signed SOW", "Salesforce opportunity", "Sales discovery notes", "MSA / DPA status"],
    outputs: ["Handoff Acceptance record", "Initial scope baseline", "Named stakeholder list"],
    usedBy: ["SIC", "Account Executive", "Customer Success Manager"],
  },
  {
    group: "Pre-Kickoff",
    title: "Onboarding Playbook",
    url: "/playbook",
    icon: BookOpen,
    phase: "Handoff → Kickoff",
    purpose:
      "The end-to-end methodology every Dayshape SIC follows. Turns tacit expertise into a repeatable delivery framework.",
    performs: [
      "Documents the six-phase model (Handoff, Kickoff, Build, Testing, Go-Live, Hypercare) with entry/exit criteria.",
      "Assigns default owners, durations, and required artefacts per phase.",
      "Links each step to the tools that produce its artefact (Workbook, UAT Tracker, RAID, Training).",
      "Serves as the induction path for a new SIC joining the team.",
    ],
    inputs: ["Dayshape delivery methodology", "Lessons learned from prior implementations"],
    outputs: ["Consistent, auditable delivery approach", "Onboarding path for new SICs"],
    usedBy: ["SIC", "New joiners", "Head of Delivery"],
  },
  {
    group: "Pre-Kickoff",
    title: "RACI Matrix",
    url: "/raci",
    icon: Grid3x3,
    phase: "Kickoff",
    purpose:
      "Names the humans behind every workstream. Prevents the classic implementation failure mode of assumed ownership.",
    performs: [
      "Maps each deliverable to Responsible / Accountable / Consulted / Informed parties across Dayshape and the customer.",
      "Distinguishes SIC-owned, customer-owned, and joint activities.",
      "Feeds the Steering Committee cadence and the escalation path.",
    ],
    inputs: ["Sales Handoff stakeholder list", "Customer org chart"],
    outputs: ["Named RACI per workstream", "Escalation ladder"],
    usedBy: ["SIC", "Customer PM", "Steering Committee"],
  },
  {
    group: "Pre-Kickoff",
    title: "Templates & SOWs",
    url: "/templates",
    icon: FolderOpen,
    phase: "All phases",
    purpose:
      "A curated library of the reusable artefacts an SIC needs — SOW variants, kickoff decks, workshop agendas, test plans, cutover runbooks, CSM handover pack.",
    performs: [
      "Version-controlled templates tagged by phase, firm size, and product scope.",
      "One-click clone into a customer's workspace with variables pre-filled.",
      "Retires stale templates and highlights the current standard.",
    ],
    inputs: ["Firm standards", "Legal-approved SOW language"],
    outputs: ["Consistent customer artefacts", "Reduced blank-page time"],
    usedBy: ["SIC", "Legal", "PMO"],
  },
  {
    group: "Delivery",
    title: "Active Implementations",
    url: "/projects",
    icon: Kanban,
    phase: "Kickoff → Hypercare",
    purpose:
      "The Kanban of live customer projects. Where an SIC opens each customer to see plan, RAID, and progress in one place.",
    performs: [
      "Cards for each active customer showing phase, health, days-to-go-live, and next milestone.",
      "Drag between phase columns to advance the implementation.",
      "Deep-links into the customer's Workbook, UAT, RAID, and Adoption pages.",
    ],
    inputs: ["Project plan", "Milestone completion", "RAID health"],
    outputs: ["Portfolio Kanban", "Phase transition audit trail"],
    usedBy: ["SIC", "Head of Delivery"],
  },
  {
    group: "Delivery",
    title: "Consultant Task Board",
    url: "/pm-tasks",
    icon: ListChecks,
    phase: "All phases",
    purpose:
      "The SIC's personal task list across every customer. Interactive Kanban with subtasks — the 'what am I doing today' view.",
    performs: [
      "Aggregates tasks assigned to the current consultant across every implementation.",
      "Kanban lanes for Backlog / This Week / In Progress / Blocked / Done, with subtasks per card.",
      "Filter by customer, phase, workstream, or due-in-24h.",
    ],
    inputs: ["Tasks generated by other pages (Workbook sign-offs, UAT fixes, RAID actions)"],
    outputs: ["Prioritised daily task list", "Blocked-task signal into RAID"],
    usedBy: ["SIC (primary)", "Delivery Manager (workload view)"],
  },
  {
    group: "Delivery",
    title: "Workstreams",
    url: "/workflows",
    icon: Database,
    phase: "Build → Go-Live",
    purpose:
      "The five parallel Dayshape delivery workstreams: Firm Model, Integrations, Engagement Mapping, Scheduling & Forecast tuning, and AI Auto-Scheduler optimisation. Each has its own plan, owner, and gate.",
    performs: [
      "Tracks the state of each workstream against its phase gate.",
      "Shows dependencies between workstreams (e.g. Firm Model must be signed off before Engagement Mapping starts).",
      "Surfaces workstream-level RAID items back into the master log.",
    ],
    inputs: ["Configuration Workbook progress", "Integration status", "Test pass rates"],
    outputs: ["Workstream RAG", "Critical-path view"],
    usedBy: ["SIC", "Customer workstream leads"],
  },
  {
    group: "Delivery",
    title: "Configuration Workbook",
    url: "/configuration-workbook",
    icon: ClipboardList,
    phase: "Build",
    purpose:
      "The single source of truth for every Dayshape design decision. This is the artefact SICs live in during Build — it captures the answers that will become the configured system.",
    performs: [
      "Structured sections for Firm & organisational model, Grades & rate cards, Engagement types & workflow, Scheduling & forecast rules, Integrations & data flows, and AI Auto-Scheduler tuning.",
      "Each section carries an owner, customer approver, target sign-off date, and status (Not started → Drafting → In review → Signed off).",
      "Sign-off of all sections is the entry gate to the Testing phase.",
      "Exports to XLSX for customer review offline.",
    ],
    inputs: ["Sales Handoff scope", "Customer workshops", "Existing customer systems (org chart, rate card, engagement list)"],
    outputs: ["Signed configuration design", "Backlog of build tickets for Dayshape config team"],
    usedBy: ["SIC", "Customer Head of Resourcing", "Practice leads"],
  },
  {
    group: "Delivery",
    title: "UAT Tracker",
    url: "/uat",
    icon: ClipboardCheck,
    phase: "Testing",
    purpose:
      "Scenario-based test scripts organised by workstream, tied to defects and the Go-Live sign-off gate. Turns 'we tested it' into evidence.",
    performs: [
      "Library of test scripts by workstream (Firm Model, Integrations, Engagement Mapping, Scheduling & Forecast, AI Auto-Scheduler), each with persona, steps, priority (Must/Should/Could), and result.",
      "Defect log linked to failing scripts with severity (Sev-1 to Sev-4) and status.",
      "Live pass-rate charts and gate calculator: all Must scripts executed, no Sev-1 open, ≥ 90% pass rate.",
      "Produces the customer sign-off statement that authorises Go-Live.",
    ],
    inputs: ["Configured Dayshape environment", "Configuration Workbook (as the source of truth for expected behaviour)"],
    outputs: ["Test evidence", "Defect list", "Customer sign-off statement"],
    usedBy: ["SIC", "Customer test lead", "Dayshape Engineering (defects)"],
  },
  {
    group: "Delivery",
    title: "Integrations & Data",
    url: "/integrations",
    icon: Plug,
    phase: "Build → Hypercare",
    purpose:
      "Operational view of every live and planned integration for the customer — Workday, BambooHR, CCH Axcess, Practice Engine, NetSuite, Sage Intacct, Outlook, Google Calendar, Snowflake, Power BI.",
    performs: [
      "Per-integration status: not started, in build, testing, live.",
      "Cadence, last successful run, row counts, reconciliation deltas.",
      "Ownership split between Dayshape, customer IT, and third parties.",
    ],
    inputs: ["Configuration Workbook (integration section)", "Integration Setup credentials"],
    outputs: ["Integration health dashboard", "Data reconciliation reports"],
    usedBy: ["SIC", "Customer IT", "Dayshape Support (Hypercare)"],
  },
  {
    group: "Delivery",
    title: "RAID Log",
    url: "/raid",
    icon: ShieldAlert,
    phase: "All phases",
    purpose:
      "Risks, Assumptions, Issues, and Dependencies — the auditable log of everything that could or has knocked the project off track.",
    performs: [
      "Log entries with type (R/A/I/D), severity, owner, mitigation, and status.",
      "Aging view — flags items past their due-by date.",
      "Feeds Steering Committee packs and the CSM handover.",
    ],
    inputs: ["Workshops", "Test failures", "Sponsor conversations", "Blocked tasks"],
    outputs: ["Weekly risk report", "Escalations", "Post-project lessons learned"],
    usedBy: ["SIC", "Customer PM", "Steering Committee"],
  },
  {
    group: "Customer Enablement",
    title: "Training Library",
    url: "/training-library",
    icon: GraduationCap,
    phase: "Build → Hypercare",
    purpose:
      "The customer-facing content that drives adoption. Loom walk-throughs, Scribe step-by-step guides, and role-based learning paths embedded inline.",
    performs: [
      "Curated Loom and Scribe embeds by persona (Admin, Scheduler, Partner, Consultant) and module (Scheduler, Forecast, AI Auto-Scheduler, Firm Model, Reporting).",
      "Preview button renders the video/guide inside the console — no context switch.",
      "Marks content as prerequisite, recommended, or on-demand for each persona.",
    ],
    inputs: ["Loom share URLs", "Scribe workflow URLs", "Persona definitions"],
    outputs: ["Persona learning paths", "Content views feeding the Adoption Tracker"],
    usedBy: ["SIC", "Customer training lead", "End users"],
  },
  {
    group: "Customer Enablement",
    title: "Adoption Tracker",
    url: "/adoption",
    icon: Activity,
    phase: "Go-Live → Hypercare",
    purpose:
      "The evidence base for CSM Transition Readiness. Shows per-customer training completion, certification, and feature adoption against target curves.",
    performs: [
      "Readiness score per customer, phase indicator, and days to/from go-live.",
      "Persona-level metrics: invited, trained, certified, weekly active — with vs-target delta.",
      "Module-level feature adoption (Scheduler, Forecast, AI Auto-Scheduler, Firm Model, Reporting) with weekly trend.",
      "CSM transition gates: certification %, scheduler adoption, forecast adoption, handoff complete.",
    ],
    inputs: ["Training Library completions", "Product usage telemetry", "Certification quiz results"],
    outputs: ["Readiness score", "CSM Handover Pack input", "Adoption vs. target chart"],
    usedBy: ["SIC", "Customer Success Manager", "Customer sponsor"],
  },
  {
    group: "Setup",
    title: "Integration Setup",
    url: "/integration-setup",
    icon: Settings2,
    phase: "Build",
    purpose:
      "The mechanical wiring of each source and target system: credentials, endpoints, scopes, field mappings, and test runs.",
    performs: [
      "Per-integration wizard: authenticate, choose scope, map fields, run test extract.",
      "Stores connection state and last-tested timestamp.",
      "Hands green-lit integrations to the Integrations & Data page for ongoing operations.",
    ],
    inputs: ["Customer IT credentials", "Field mapping decisions from the Workbook"],
    outputs: ["Live connections", "Test-extract reconciliation"],
    usedBy: ["SIC", "Customer IT", "Dayshape integrations team"],
  },
  {
    group: "Interview & Demo",
    title: "Interview Prep",
    url: "/interview-prep",
    icon: MessageSquare,
    phase: "N/A",
    purpose:
      "A structured prep space for SIC candidate interviews — the STAR stories, competency answers, and Dayshape-specific talking points.",
    performs: [
      "Competency library aligned to the Dayshape SIC role (delivery, consulting craft, technical depth, customer empathy).",
      "STAR-format answer builder with prompts drawn from real Dayshape scenarios.",
      "Cheat-sheet view for the day of the interview.",
    ],
    inputs: ["The role spec", "The candidate's experience"],
    outputs: ["Prepped answers", "Follow-up questions to ask the panel"],
    usedBy: ["The candidate"],
  },
  {
    group: "Interview & Demo",
    title: "Demo Mode",
    url: "/demo",
    icon: Presentation,
    phase: "N/A",
    purpose:
      "A guided walk-through of this console for the interview panel — narrates each area, its purpose, and how it maps to the SIC role.",
    performs: [
      "Step-through script covering every page with talking points.",
      "Full-screen presenter view.",
      "Hand-off to live navigation for panel questions.",
    ],
    inputs: ["The console itself"],
    outputs: ["A 10-minute confident demo"],
    usedBy: ["The candidate"],
  },
];

type Term = {
  term: string;
  category: "Dayshape product" | "Dayshape delivery" | "Professional services" | "Integrations" | "Metrics & KPIs";
  short: string;
  detail: string;
};

const terms: Term[] = [
  // Dayshape product
  { term: "Dayshape", category: "Dayshape product", short: "Enterprise resource management platform for professional-services firms — scheduling, forecasting, utilisation, and AI-driven auto-scheduling.", detail: "Dayshape is used primarily by accounting and consulting firms (including six of the top ten global accounting networks) to schedule chargeable staff, forecast capacity, and drive utilisation. It is HQ'd in Edinburgh, Scotland." },
  { term: "Scheduler", category: "Dayshape product", short: "The core Dayshape module for assigning people to engagements across time.", detail: "Grid-based UI that lets resource managers book staff to engagements by day/week, respects independence rules and grade mix, and shows over/under-allocation in real time." },
  { term: "Forecast", category: "Dayshape product", short: "Rolling capacity and demand view — typically 13 weeks plus fiscal-year outlook.", detail: "Combines confirmed schedules, pipeline engagements, and PTO to project chargeability, gaps, and hotspots. Feeds firm-wide planning." },
  { term: "AI Auto-Scheduler", category: "Dayshape product", short: "Dayshape's optimisation engine that proposes assignments respecting hard and soft constraints.", detail: "Hard constraints (independence, grade mix, availability) are always enforced; soft constraints (continuity, office proximity, utilisation smoothing) are weighted. Typically rolled out with a manager-in-the-loop review period." },
  { term: "Firm Model", category: "Dayshape product", short: "The configured representation of a firm's structure inside Dayshape.", detail: "Practices, service lines, offices, grades, working patterns, rate cards, and calendars. The Firm Model is the foundation every other module depends on." },
  { term: "Engagement", category: "Dayshape product", short: "A billable piece of work for a client — typically the unit staff are scheduled against.", detail: "Has a template (audit, tax compliance, advisory), budget in hours or fees, a required team shape, and a status lifecycle." },
  { term: "Engagement Template", category: "Dayshape product", short: "A reusable pattern that pre-populates team shape, duration model, and approvals for a category of work.", detail: "Examples: 'Annual audit', 'Tax compliance – 1120', 'Advisory engagement (fixed fee)'." },
  { term: "Grade", category: "Dayshape product", short: "A career level (Analyst, Senior, Manager, Sr Manager, Director, Partner) that drives cost, bill rate, and target utilisation.", detail: "Grades are configured in the Firm Model and referenced by engagement templates and rate cards." },
  { term: "Rate card", category: "Dayshape product", short: "Versioned schedule of cost and bill rates by grade (and sometimes by service line or client).", detail: "Rate cards are effective-dated so historical schedules value correctly after a rate change." },
  { term: "Independence rules", category: "Dayshape product", short: "Audit-specific constraints that block a staff member from working on a client where they have a conflict.", detail: "In Dayshape these are hard constraints — the Scheduler and Auto-Scheduler will refuse the assignment, not warn." },

  // Dayshape delivery
  { term: "SIC", category: "Dayshape delivery", short: "Senior Implementation Consultant — the primary role this console supports.", detail: "Owns the end-to-end delivery of a Dayshape implementation from Sales Handoff to CSM Transition. Blend of consulting, project management, and technical configuration." },
  { term: "CSM", category: "Dayshape delivery", short: "Customer Success Manager — takes ownership of the customer after Hypercare ends.", detail: "The SIC's exit gate is CSM Transition Readiness: adoption evidenced, RAID clean, handover pack delivered." },
  { term: "Handoff", category: "Dayshape delivery", short: "Phase 1 — formal transfer from Sales to Delivery.", detail: "Signed SOW, stakeholder list, scope baseline, and Handoff Acceptance record. Delivery does not start work without this." },
  { term: "Kickoff", category: "Dayshape delivery", short: "Phase 2 — governance stand-up with the customer.", detail: "RACI signed, workstream leads named, plan agreed, Steering Committee cadence set." },
  { term: "Build", category: "Dayshape delivery", short: "Phase 3 — configuration and integration work.", detail: "The Configuration Workbook is the primary artefact. Ends when every section is signed off." },
  { term: "Testing", category: "Dayshape delivery", short: "Phase 4 — UAT against the signed configuration.", detail: "Managed in the UAT Tracker; ends when all Must scripts pass and Sev-1 defects are closed." },
  { term: "Go-Live", category: "Dayshape delivery", short: "Phase 5 — cutover to the new system.", detail: "Runbook-driven: data freeze, final migration, reconciliation, comms, and a hyper-attentive first working day." },
  { term: "Hypercare", category: "Dayshape delivery", short: "Phase 6 — heightened SIC support post-Go-Live (typically 2–6 weeks).", detail: "Elevated response SLAs, daily check-ins, adoption push. Ends with CSM Transition Readiness sign-off." },
  { term: "Cutover", category: "Dayshape delivery", short: "The controlled window in which the customer stops using the legacy system and starts using Dayshape.", detail: "Governed by a Cutover Runbook covering data freeze, migration, reconciliation, and rollback triggers." },
  { term: "RAID log", category: "Dayshape delivery", short: "Risks, Assumptions, Issues, Dependencies — the master log for delivery governance.", detail: "Every implementation has one; entries have owners, mitigations, and due dates." },
  { term: "Steering Committee (SteerCo)", category: "Dayshape delivery", short: "The governance forum with customer sponsor + Dayshape senior stakeholders, typically monthly.", detail: "Reviews status, RAID, KPIs, and decisions requiring executive sign-off." },
  { term: "Configuration Workbook", category: "Dayshape delivery", short: "The signed-off design of the customer's Dayshape configuration.", detail: "Structured by section (Firm model, Grades, Engagements, Scheduling rules, Integrations, AI tuning). Sign-off gates entry to Testing." },
  { term: "UAT", category: "Dayshape delivery", short: "User Acceptance Testing — the customer's own scenario-based test of Dayshape before Go-Live.", detail: "Scripts are persona- and workstream-based. Managed in the UAT Tracker." },
  { term: "Defect severity", category: "Dayshape delivery", short: "Sev-1 (blocker) → Sev-2 (major) → Sev-3 (minor) → Sev-4 (cosmetic).", detail: "Sev-1 must be zero to sign off UAT. Sev-2/3 can be accepted with recorded mitigations." },
  { term: "CSM Transition Readiness", category: "Dayshape delivery", short: "The exit criterion for Hypercare and for the SIC.", detail: "Composite score of adoption gates (certification %, feature adoption), open RAID health, and handover pack completeness." },

  // Professional services
  { term: "Chargeability", category: "Professional services", short: "The percentage of a person's working hours that are billable to a client engagement.", detail: "Firms set target chargeability by grade (e.g. 82% Analyst, 45% Partner). Dayshape reports actual vs target continuously." },
  { term: "Utilisation", category: "Professional services", short: "Broader than chargeability — % of working hours used productively, whether billable or invested (training, BD).", detail: "Sometimes used interchangeably with chargeability; a firm's exact definition should be captured in the Configuration Workbook." },
  { term: "Resource manager (RM)", category: "Professional services", short: "The person who assigns staff to engagements — the primary Scheduler user.", detail: "Sits between partners (who demand people) and staff (who deliver). The RM's job is exactly what Dayshape automates." },
  { term: "Engagement partner", category: "Professional services", short: "The partner accountable for a specific client engagement's delivery, quality, and profitability.", detail: "Typically approves the team shape and signs off staff assignments for their engagement." },
  { term: "Team shape", category: "Professional services", short: "The mix of grades required for an engagement (e.g. 1 Partner · 1 Manager · 2 Sr · 4 Analyst).", detail: "Defined on engagement templates; the Auto-Scheduler treats grade mix as a hard constraint." },
  { term: "Practice", category: "Professional services", short: "A top-level line of business inside a firm (Audit, Tax, Advisory).", detail: "Practices contain service lines and have their own P&L, leadership, and resourcing rules." },
  { term: "Service line", category: "Professional services", short: "A sub-discipline within a practice (e.g. External Audit, Internal Audit within Audit & Assurance).", detail: "Service lines often have distinct rate cards, engagement templates, and independence rules." },
  { term: "Busy season", category: "Professional services", short: "The demand peaks in accounting firms — Jan–Apr for US tax, year-end audits for calendar-year clients.", detail: "The AI Auto-Scheduler earns most of its value here; getting busy season staffing wrong is materially expensive." },
  { term: "PTO", category: "Professional services", short: "Paid Time Off. In Dayshape, PTO blocks availability and should never be over-allocated.", detail: "Typically integrated from Workday, BambooHR, or the firm's HRIS." },
  { term: "MSA / DPA / SOW", category: "Professional services", short: "Master Service Agreement / Data Processing Agreement / Statement of Work — the contract stack.", detail: "MSA covers the ongoing relationship, DPA covers data handling (GDPR/CCPA), SOW covers the specific piece of work. All three should be in place before Kickoff." },

  // Integrations
  { term: "Workday", category: "Integrations", short: "Cloud HCM — usually the system of record for people, jobs, and PTO.", detail: "Standard Dayshape integration; nightly Worker + Job feed keyed on Employee ID." },
  { term: "BambooHR", category: "Integrations", short: "HRIS commonly used by mid-market firms — alternative source for people data.", detail: "Similar pattern to Workday: nightly worker sync." },
  { term: "CCH Axcess", category: "Integrations", short: "Wolters Kluwer's cloud tax and practice management suite.", detail: "Source of clients and tax engagements for firms on the CCH stack." },
  { term: "Practice Engine", category: "Integrations", short: "Practice management software common in mid-tier accounting firms.", detail: "Provides engagement, time, and billing data as an alternative to CCH." },
  { term: "NetSuite / Sage Intacct", category: "Integrations", short: "ERP / general ledger systems — the destination for approved time and fees.", detail: "Weekly outbound push from Dayshape after time approval." },
  { term: "Snowflake", category: "Integrations", short: "Cloud data warehouse — the customer's analytics store.", detail: "Dayshape pushes schedules and forecasts hourly so firm-wide BI can join them to other data." },
  { term: "Power BI", category: "Integrations", short: "Microsoft's BI tool — where partners often consume utilisation dashboards.", detail: "Fed from Snowflake or directly from Dayshape's reporting exports." },
  { term: "Microsoft Graph", category: "Integrations", short: "The API surface for Outlook, Teams, and Microsoft 365.", detail: "Dayshape uses Graph for real-time calendar availability and (optionally) writing schedules back to consultants' calendars." },
  { term: "Salesforce", category: "Integrations", short: "CRM — often the source of pipeline opportunities that become Dayshape engagements.", detail: "Closed-Won opportunity typically triggers creation of an engagement shell." },

  // Metrics & KPIs
  { term: "TTFS", category: "Metrics & KPIs", short: "Time to First Schedule — days from Kickoff to the first real schedule published in Dayshape.", detail: "A leading indicator of implementation velocity. Target varies by firm size and integration count." },
  { term: "TTFF", category: "Metrics & KPIs", short: "Time to First Forecast — days from Kickoff to the first credible capacity forecast.", detail: "Requires Firm Model + engagement backlog + at least basic scheduling to be in place." },
  { term: "On-Time Go-Live %", category: "Metrics & KPIs", short: "Portfolio metric — % of implementations that hit the go-live date agreed at Kickoff.", detail: "Slippage is a leading indicator of scope creep or under-resourced customer teams." },
  { term: "CSAT", category: "Metrics & KPIs", short: "Customer Satisfaction — measured at end of Hypercare and again at 90 days.", detail: "Typically a 1–5 or NPS-style score, with a comment field. Feeds into SIC and Delivery leadership reviews." },
  { term: "CSM Transition Readiness", category: "Metrics & KPIs", short: "The readiness score that gates the handover from SIC to CSM.", detail: "Composite of adoption metrics, RAID health, and completion of the CSM Handover Pack." },
  { term: "Adoption curve", category: "Metrics & KPIs", short: "Actual adoption vs the target adoption trajectory across the weeks either side of Go-Live.", detail: "Under-curve triggers targeted training and comms; over-curve is celebrated in the SteerCo." },
];

type ClientPitch = {
  headline: string;
  audience: string;
  whyItMatters: string;
  painsSolved: string[];
  outcomes: string[];
  quote?: string;
};

const clientPitches: Record<string, ClientPitch> = {
  "/": {
    headline: "One place to see whether your Dayshape roll-out is on track",
    audience: "Executive sponsor · Programme owner",
    whyItMatters:
      "Instead of chasing status updates over email, you get a live view of your implementation alongside every other Dayshape customer's — with a defined RAG standard and next actions.",
    painsSolved: [
      "\"I never know if we're actually on track for go-live.\"",
      "\"Status decks are two weeks out of date by the time we see them.\"",
      "\"Different vendors, different formats — I can't compare.\"",
    ],
    outcomes: [
      "A single dashboard shared with your SIC, sponsor, and CSM",
      "Same status standard used across Dayshape's entire customer base",
      "Escalations surface before they cost you the go-live date",
    ],
  },
  "/metrics": {
    headline: "See how your roll-out is performing vs peer benchmarks",
    audience: "COO · Head of Resourcing",
    whyItMatters:
      "Dayshape has implemented hundreds of firms — you benefit from that benchmark data. Your Time to First Schedule, Time to First Forecast, and adoption curves are compared against firms of your size and complexity, not held to a made-up target.",
    painsSolved: [
      "\"How do I know if our implementation velocity is normal?\"",
      "\"We spent millions and I can't prove the payback.\"",
    ],
    outcomes: [
      "Benchmarked KPIs against comparable firms",
      "Early warning when you're drifting off the peer curve",
      "Evidence for your board that the programme is delivering",
    ],
  },
  "/handoff": {
    headline: "Nothing gets lost between the sales conversation and delivery",
    audience: "Executive sponsor · Procurement",
    whyItMatters:
      "The commercial promises you were made in the sales cycle — modules, integrations, success criteria, sponsors — are all captured formally before your SIC lifts a finger. You are not going to hear \"that wasn't in scope\" three months in.",
    painsSolved: [
      "\"We bought X, we're getting Y.\"",
      "\"The delivery team asked me the same discovery questions the sales team did.\"",
    ],
    outcomes: [
      "Signed handoff record listing every commitment",
      "Named exec sponsors, decision-makers, and end-user personas",
      "Delivery starts with full context — no re-discovery tax",
    ],
  },
  "/playbook": {
    headline: "You get Dayshape's proven method, not a bespoke experiment",
    audience: "Programme sponsor · Change lead",
    whyItMatters:
      "Every Dayshape implementation follows the same six-phase model with the same entry and exit criteria — refined across hundreds of firms. You are not the pilot for your SIC's personal approach.",
    painsSolved: [
      "\"Vendors always seem to invent the process as they go.\"",
      "\"I don't know what 'good' looks like at each stage.\"",
    ],
    outcomes: [
      "Predictable phase gates: Handoff → Kickoff → Build → Testing → Go-Live → Hypercare",
      "Clear artefacts to expect at each stage",
      "A method your PMO can audit",
    ],
  },
  "/raci": {
    headline: "Everyone knows who owns what — including your side",
    audience: "Customer PM · Sponsor",
    whyItMatters:
      "The most common cause of implementation slippage is unclear ownership on the customer side. The RACI names people, not roles, and both organisations sign it before Build starts.",
    painsSolved: [
      "\"I thought IT was doing that.\"",
      "\"Who decides on the rate card change — us or you?\"",
    ],
    outcomes: [
      "Named owner for every deliverable",
      "Documented escalation ladder to your exec sponsor",
      "Faster decisions because the right person is in the room",
    ],
  },
  "/templates": {
    headline: "Reuse the artefacts that hundreds of firms have already validated",
    audience: "Customer PM · Legal · Change lead",
    whyItMatters:
      "SOWs, kickoff decks, workshop agendas, cutover runbooks — all pre-built to Dayshape's current standard and legal-approved. You spend zero time on blank-page work.",
    painsSolved: [
      "\"We rebuilt every deck from scratch on the last programme.\"",
      "\"Legal review of a new SOW took six weeks.\"",
    ],
    outcomes: [
      "Faster start on every phase",
      "Consistent, professional artefacts for your SteerCo",
      "Legal-approved commercial documents ready to sign",
    ],
  },
  "/projects": {
    headline: "See your implementation next to every other Dayshape roll-out",
    audience: "Executive sponsor",
    whyItMatters:
      "Transparent Kanban view of every live customer, including yours. You can see phase, health, and progress the same way Dayshape's leadership sees it — no filtered view.",
    painsSolved: [
      "\"I only get told about problems in the weekly call.\"",
    ],
    outcomes: [
      "Continuous visibility of phase and health",
      "One-click deep-link into Workbook, UAT, RAID, Adoption",
    ],
  },
  "/workflows": {
    headline: "Five parallel workstreams so we don't move at the pace of the slowest",
    audience: "Customer PM · Workstream leads",
    whyItMatters:
      "Firm Model, Integrations, Engagement Mapping, Scheduling & Forecast tuning, and AI Auto-Scheduler optimisation run in parallel with their own owners, gates, and dependencies — so a slow integration doesn't block the whole programme.",
    painsSolved: [
      "\"The last vendor did everything sequentially and it took a year.\"",
    ],
    outcomes: [
      "Parallel progress across five streams",
      "Explicit dependencies mapped, not assumed",
      "Compressed calendar time to go-live",
    ],
  },
  "/configuration-workbook": {
    headline: "Every design decision, in one signed document, before we build it",
    audience: "Head of Resourcing · Practice leads · CIO",
    whyItMatters:
      "The Configuration Workbook is the single record of every decision about your firm model, grades, engagement templates, scheduling rules, integrations, and AI tuning. Your team approves it section by section. Nothing gets configured that you haven't signed off — and nothing gets forgotten.",
    painsSolved: [
      "\"We got to UAT and discovered they'd modelled the firm wrong.\"",
      "\"Decisions were made in workshops that nobody wrote down.\"",
      "\"Change requests appeared six months later because scope was fuzzy.\"",
    ],
    outcomes: [
      "A firm-approved design document your PMO can audit",
      "Traceability from every configured behaviour to the decision that authorised it",
      "Sharp scope guardrails — change requests are visible, not sneaky",
    ],
    quote:
      "\"The Workbook is what stopped us re-arguing decisions three months later. It's now the reference we use for every internal Dayshape question.\"",
  },
  "/uat": {
    headline: "Evidence-based sign-off, not a leap of faith",
    audience: "Customer test lead · Executive sponsor · Audit committee",
    whyItMatters:
      "Test scripts are scenario-based, by persona and workstream, with priority (Must / Should / Could) and pass/fail evidence. The Go-Live gate is a calculation — all Must scripts executed, no Sev-1 defects open, ≥ 90% pass rate — not a subjective judgement.",
    painsSolved: [
      "\"We signed off UAT and then everything broke on day one.\"",
      "\"Our internal audit team wanted evidence we couldn't produce.\"",
      "\"We didn't know what 'ready' meant.\"",
    ],
    outcomes: [
      "A defensible test evidence pack for internal audit and regulators",
      "Clear, objective Go-Live gates",
      "Defects triaged by severity, with mitigations recorded",
    ],
  },
  "/integrations": {
    headline: "Every data flow live-monitored — no more silent failures",
    audience: "CIO · Head of IT · Data owner",
    whyItMatters:
      "Workday, CCH, Salesforce, NetSuite, Snowflake, Outlook, and the rest are shown as live status cards with last successful run, row counts, and reconciliation deltas. If a nightly Workday feed drops, you and your SIC know before your resource managers do.",
    painsSolved: [
      "\"We only find out about broken integrations when the schedules look wrong.\"",
      "\"Nobody knows who owns the Salesforce → engagement handoff.\"",
    ],
    outcomes: [
      "Live health monitoring across every integration",
      "Named ownership per integration (Dayshape / your IT / third party)",
      "Reconciliation reports for finance and audit",
    ],
  },
  "/raid": {
    headline: "An auditable log of every risk, issue, and dependency — no surprises",
    audience: "Programme sponsor · PMO · SteerCo",
    whyItMatters:
      "Risks, Assumptions, Issues, and Dependencies are logged with owner, mitigation, severity, and due date. Aging items are flagged. The RAID log is the spine of every SteerCo pack and the input to CSM handover.",
    painsSolved: [
      "\"We got surprised by risks that had been known for months.\"",
      "\"Issues got raised in meetings but never assigned.\"",
    ],
    outcomes: [
      "Live, auditable RAID visible to your PMO",
      "Aging alerts on unresolved items",
      "Direct feed into your SteerCo pack",
    ],
  },
  "/training-library": {
    headline: "Role-based training your people will actually complete",
    audience: "Change lead · Training lead · L&D",
    whyItMatters:
      "Loom walk-throughs and Scribe step-by-step guides curated by persona (Admin, Scheduler, Partner, Consultant) and module. Embedded inline — no LMS login, no context switch, no 45-minute recorded webinars nobody watches.",
    painsSolved: [
      "\"We paid for training and nobody used it.\"",
      "\"Partners refused to sit through hour-long videos.\"",
      "\"New joiners have no consistent onboarding path.\"",
    ],
    outcomes: [
      "Persona-specific learning paths",
      "Bite-sized Loom + Scribe content people actually complete",
      "Content re-usable for new joiners after go-live",
    ],
  },
  "/adoption": {
    headline: "Prove the platform is being used before you cut the SIC loose",
    audience: "Executive sponsor · Head of Resourcing · CSM",
    whyItMatters:
      "Per-persona and per-module metrics — invited, trained, certified, weekly active — against a target curve. The CSM handover is gated on adoption evidence, not just calendar dates. You don't lose your SIC before your people are using the tool.",
    painsSolved: [
      "\"The vendor left and adoption fell off a cliff.\"",
      "\"Partners never adopted the Forecast module — we're not getting the value.\"",
    ],
    outcomes: [
      "Adoption evidence tied to CSM transition",
      "Early warning when a persona is falling behind the curve",
      "A defensible ROI story for your exec board",
    ],
  },
  "/integration-setup": {
    headline: "Guided integration setup — no bespoke IT project required",
    audience: "IT lead · Integration owner",
    whyItMatters:
      "Per-integration wizard walks your IT team through credentials, scopes, field mapping, and test extracts. Standard connectors for Workday, BambooHR, CCH, Salesforce, NetSuite, Snowflake, Outlook — not custom API work.",
    painsSolved: [
      "\"Every integration on our last programme was a bespoke build.\"",
      "\"IT couldn't tell us what fields Dayshape needed.\"",
    ],
    outcomes: [
      "Standard connectors used wherever possible",
      "Test-extract reconciliation before you trust the feed",
      "Auditable record of scopes granted and to whom",
    ],
  },
};


const categoryTint: Record<Term["category"], string> = {
  "Dayshape product": "bg-primary/10 text-primary",
  "Dayshape delivery": "bg-[hsl(200_70%_50%)]/15 text-[hsl(200_70%_50%)]",
  "Professional services": "bg-[hsl(30_95%_55%)]/15 text-[hsl(30_95%_55%)]",
  Integrations: "bg-[hsl(280_55%_55%)]/15 text-[hsl(280_55%_55%)]",
  "Metrics & KPIs": "bg-[hsl(155_60%_45%)]/15 text-[hsl(155_60%_45%)]",
};

const categories = [
  "All",
  "Dayshape product",
  "Dayshape delivery",
  "Professional services",
  "Integrations",
  "Metrics & KPIs",
] as const;

export default function KnowledgeBase() {
  const [tab, setTab] = useState("areas");
  const [areaQ, setAreaQ] = useState("");
  const [termQ, setTermQ] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");

  const areasByGroup = useMemo(() => {
    const filtered = areas.filter((a) =>
      areaQ === "" ||
      a.title.toLowerCase().includes(areaQ.toLowerCase()) ||
      a.purpose.toLowerCase().includes(areaQ.toLowerCase()) ||
      a.performs.join(" ").toLowerCase().includes(areaQ.toLowerCase()),
    );
    const groups = new Map<string, Area[]>();
    for (const a of filtered) {
      if (!groups.has(a.group)) groups.set(a.group, []);
      groups.get(a.group)!.push(a);
    }
    return Array.from(groups.entries());
  }, [areaQ]);

  const filteredTerms = useMemo(() => {
    return terms.filter((t) => {
      const matchCat = cat === "All" || t.category === cat;
      const matchQ =
        termQ === "" ||
        t.term.toLowerCase().includes(termQ.toLowerCase()) ||
        t.short.toLowerCase().includes(termQ.toLowerCase()) ||
        t.detail.toLowerCase().includes(termQ.toLowerCase());
      return matchCat && matchQ;
    });
  }, [termQ, cat]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <BookOpenCheck className="h-3.5 w-3.5" />
            Reference
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Knowledge Base</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            An in-depth guide to every area of this console and a searchable glossary of Dayshape,
            product, and professional-services terminology.
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="areas">Area guide · {areas.length}</TabsTrigger>
            <TabsTrigger value="terms">Terminology · {terms.length}</TabsTrigger>
          </TabsList>

          {/* AREAS */}
          <TabsContent value="areas" className="mt-4 space-y-4">
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search areas by name or purpose..."
                value={areaQ}
                onChange={(e) => setAreaQ(e.target.value)}
                className="pl-9"
              />
            </div>

            {areasByGroup.map(([group, items]) => (
              <div key={group} className="space-y-3">
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{group}</div>
                <div className="grid gap-3">
                  {items.map((a) => {
                    const Icon = a.icon;
                    return (
                      <motion.div
                        key={a.url}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">
                                    <Link to={a.url} className="hover:underline">
                                      {a.title}
                                    </Link>
                                  </CardTitle>
                                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{a.phase}</span>
                                    <span>·</span>
                                    <code className="text-[11px]">{a.url}</code>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-sm leading-relaxed">{a.purpose}</p>
                            <div>
                              <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">What it does</div>
                              <ul className="list-disc space-y-1 pl-5 text-sm">
                                {a.performs.map((p, i) => <li key={i}>{p}</li>)}
                              </ul>
                            </div>
                            <div className="grid gap-3 md:grid-cols-3">
                              <MetaBlock label="Inputs" items={a.inputs} />
                              <MetaBlock label="Outputs" items={a.outputs} />
                              <MetaBlock label="Used by" items={a.usedBy} />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* TERMS */}
          <TabsContent value="terms" className="mt-4 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative max-w-md flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search terms..."
                  value={termQ}
                  onChange={(e) => setTermQ(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs transition-colors",
                      cat === c
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card hover:bg-muted/50",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="ml-auto text-xs text-muted-foreground">
                {filteredTerms.length} of {terms.length}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {filteredTerms.map((t) => (
                <Card key={t.term}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-base font-semibold">{t.term}</div>
                      <Badge className={cn("shrink-0 text-[10px]", categoryTint[t.category])}>
                        {t.category}
                      </Badge>
                    </div>
                    <p className="mt-1.5 text-sm">{t.short}</p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t.detail}</p>
                  </CardContent>
                </Card>
              ))}
              {filteredTerms.length === 0 && (
                <Card className="md:col-span-2">
                  <CardContent className="p-8 text-center text-sm text-muted-foreground">
                    No terms match "{termQ}" in {cat}.
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function MetaBlock({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-md border bg-muted/20 p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <ul className="mt-1.5 space-y-1 text-xs">
        {items.map((it, i) => <li key={i}>· {it}</li>)}
      </ul>
    </div>
  );
}
