export const PHASES = [
  { id: "handoff", label: "Handoff", icon: "ArrowRightLeft", color: "phase-handoff", description: "Sales-to-implementation transition, scope validation, and firm stakeholder alignment." },
  { id: "kickoff", label: "Discovery & Kickoff", icon: "Rocket", color: "phase-kickoff", description: "Charter, resource model discovery, timeline confirmation, and success criteria for the firm rollout." },
  { id: "build", label: "Configure & Integrate", icon: "Hammer", color: "phase-build", description: "Firm hierarchy, roles/grades, skills taxonomy, engagement templates, integrations, and data migration." },
  { id: "testing", label: "Test & Train", icon: "FlaskConical", color: "phase-testing", description: "UAT of scheduling scenarios, resource manager training, partner enablement, and pilot cutover." },
  { id: "golive", label: "Go-Live", icon: "Zap", color: "phase-golive", description: "Firm-wide activation, live scheduling cutover, monitoring, and command-center support." },
  { id: "hypercare", label: "Adoption & Handover", icon: "HeartPulse", color: "phase-hypercare", description: "Post-launch adoption, forecast accuracy tuning, utilization uplift, and BAU handover to Customer Success." },
] as const;

export type PhaseId = typeof PHASES[number]["id"];
