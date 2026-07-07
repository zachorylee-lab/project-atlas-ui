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

// Portfolio-wide time-to-value milestones across active Dayshape implementations.
export const portfolioMilestones: PortfolioMilestone[] = [
  { project: "Plante Moran", dm: "E. Cicero", milestone: "First Firm-Wide Schedule Published", owner: "L. Nguyen (RM Lead)", date: "Mar 22", daysOut: 2, status: "in-progress", note: "Audit + Tax + Advisory schedule for busy season in UAT" },
  { project: "Plante Moran", dm: "E. Cicero", milestone: "CSM Handover", owner: "E. Cicero → K. Park", date: "Apr 20", daysOut: 31, status: "upcoming", note: "Adoption exit + ROI readout; requires CSAT ≥ 4.5 and adoption ≥ 80%" },
  { project: "Wolf & Company", dm: "A. Piggott", milestone: "First Forecast Cycle", owner: "Wolf RM Team", date: "Mar 24", daysOut: 4, status: "in-progress", note: "3-year capacity forecast in partner review" },
  { project: "Wolf & Company", dm: "A. Piggott", milestone: "CSM Handover", owner: "A. Piggott → R. Singh", date: "Apr 5", daysOut: 16, status: "at-risk", note: "Depends on Partner sign-off and adoption gate" },
  { project: "Azets UK", dm: "A. Pereira", milestone: "Retain → Dayshape Migration", owner: "P. Osei (Data)", date: "Mar 30", daysOut: 10, status: "at-risk", note: "Legacy engagement history mapping ~10 days behind" },
  { project: "Azets UK", dm: "A. Pereira", milestone: "First Firm-Wide Schedule Published", owner: "Azets Resourcing", date: "Apr 18", daysOut: 29, status: "at-risk", note: "TTFS slipped; mitigation plan in flight" },
  { project: "Bennett Thrasher", dm: "S. Pickard", milestone: "CSM Handover", owner: "S. Pickard → J. Vega", date: "Mar 21", daysOut: 1, status: "in-progress", note: "Adoption exit tomorrow; utilization + realization gates met" },
  { project: "Baker Tilly", dm: "L. Martin", milestone: "Practice Engine Integrated", owner: "R. Patel (Solution Consultant)", date: "Apr 2", daysOut: 13, status: "upcoming", note: "Practice management sync + engagement master data" },
  { project: "Baker Tilly", dm: "L. Martin", milestone: "Resource Manager Enablement", owner: "L. Martin (SIC)", date: "Apr 16", daysOut: 27, status: "upcoming", note: "AI Auto-Scheduler workshop + knowledge check" },
  { project: "Baker Tilly", dm: "L. Martin", milestone: "Workday HCM Wired", owner: "J. Liu (Data)", date: "Apr 16", daysOut: 27, status: "upcoming" },
];

export const ttvKPIs = {
  avgTimeToFirstSchedule: 18,      // days to first published firm-wide schedule
  avgTimeToFirstForecast: 32,      // days to first forecast cycle
  milestonesOnTimePct: 87,
  milestonesAtRisk: portfolioMilestones.filter((m) => m.status === "at-risk").length,
  milestonesThisWeek: portfolioMilestones.filter((m) => m.daysOut >= 0 && m.daysOut <= 7).length,
  csmTransitionsQ2: 4,
  // Legacy aliases kept for compatibility with any older imports
  get avgTimeToFirstSend() { return this.avgTimeToFirstSchedule; },
  get avgTimeToFirstCanvas() { return this.avgTimeToFirstForecast; },
};
