import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Users,
  Briefcase,
  TrendingUp,
  DollarSign,
  Shield,
  Layers,
  Target,
  GitBranch,
  Activity,
  Award,
  AlertTriangle,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const C = {
  navy: "hsl(220 30% 12%)",
  navyLight: "hsl(220 25% 18%)",
  teal: "hsl(172 66% 40%)",
  tealMuted: "hsl(172 40% 85%)",
  gold: "hsl(38 92% 55%)",
  rose: "hsl(355 75% 55%)",
  slate: "hsl(215 14% 50%)",
  offWhite: "hsl(210 20% 97%)",
  white: "#fff",
  border: "hsl(220 20% 88%)",
};

interface Slide {
  id: string;
  render: () => JSX.Element;
}

const SectionTag = ({ children }: { children: string }) => (
  <span
    className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em]"
    style={{ background: C.navy, color: C.white }}
  >
    {children}
  </span>
);

const Metric = ({ value, label, sub, color = C.teal }: { value: string; label: string; sub?: string; color?: string }) => (
  <div className="flex flex-col items-center gap-1 text-center">
    <span className="text-4xl font-bold" style={{ color }}>{value}</span>
    <span className="text-sm font-semibold" style={{ color: C.navy }}>{label}</span>
    {sub && <span className="text-xs" style={{ color: C.slate }}>{sub}</span>}
  </div>
);

const Bar = ({ label, pct, color = C.teal, suffix }: { label: string; pct: number; color?: string; suffix?: string }) => (
  <div className="flex items-center gap-3">
    <span className="w-36 text-right text-xs font-medium" style={{ color: C.slate }}>{label}</span>
    <div className="relative h-3 flex-1 rounded-full" style={{ background: C.border }}>
      <motion.div className="absolute inset-y-0 left-0 rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
    </div>
    <span className="w-14 text-xs font-semibold" style={{ color: C.navy }}>{pct}{suffix ?? "%"}</span>
  </div>
);

function SlideFrame({ tag, title, children }: { tag: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between px-10 pt-8 pb-4">
        <div className="flex flex-col gap-2">
          <SectionTag>{tag}</SectionTag>
          <h2 className="text-2xl font-bold" style={{ color: C.navy }}>{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: C.navy }}>
            <span className="text-xs font-bold text-white">R</span>
          </div>
        </div>
      </div>
      <div className="flex-1 px-10 pb-8 overflow-auto">{children}</div>
    </div>
  );
}

