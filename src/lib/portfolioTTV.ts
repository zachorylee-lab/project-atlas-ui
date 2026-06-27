export type TTVStatus = "done" | "in-progress" | "upcoming" | "at-risk";

export type PortfolioMilestone = {
  project: string;
  dm: string;
  milestone: string;
  owner: string;
  date: string;        // display label
  daysOut: number;     // negative = overdue, 0 = today, positive = future
  status: TTVStatus;
  note?: string;
};

// Portfolio-wide TTV milestones (sourced from project detail timelines).
export const portfolioMilestones: PortfolioMilestone[] = [
  { project: "Wyndham Hotels", dm: "E. Cicero", milestone: "First Canvas Live", owner: "L. Nguyen (Strategy)", date: "Mar 22", daysOut: 2, status: "in-progress", note: "4-step welcome → tier-up → win-back in QA" },
  { project: "Wyndham Hotels", dm: "E. Cicero", milestone: "CSM Transition", owner: "E. Cicero → K. Park", date: "Apr 20", daysOut: 31, status: "upcoming", note: "Hypercare exit + ROI readout" },
  { project: "MetLife", dm: "A. Piggott", milestone: "First Production Send", owner: "MetLife Lifecycle", date: "Mar 24", daysOut: 4, status: "in-progress", note: "Policy renewal email in compliance review" },
  { project: "MetLife", dm: "A. Piggott", milestone: "CSM Transition", owner: "A. Piggott → R. Singh", date: "Apr 5", daysOut: 16, status: "at-risk", note: "Depends on compliance sign-off" },
  { project: "Max Streaming", dm: "A. Pereira", milestone: "Iterable→Braze Migration", owner: "P. Osei (OE)", date: "Mar 30", daysOut: 10, status: "at-risk", note: "Content library mapping ~10 days behind" },
  { project: "Max Streaming", dm: "A. Pereira", milestone: "First Production Send", owner: "Max Lifecycle", date: "Apr 18", daysOut: 29, status: "at-risk", note: "TTFS slipped; mitigation plan in flight" },
  { project: "Delivery Hero", dm: "S. Pickard", milestone: "CSM Transition", owner: "S. Pickard → J. Vega", date: "Mar 21", daysOut: 1, status: "in-progress", note: "Hypercare exit tomorrow" },
  { project: "Canva Pro", dm: "L. Martin", milestone: "SDK Integrated", owner: "R. Patel (TA)", date: "Apr 2", daysOut: 13, status: "upcoming", note: "iOS + Web SDK kickoff" },
  { project: "Canva Pro", dm: "L. Martin", milestone: "Segment CDP Wired", owner: "J. Liu (OE)", date: "Apr 16", daysOut: 27, status: "upcoming" },
];

export const ttvKPIs = {
  avgTimeToFirstSend: 18,       // days
  avgTimeToFirstCanvas: 32,     // days
  milestonesOnTimePct: 87,
  milestonesAtRisk: portfolioMilestones.filter((m) => m.status === "at-risk").length,
  milestonesThisWeek: portfolioMilestones.filter((m) => m.daysOut >= 0 && m.daysOut <= 7).length,
  csmTransitionsQ2: 4,
};
