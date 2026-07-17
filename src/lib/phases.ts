export const PHASES = [
  { id: "handoff", label: "Handoff", icon: "ArrowRightLeft", color: "phase-handoff", description: "Sales-to-implementation transition, compliance program overview, and firm stakeholder alignment (CCO, Marketing Ops, IT)." },
  { id: "kickoff", label: "Discovery & Kickoff", icon: "Rocket", color: "phase-kickoff", description: "Regulatory scope, current-state advertising review workflow, disclosure library audit, and success criteria for the compliance rollout." },
  { id: "build", label: "Configure & Integrate", icon: "Hammer", color: "phase-build", description: "Review workflows, rules engine, disclosure templates, FINRA CRD/IARD, marketing systems, and archival integrations (Smarsh, Global Relay, Proofpoint)." },
  { id: "testing", label: "Test & Train", icon: "FlaskConical", color: "phase-testing", description: "UAT of advertising review scenarios, AI Review tuning, WORM / books-and-records validation, and compliance officer + marketing team enablement." },
  { id: "golive", label: "Go-Live", icon: "Zap", color: "phase-golive", description: "Cutover of the compliance review workflow, live advertising and disclosure reviews, and command-center supervision monitoring." },
  { id: "hypercare", label: "Adoption & Handover", icon: "HeartPulse", color: "phase-hypercare", description: "Post-launch review cycle-time reduction, AI Review acceptance tuning, first-pass approval uplift, and BAU handover to Customer Success." },
] as const;

export type PhaseId = typeof PHASES[number]["id"];