const slides: Slide[] = [
  {
    id: "title",
    render: () => (
      <div className="flex h-full flex-col" style={{ background: C.navy }}>
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="flex flex-col items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: C.teal }}>
                <span className="text-lg font-bold text-white">R</span>
              </div>
              <span className="text-lg font-semibold tracking-wide" style={{ color: C.tealMuted }}>RENTFLOW · DIRECTOR VIEW</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-white max-w-3xl">
              Director of Implementation
              <br />Operating Plan
            </h1>
            <div className="h-1 w-16 rounded-full" style={{ background: C.teal }} />
            <p className="max-w-xl text-base leading-relaxed" style={{ color: "hsl(210 14% 65%)" }}>
              Portfolio-level leadership of the implementation function — org design, delivery economics, operational systems, and executive accountability.
            </p>
          </motion.div>
        </div>
        <div className="flex items-center justify-between px-12 py-5 text-xs" style={{ color: "hsl(215 14% 40%)", borderTop: `1px solid hsl(220 20% 18%)` }}>
          <span>Prepared for [Executive Sponsor] · [Organization]</span>
          <span>Confidential · {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</span>
        </div>
      </div>
    ),
  },
  {
    id: "role-comparison",
    render: () => (
      <SlideFrame tag="Role Scope" title="Strategy & Implementation Lead vs. Director of Implementation">
        <div className="grid grid-cols-2 gap-6 h-full">
          <div className="rounded-xl border p-6" style={{ borderColor: C.border, background: C.offWhite }}>
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5" style={{ color: C.teal }} />
              <span className="text-sm font-bold uppercase tracking-wide" style={{ color: C.teal }}>Strategy & Implementation Lead</span>
            </div>
            <p className="text-xs mb-4" style={{ color: C.slate }}>Owns the success of individual customer implementations end-to-end.</p>
            <ul className="space-y-2 text-sm" style={{ color: C.navy }}>
              <li>• Single project P&L and timeline</li>
              <li>• Customer-facing delivery & change mgmt</li>
              <li>• Playbook execution per engagement</li>
              <li>• Risk log + steering for one client</li>
              <li>• Time-to-Value for the assigned account</li>
              <li>• 1–3 concurrent implementations</li>
            </ul>
          </div>
          <div className="rounded-xl p-6" style={{ background: C.navy }}>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5" style={{ color: C.gold }} />
              <span className="text-sm font-bold uppercase tracking-wide" style={{ color: C.gold }}>Director of Implementation</span>
            </div>
            <p className="text-xs mb-4" style={{ color: "hsl(210 14% 70%)" }}>Owns the implementation <em>function</em> — people, playbooks, economics, and executive reporting.</p>
            <ul className="space-y-2 text-sm text-white">
              <li>• Services P&L, margin, utilization</li>
              <li>• Hiring, ramp, performance mgmt</li>
              <li>• Playbook authorship & governance</li>
              <li>• Cross-functional ops (Sales↔CS↔Product)</li>
              <li>• Portfolio TTV, CSAT, scope variance</li>
              <li>• 20–60 concurrent implementations</li>
            </ul>
          </div>
        </div>
      </SlideFrame>
    ),
  },
  {
    id: "portfolio-kpis",
    render: () => (
      <SlideFrame tag="Portfolio KPIs" title="What the Director Reports to the Executive Team">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { v: "47", l: "Active Implementations", s: "across 6 phases", c: C.teal },
            { v: "38 days", l: "Avg Time to Value", s: "↓ 22% YoY", c: C.teal },
            { v: "4.7 / 5", l: "Implementation CSAT", s: "trailing 90 days", c: C.gold },
            { v: "62%", l: "Services Gross Margin", s: "target 60%", c: C.teal },
          ].map((m) => (
            <div key={m.l} className="rounded-xl border p-4 text-center" style={{ borderColor: C.border }}>
              <Metric value={m.v} label={m.l} sub={m.s} color={m.c} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-xl border p-5" style={{ borderColor: C.border }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: C.navy }}>Delivery Health</h3>
            <div className="space-y-3">
              <Bar label="On-Track Projects" pct={78} color={C.teal} />
              <Bar label="At-Risk Projects" pct={15} color={C.gold} />
              <Bar label="Delayed Projects" pct={7} color={C.rose} />
              <Bar label="Scope Variance (avg)" pct={9} color={C.gold} />
            </div>
          </div>
          <div className="rounded-xl border p-5" style={{ borderColor: C.border }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: C.navy }}>Team & Economics</h3>
            <div className="space-y-3">
              <Bar label="Billable Utilization" pct={74} color={C.teal} />
              <Bar label="Ramp Completion" pct={88} color={C.teal} />
              <Bar label="Attrition (TTM)" pct={6} color={C.gold} suffix="%" />
              <Bar label="Forecast Accuracy" pct={92} color={C.teal} />
            </div>
          </div>
        </div>
      </SlideFrame>
    ),
  },
  {
    id: "org-design",
    render: () => (
      <SlideFrame tag="Org & Team" title="Implementation Function — Org Design & Capacity Model">
        <div className="grid grid-cols-3 gap-5">
          {[
            { role: "Director of Implementation", count: "1", icon: Briefcase, span: "Function owner · P&L · Exec reporting" },
            { role: "Implementation Managers", count: "3", icon: Users, span: "Pod leads · 1:6 IC ratio · QBRs" },
            { role: "Strategy & Implementation Leads", count: "12", icon: Target, span: "End-to-end project ownership" },
            { role: "Implementation Analysts", count: "6", icon: Layers, span: "Data migration · config · QA" },
            { role: "Solutions Architect", count: "2", icon: GitBranch, span: "Integrations · technical escalations" },
            { role: "Implementation Ops / PMO", count: "2", icon: Activity, span: "Tooling · forecasting · playbooks" },
          ].map((r) => (
            <div key={r.role} className="rounded-xl border p-5" style={{ borderColor: C.border }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${C.teal}18`, color: C.teal }}>
                  <r.icon className="h-4 w-4" />
                </div>
                <span className="text-2xl font-bold" style={{ color: C.navy }}>{r.count}</span>
              </div>
              <p className="text-sm font-semibold" style={{ color: C.navy }}>{r.role}</p>
              <p className="text-xs mt-1" style={{ color: C.slate }}>{r.span}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl p-5 grid grid-cols-4 gap-6" style={{ background: C.offWhite }}>
          <div><p className="text-xs uppercase tracking-wide" style={{ color: C.slate }}>Total Headcount</p><p className="text-xl font-bold mt-1" style={{ color: C.navy }}>26</p></div>
          <div><p className="text-xs uppercase tracking-wide" style={{ color: C.slate }}>Capacity / Quarter</p><p className="text-xl font-bold mt-1" style={{ color: C.navy }}>22 launches</p></div>
          <div><p className="text-xs uppercase tracking-wide" style={{ color: C.slate }}>Avg Ramp to Solo</p><p className="text-xl font-bold mt-1" style={{ color: C.navy }}>10 weeks</p></div>
          <div><p className="text-xs uppercase tracking-wide" style={{ color: C.slate }}>Hiring Plan FY</p><p className="text-xl font-bold mt-1" style={{ color: C.navy }}>+8 FTE</p></div>
        </div>
      </SlideFrame>
    ),
  },
  {
    id: "operational-systems",
    render: () => (
      <SlideFrame tag="Operational Systems" title="The Machine Behind Every Implementation">
        <div className="grid grid-cols-2 gap-5">
          {[
            { t: "Playbook Governance", d: "Versioned, owner-attributed playbooks for each module (Rent Collection, Screening, Accounting, Maintenance). Quarterly review cycle.", icon: Layers },
            { t: "Tooling Stack Ownership", d: "CRM ↔ PSA ↔ Project tool ↔ Data warehouse. Director owns config, integrations, and license rationalization.", icon: GitBranch },
            { t: "Sales ↔ Implementation Handoff", d: "Standardized 0–100% readiness score, MEDDPICC sync, and joint pre-sales reviews on deals > $50k ARR.", icon: Activity },
            { t: "Implementation ↔ CS Transition", d: "Hypercare-to-CSM handoff at day 60 with health score, adoption baselines, and renewal-risk flags.", icon: Award },
            { t: "Forecasting & Capacity Planning", d: "Weekly bookings-to-staffing model. 6-week look-ahead drives hiring, contractor backstop, and pricing.", icon: TrendingUp },
            { t: "Quality & Compliance", d: "SOC 2 controls, data-migration QA gates, signed UAT artifacts retained per engagement.", icon: Shield },
          ].map((s) => (
            <div key={s.t} className="rounded-xl border p-5 flex gap-4" style={{ borderColor: C.border }}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: `${C.navy}10`, color: C.navy }}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: C.navy }}>{s.t}</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: C.slate }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </SlideFrame>
    ),
  },
  {
    id: "financial",
    render: () => (
      <SlideFrame tag="Services P&L" title="Implementation Economics — Director Ownership">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { v: "$4.8M", l: "Services Bookings TTM", s: "+34% YoY" },
            { v: "$3.0M", l: "Recognized Revenue", s: "62% margin" },
            { v: "$1.1M", l: "Cost of Delivery", s: "labor + tooling" },
            { v: "1.18x", l: "Influenced NRR", s: "vs 0.94x baseline" },
          ].map((m) => (
            <div key={m.l} className="rounded-xl p-4 text-center" style={{ background: C.navy }}>
              <p className="text-3xl font-bold" style={{ color: C.gold }}>{m.v}</p>
              <p className="text-xs font-semibold text-white mt-1">{m.l}</p>
              <p className="text-[11px] mt-0.5" style={{ color: "hsl(210 14% 70%)" }}>{m.s}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-xl border p-5" style={{ borderColor: C.border }}>
            <h3 className="text-sm font-bold mb-3" style={{ color: C.navy }}>Revenue Mix by Module</h3>
            <div className="space-y-3">
              <Bar label="Rent Collection" pct={42} color={C.teal} />
              <Bar label="Property Accounting" pct={26} color={C.teal} />
              <Bar label="Tenant Screening" pct={18} color={C.gold} />
              <Bar label="Maintenance" pct={14} color={C.gold} />
            </div>
          </div>
          <div className="rounded-xl border p-5" style={{ borderColor: C.border }}>
            <h3 className="text-sm font-bold mb-3" style={{ color: C.navy }}>Strategic Levers</h3>
            <ul className="space-y-2 text-sm" style={{ color: C.navy }}>
              <li>• Productize 80% of scope → fixed-fee margin lift</li>
              <li>• Partner-led delivery for SMB tier (gross margin +8 pts)</li>
              <li>• Self-serve onboarding for &lt; 200 unit portfolios</li>
              <li>• Expansion-services motion w/ CS (cross-sell modules)</li>
              <li>• Pricing review every 2 quarters tied to TTV data</li>
            </ul>
          </div>
        </div>
      </SlideFrame>
    ),
  },
  {
    id: "exec-cadence",
    render: () => (
      <SlideFrame tag="Executive Cadence" title="How the Director Drives Accountability">
        <div className="grid grid-cols-3 gap-5">
          {[
            { freq: "Weekly", t: "Portfolio Stand-up", d: "All ImpMgrs · red/yellow projects · capacity reslice · escalations to CRO/CPO." },
            { freq: "Bi-Weekly", t: "Cross-Functional Ops", d: "Sales, CS, Product, Finance · pipeline-to-staffing · roadmap input from delivery." },
            { freq: "Monthly", t: "Services Business Review", d: "P&L, margin, TTV, CSAT, scope variance · presented to CFO + CEO." },
            { freq: "Quarterly", t: "QBR + Playbook Review", d: "Customer outcomes synthesis · playbook v-bumps · hiring plan adjustments." },
            { freq: "Quarterly", t: "Board / Exec Snapshot", d: "Services contribution to ARR, NRR influence, capacity vs bookings outlook." },
            { freq: "Ad-hoc", t: "Strategic Account Steering", d: "Director joins steering for top-10 accounts · executive sponsor alignment." },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border p-5" style={{ borderColor: C.border }}>
              <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider mb-2" style={{ background: `${C.teal}20`, color: C.teal }}>{c.freq}</span>
              <p className="text-sm font-bold" style={{ color: C.navy }}>{c.t}</p>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: C.slate }}>{c.d}</p>
            </div>
          ))}
        </div>
      </SlideFrame>
    ),
  },
  {
    id: "risk-portfolio",
    render: () => (
      <SlideFrame tag="Portfolio Risk" title="Function-Level Risk Register (Director Owned)">
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>
          <table className="w-full text-xs">
            <thead style={{ background: C.offWhite }}>
              <tr>
                {["ID", "Risk", "Impact", "Mitigation", "Owner", "Status"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-semibold" style={{ color: C.navy }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { id: "P-01", r: "Capacity gap in Q3 vs bookings forecast", i: "High", m: "Hire 4 FTE by July; 2 contractor partners on standby", o: "Director", s: "Mitigated", sc: C.teal },
                { id: "P-02", r: "Scope variance trending +12% on enterprise deals", i: "High", m: "Pre-sales joint scoping; tighter SOW templates", o: "Director + CRO", s: "Open", sc: C.rose },
                { id: "P-03", r: "Yardi integration complexity slowing TTV", i: "Medium", m: "Solutions Architect dedicated; reusable connector v2", o: "Sol. Arch", s: "Monitoring", sc: C.gold },
                { id: "P-04", r: "Playbook drift across pods", i: "Medium", m: "PMO-led monthly audit; central playbook repo", o: "PMO", s: "Mitigated", sc: C.teal },
                { id: "P-05", r: "Attrition risk on senior leads (comp benchmark)", i: "High", m: "Comp band review; promotion ladder published", o: "Director + People", s: "Open", sc: C.rose },
                { id: "P-06", r: "CSAT dip during Hypercare → CS handoff", i: "Medium", m: "Joint 30-day handoff plan; shared health scorecard", o: "Director + VP CS", s: "Monitoring", sc: C.gold },
              ].map((r) => (
                <tr key={r.id} className="border-t" style={{ borderColor: C.border }}>
                  <td className="px-3 py-2 font-mono text-[11px]" style={{ color: C.slate }}>{r.id}</td>
                  <td className="px-3 py-2" style={{ color: C.navy }}>{r.r}</td>
                  <td className="px-3 py-2"><span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: r.i === "High" ? `${C.rose}20` : `${C.gold}20`, color: r.i === "High" ? C.rose : C.gold }}>{r.i}</span></td>
                  <td className="px-3 py-2" style={{ color: C.slate }}>{r.m}</td>
                  <td className="px-3 py-2" style={{ color: C.navy }}>{r.o}</td>
                  <td className="px-3 py-2"><span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: `${r.sc}20`, color: r.sc }}>{r.s}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SlideFrame>
    ),
  },
  {
    id: "first-90",
    render: () => (
      <SlideFrame tag="First 90 Days" title="Director of Implementation — Onboarding Plan">
        <div className="grid grid-cols-3 gap-5">
          {[
            { d: "Days 0–30", t: "Listen & Diagnose", c: C.teal, items: ["Shadow 5 active implementations across pods", "Audit P&L, margin, utilization, forecast accuracy", "1:1 w/ every team member + Sales, CS, Product, Finance", "Baseline TTV, CSAT, scope variance"] },
            { d: "Days 31–60", t: "Stabilize & Standardize", c: C.gold, items: ["Publish v1 portfolio scorecard to exec team", "Tighten Sales↔Implementation handoff gates", "Codify pod operating rhythm + escalation paths", "Address top-2 capacity / attrition risks"] },
            { d: "Days 61–90", t: "Scale & Strategize", c: C.navy, items: ["Approve FY hiring plan & comp bands", "Launch productized scope tier (fixed-fee SMB)", "Stand up partner-delivery program", "Present 12-month services strategy to board"] },
          ].map((p) => (
            <div key={p.d} className="rounded-xl border p-5" style={{ borderColor: C.border }}>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: p.c }}>{p.d}</span>
              <p className="text-lg font-bold mt-1" style={{ color: C.navy }}>{p.t}</p>
              <ul className="mt-3 space-y-2 text-xs" style={{ color: C.slate }}>
                {p.items.map((i) => <li key={i} className="flex gap-2"><span style={{ color: p.c }}>›</span>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl p-5 flex items-center justify-between" style={{ background: C.navy }}>
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6" style={{ color: C.gold }} />
            <div>
              <p className="text-sm font-bold text-white">Outcome by Day 90</p>
              <p className="text-xs" style={{ color: "hsl(210 14% 70%)" }}>A measurable, forecastable, scalable implementation function — reporting to the executive team with confidence.</p>
            </div>
          </div>
        </div>
      </SlideFrame>
    ),
  },
  {
    id: "close",
    render: () => (
      <div className="flex h-full flex-col" style={{ background: C.navy }}>
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="flex flex-col items-center gap-5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: C.tealMuted }}>Director of Implementation</span>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white max-w-2xl">From delivering projects to running a delivery business.</h1>
            <div className="h-1 w-16 rounded-full" style={{ background: C.gold }} />
            <p className="max-w-lg text-base leading-relaxed" style={{ color: "hsl(210 14% 65%)" }}>
              Strategy & Implementation Leads ship customers. The Director ships the system that ships customers — predictably, profitably, at scale.
            </p>
          </motion.div>
        </div>
        <div className="flex items-center justify-between px-12 py-5 text-xs" style={{ color: "hsl(215 14% 40%)", borderTop: `1px solid hsl(220 20% 18%)` }}>
          <span>rentflow.io</span>
          <span>Confidential</span>
        </div>
      </div>
    ),
  },
];

export default function DirectorDeck() {
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const total = slides.length;

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, total - 1)), [total]);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "f" || e.key === "F") setFullscreen((f) => !f);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const containerClass = fullscreen ? "fixed inset-0 z-50 flex flex-col bg-black" : "flex h-screen flex-col";

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between px-4 py-2 shrink-0" style={{ background: fullscreen ? "hsl(220 30% 8%)" : C.offWhite, borderBottom: fullscreen ? "none" : `1px solid ${C.border}` }}>
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md" style={{ background: C.navy }}>
            <span className="text-xs font-bold text-white">R</span>
          </div>
          <span className="text-sm font-semibold" style={{ color: fullscreen ? C.white : C.navy }}>Director of Implementation Deck</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: C.slate }}>{current + 1} / {total}</span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setFullscreen((f) => !f)}>
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center overflow-hidden" style={{ background: fullscreen ? "black" : "hsl(220 15% 94%)" }}>
        {!fullscreen && (
          <div className="absolute left-0 top-0 bottom-0 w-[140px] overflow-y-auto py-4 px-3 flex flex-col gap-2 shrink-0" style={{ background: C.offWhite, borderRight: `1px solid ${C.border}` }}>
            {slides.map((s, i) => (
              <button key={s.id} onClick={() => setCurrent(i)} className="relative w-full rounded-md overflow-hidden transition-all" style={{ aspectRatio: "16/9", border: i === current ? `2px solid ${C.navy}` : `1px solid ${C.border}`, opacity: i === current ? 1 : 0.6 }}>
                <div className="absolute inset-0 scale-[0.18] origin-top-left" style={{ width: "556%", height: "556%" }}>{s.render()}</div>
              </button>
            ))}
          </div>
        )}

        <div className="relative" style={{ width: fullscreen ? "min(100vw, 177.78vh)" : "calc(100% - 180px)", maxWidth: fullscreen ? undefined : "960px", aspectRatio: "16/9", marginLeft: fullscreen ? 0 : "140px" }}>
          <AnimatePresence mode="wait">
            <motion.div key={current} className="absolute inset-0 rounded-lg overflow-hidden shadow-xl" style={{ border: fullscreen ? "none" : `1px solid ${C.border}` }} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              {slides[current].render()}
            </motion.div>
          </AnimatePresence>
        </div>

        <button onClick={prev} disabled={current === 0} className="absolute top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur shadow disabled:opacity-30 transition" style={{ left: fullscreen ? 16 : 156 }}>
          <ChevronLeft className="h-5 w-5" style={{ color: C.navy }} />
        </button>
        <button onClick={next} disabled={current === total - 1} className="absolute right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur shadow disabled:opacity-30 transition">
          <ChevronRight className="h-5 w-5" style={{ color: C.navy }} />
        </button>
      </div>

      <div className="h-1 shrink-0" style={{ background: C.border }}>
        <motion.div className="h-full" style={{ background: C.navy }} animate={{ width: `${((current + 1) / total) * 100}%` }} transition={{ duration: 0.3 }} />
      </div>
    </div>
  );
}
