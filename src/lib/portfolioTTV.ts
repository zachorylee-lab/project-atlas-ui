export type TTVStatus = "done" | "in-progress" | "upcoming" | "at-risk";

export type PortfolioMilestone = {
  project: string;
  dm: string;
  milestone: string;
  owner: string;
  date: string;
  daysOut: number;
  status: TTVStatus;
  note?: string;
};

// Portfolio-wide time-to-value milestones across active Red Oak implementations.
export const portfolioMilestones: PortfolioMilestone[] = [
  { project: "LEO Wealth", dm: "E. Cicero", milestone: "First Advertising Review Approved in Red Oak", owner: "L. Nguyen (CCO)", date: "Mar 22", daysOut: 2, status: "in-progress", note: "Marketing kit and quarterly performance report in reviewer UAT" },
  { project: "LEO Wealth", dm: "E. Cicero", milestone: "CSM Handover", owner: "E. Cicero → K. Park", date: "Apr 20", daysOut: 31, status: "upcoming", note: "Adoption exit + ROI readout; requires CSAT ≥ 4.5 and reviewer adoption ≥ 80%" },
  { project: "Raymond James", dm: "A. Piggott", milestone: "FINRA CRD/IARD Registration Sync Live", owner: "Raymond James IT", date: "Mar 24", daysOut: 4, status: "in-progress", note: "Nightly rep credential + branch OSJ sync in partner review" },
  { project: "Raymond James", dm: "A. Piggott", milestone: "CSM Handover", owner: "A. Piggott → R. Singh", date: "Apr 5", daysOut: 16, status: "at-risk", note: "Depends on CCO sign-off and reviewer adoption gate" },
  { project: "Northwestern Mutual", dm: "A. Pereira", milestone: "Legacy Review Tool → Red Oak Migration", owner: "P. Osei (Data)", date: "Mar 30", daysOut: 10, status: "at-risk", note: "5 years of legacy advertising review history + WORM archive mapping ~10 days behind" },
  { project: "Northwestern Mutual", dm: "A. Pereira", milestone: "First Firm-Wide Review Cutover", owner: "NM Compliance", date: "Apr 18", daysOut: 29, status: "at-risk", note: "TTFR slipped; mitigation plan in flight" },
  { project: "Cambridge Investment Research", dm: "S. Pickard", milestone: "CSM Handover", owner: "S. Pickard → J. Vega", date: "Mar 21", daysOut: 1, status: "in-progress", note: "Adoption exit tomorrow; first-pass approval + cycle-time gates met" },
  { project: "Franklin Templeton", dm: "L. Martin", milestone: "Marketo + Seismic Integrated", owner: "R. Patel (Solution Consultant)", date: "Apr 2", daysOut: 13, status: "upcoming", note: "Marketing automation + sales enablement content flow into review queue" },
  { project: "Franklin Templeton", dm: "L. Martin", milestone: "Compliance Reviewer Enablement", owner: "L. Martin (SIC)", date: "Apr 16", daysOut: 27, status: "upcoming", note: "AI Review acceptance workshop + reviewer knowledge check" },
  { project: "Franklin Templeton", dm: "L. Martin", milestone: "Smarsh Archival Wired (WORM)", owner: "J. Liu (Data)", date: "Apr 16", daysOut: 27, status: "upcoming" },
];

export const ttvKPIs = {
  avgTimeToFirstReview: 18,        // days to first live advertising review approved in Red Oak
  avgTimeToFirstApprovedPiece: 32, // days to first end-to-end approved marketing piece firm-wide
  milestonesOnTimePct: 87,
  milestonesAtRisk: portfolioMilestones.filter((m) => m.status === "at-risk").length,
  milestonesThisWeek: portfolioMilestones.filter((m) => m.daysOut >= 0 && m.daysOut <= 7).length,
  csmTransitionsQ2: 4,
  // Legacy aliases kept for compatibility with any older imports
  get avgTimeToFirstSchedule() { return this.avgTimeToFirstReview; },
  get avgTimeToFirstForecast() { return this.avgTimeToFirstApprovedPiece; },
  get avgTimeToFirstSend() { return this.avgTimeToFirstReview; },
  get avgTimeToFirstCanvas() { return this.avgTimeToFirstApprovedPiece; },
};
