export const PHASES = [
  { id: "handoff", label: "Handoff", icon: "ArrowRightLeft", color: "phase-handoff", description: "Sales-to-implementation transition, requirements validation, and stakeholder alignment." },
  { id: "kickoff", label: "Kickoff", icon: "Rocket", color: "phase-kickoff", description: "Project charter, timeline confirmation, team introductions, and success criteria definition." },
  { id: "build", label: "Build", icon: "Hammer", color: "phase-build", description: "Configuration, integrations, data migration, and custom development work." },
  { id: "testing", label: "Testing", icon: "FlaskConical", color: "phase-testing", description: "UAT, regression testing, performance validation, and sign-off procedures." },
  { id: "golive", label: "Go-Live", icon: "Zap", color: "phase-golive", description: "Deployment, cutover activities, monitoring, and initial support escalation." },
  { id: "hypercare", label: "Hypercare", icon: "HeartPulse", color: "phase-hypercare", description: "Post-launch support, issue resolution, optimization, and transition to BAU." },
] as const;

export type PhaseId = typeof PHASES[number]["id"];
