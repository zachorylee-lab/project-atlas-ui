import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, AlertCircle, User, DollarSign, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const handoffs = [
  {
    customer: "Baker Tilly",
    ae: "Chris D.",
    deal: "$620K ARR · Core RM + AI Auto-Scheduler + Forecasting + Reporting",
    segment: "6,000 staff · Multi-region · Practice Engine + Workday",
    readiness: 94,
    status: "ready" as const,
    submitted: "Mar 22, 2026",
    items: { complete: 11, total: 12 },
    notes: "Migrating from spreadsheets + ProStaff. Multi-region rollout starting with US audit, then advisory.",
  },
  {
    customer: "Menzies",
    ae: "Amy L.",
    deal: "$210K ARR · Core RM + Forecasting",
    segment: "600 staff · UK · CCH Axcess",
    readiness: 67,
    status: "incomplete" as const,
    submitted: "Mar 20, 2026",
    items: { complete: 8, total: 12 },
    notes: "Need CCH Axcess API access confirmation and partner sign-off on service line hierarchy. Busy-season cutover forces aggressive build timeline.",
  },
  {
    customer: "Wolf & Company",
    ae: "Mark T.",
    deal: "$340K ARR · Full Suite + AI Auto-Scheduler + Analytics",
    segment: "700 staff · Firm-wide centralization · CCH Axcess",
    readiness: 100,
    status: "ready" as const,
    submitted: "Mar 18, 2026",
    items: { complete: 12, total: 12 },
    notes: "Strong sponsor (COO + Head of Resource Management). Legacy spreadsheet-based process being retired.",
  },
  {
    customer: "MHA",
    ae: "Jen S.",
    deal: "$280K ARR · Core RM + Forecasting",
    segment: "1,400 staff · UK multi-office · Utilization consistency focus",
    readiness: 42,
    status: "blocked" as const,
    submitted: "Mar 15, 2026",
    items: { complete: 5, total: 12 },
    notes: "MSA pending legal review. Executive sponsor changed mid-deal — re-confirming scope and pilot service line before kickoff.",
  },
];

const statusStyles = {
  ready: { label: "Ready", icon: CheckCircle2, classes: "bg-success/10 text-success" },
  incomplete: { label: "Incomplete", icon: Clock, classes: "bg-warning/10 text-warning" },
  blocked: { label: "Blocked", icon: AlertCircle, classes: "bg-destructive/10 text-destructive" },
};

const checklist = [
  "Signed order form / MSA in place",
  "Modules in scope confirmed (Core RM / AI Auto-Scheduler / Forecasting / Reporting)",
  "Service lines documented (Audit, Tax, Advisory, Consulting)",
  "HRIS identified (Workday / BambooHR / HiBob / SAP SuccessFactors)",
  "Practice management identified (CCH Axcess / Practice Engine / Thomson Reuters)",
  "Legacy resourcing tool documented (Retain / ProStaff / Deltek / spreadsheets)",
  "Pilot service line and phased rollout plan confirmed",
  "Executive sponsor (COO / Managing Partner / Head of RM) identified",
  "Success criteria & Time to First Schedule target confirmed",
  "Data / Privacy / IT contact identified (GDPR / SOC2 review)",
  "Dayshape Senior Implementation Consultant, Solution Consultant, and CSM assigned",
  "Firm kickoff scheduled",
];

export default function SalesHandoff() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold">Sales Handoff · Sales to Delivery</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage the transition from closed Dayshape deals to active firm implementations. All items must be complete before kickoff.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Pending Handoffs", value: "4", sub: "2 ready, 1 incomplete, 1 blocked" },
            { label: "Avg. Readiness", value: "76%", sub: "Target: 90% before kickoff" },
            { label: "Avg. Handoff Time", value: "3.2 days", sub: "From submission to acceptance" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="stat-card">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-semibold mt-2">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-semibold">Pending Handoffs</h2>
          {handoffs.map((handoff, i) => {
            const status = statusStyles[handoff.status];
            const StatusIcon = status.icon;
            return (
              <motion.div key={handoff.customer} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-sm font-semibold">{handoff.customer}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.classes}`}>
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1"><User className="h-3 w-3" />{handoff.ae}</span>
                          <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{handoff.deal}</span>
                          <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{handoff.segment}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{handoff.submitted}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{handoff.notes}</p>
                      </div>
                      <div className="shrink-0 w-48">
                        <p className="text-xs text-muted-foreground mb-1">Readiness Score</p>
                        <div className="flex items-center gap-2">
                          <Progress value={handoff.readiness} className="h-2 flex-1" />
                          <span className="text-sm font-semibold">{handoff.readiness}%</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {handoff.items.complete}/{handoff.items.total} items complete
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Handoff Checklist Standard</CardTitle>
              <p className="text-xs text-muted-foreground">All items must be complete before transitioning to Discovery & Kickoff phase.</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {checklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm py-1">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
