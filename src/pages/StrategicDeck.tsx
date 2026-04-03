import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  TrendingUp,
  Target,
  Zap,
  Shield,
  BarChart3,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  Layers,
  ArrowUpRight,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const C = {
  navy: "hsl(220 30% 12%)",
  navyLight: "hsl(220 25% 18%)",
  teal: "hsl(172 66% 40%)",
  tealMuted: "hsl(172 40% 85%)",
  gold: "hsl(38 92% 55%)",
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
    style={{ background: C.teal, color: C.white }}
  >
    {children}
  </span>
);

const Metric = ({ value, label, sub }: { value: string; label: string; sub?: string }) => (
  <div className="flex flex-col items-center gap-1 text-center">
    <span className="text-4xl font-bold" style={{ color: C.teal }}>{value}</span>
    <span className="text-sm font-semibold" style={{ color: C.navy }}>{label}</span>
    {sub && <span className="text-xs" style={{ color: C.slate }}>{sub}</span>}
  </div>
);

const IconCircle = ({ icon: Icon, color = C.teal }: { icon: React.ElementType; color?: string }) => (
  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: `${color}18`, color }}>
    <Icon className="h-5 w-5" />
  </div>
);

const Bar = ({ label, pct, color = C.teal }: { label: string; pct: number; color?: string }) => (
  <div className="flex items-center gap-3">
    <span className="w-28 text-right text-xs font-medium" style={{ color: C.slate }}>{label}</span>
    <div className="relative h-3 flex-1 rounded-full" style={{ background: C.border }}>
      <motion.div className="absolute inset-y-0 left-0 rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
    </div>
    <span className="w-10 text-xs font-semibold" style={{ color: C.navy }}>{pct}%</span>
  </div>
);

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
              <span className="text-lg font-semibold tracking-wide" style={{ color: C.tealMuted }}>RENTFLOW</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-white max-w-2xl">
              Rental Finance
              <br />Transformation
            </h1>
            <div className="h-1 w-16 rounded-full" style={{ background: C.teal }} />
            <p className="max-w-lg text-base leading-relaxed" style={{ color: "hsl(210 14% 65%)" }}>
              A data-driven framework for modernizing rent collection, tenant financial services, and property management operations.
            </p>
          </motion.div>
        </div>
        <div className="flex items-center justify-between px-12 py-5 text-xs" style={{ color: "hsl(215 14% 40%)", borderTop: `1px solid hsl(220 20% 18%)` }}>
          <span>Prepared for David Chen · Pinnacle Real Estate Group</span>
          <span>Confidential · {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</span>
        </div>
      </div>
    ),
  },
  {
    id: "exec-summary",
    render: () => (
      <SlideFrame tag="Executive Summary" title="The Opportunity at a Glance">
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { v: "96%", l: "Collection Rate", s: "vs. 89% industry avg" },
            { v: "3 days", l: "Time to First Rent", s: "after tenant move-in" },
            { v: "72%", l: "Autopay Adoption", s: "within 90 days" },
            { v: "$0", l: "NSF Losses", s: "with smart verification" },
          ].map((m) => (
            <div key={m.l} className="rounded-xl border p-5 text-center" style={{ borderColor: C.border }}>
              <Metric value={m.v} label={m.l} sub={m.s} />
            </div>
          ))}
        </div>
        <div className="rounded-xl p-6" style={{ background: `hsl(220 25% 10% / 0.04)` }}>
          <p className="text-sm leading-relaxed" style={{ color: C.slate }}>
            RentFlow transforms fragmented rent collection into a unified, automated financial platform. By combining smart payment routing, real-time verification, and tenant-friendly payment options, we help property managers collect rent faster while giving tenants modern financial tools they expect.
          </p>
        </div>
      </SlideFrame>
    ),
  },
  {
    id: "problem",
    render: () => (
      <SlideFrame tag="Context" title="The Rental Finance Challenge">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: C.navy }}>Industry Pain Points</h3>
            {[
              { icon: Clock, text: "Manual rent collection leads to 11% average delinquency rates" },
              { icon: Users, text: "Tenants expect digital payment options — 78% prefer online payments" },
              { icon: DollarSign, text: "NSF fees and failed payments cost PMs $500+ per unit annually" },
              { icon: Layers, text: "Disconnected accounting creates month-end reconciliation nightmares" },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <IconCircle icon={item.icon} color="hsl(0 72% 51%)" />
                <p className="text-sm leading-relaxed pt-2" style={{ color: C.slate }}>{item.text}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: C.navy }}>RentFlow Differentiation</h3>
            {[
              { icon: Zap, text: "Automated ACH with smart retry logic and balance pre-checks" },
              { icon: Target, text: "Tenant credit building — report on-time payments to bureaus" },
              { icon: BarChart3, text: "Real-time collection dashboards across entire portfolio" },
              { icon: Shield, text: "Built-in compliance for security deposits and trust accounting" },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <IconCircle icon={item.icon} color={C.teal} />
                <p className="text-sm leading-relaxed pt-2" style={{ color: C.slate }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </SlideFrame>
    ),
  },
  {
    id: "framework",
    render: () => (
      <SlideFrame tag="Strategic Framework" title="6-Phase Onboarding Model">
        <div className="grid grid-cols-6 gap-3">
          {[
            { phase: "Handoff", color: "hsl(199 89% 48%)", pct: 100 },
            { phase: "Kickoff", color: "hsl(262 52% 55%)", pct: 88 },
            { phase: "Build", color: "hsl(172 66% 40%)", pct: 72 },
            { phase: "Testing", color: "hsl(38 92% 50%)", pct: 55 },
            { phase: "Go-Live", color: "hsl(152 60% 40%)", pct: 40 },
            { phase: "Hypercare", color: "hsl(340 65% 50%)", pct: 25 },
          ].map((p) => (
            <motion.div key={p.phase} className="flex flex-col items-center gap-3 rounded-xl border p-4" style={{ borderColor: C.border }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: p.color }}>{p.pct}%</div>
              <span className="text-xs font-semibold" style={{ color: C.navy }}>{p.phase}</span>
              <div className="h-1 w-full rounded-full" style={{ background: C.border }}>
                <div className="h-full rounded-full" style={{ background: p.color, width: `${p.pct}%` }} />
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { title: "Standardise", desc: "Codify PM onboarding into repeatable templates per portfolio size." },
            { title: "Automate", desc: "Trigger payment activation, tenant invites, and compliance checks automatically." },
            { title: "Measure", desc: "Track collection rates, tenant adoption, and time-to-first-payment in real time." },
          ].map((c) => (
            <div key={c.title} className="rounded-lg p-4" style={{ background: `hsl(172 66% 40% / 0.06)` }}>
              <h4 className="text-sm font-bold mb-1" style={{ color: C.teal }}>{c.title}</h4>
              <p className="text-xs leading-relaxed" style={{ color: C.slate }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </SlideFrame>
    ),
  },
  {
    id: "metrics",
    render: () => (
      <SlideFrame tag="Performance Data" title="Rental Finance Metrics That Matter">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: C.navy }}>Collection Performance</h3>
            <Bar label="On-Time Rate" pct={96} />
            <Bar label="Autopay" pct={72} />
            <Bar label="Digital Adopt." pct={88} color={C.gold} />
            <Bar label="Tenant Sat." pct={91} />
            <Bar label="NSF Recovery" pct={94} />
            <Bar label="Owner Payout" pct={99} />
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: C.navy }}>Business Impact</h3>
            {[
              { metric: "Collection Rate", value: "96%", delta: "+7pp", up: true },
              { metric: "Time to First Rent", value: "3 days", delta: "−8 days", up: true },
              { metric: "PM Operating Cost", value: "$42/unit", delta: "−34%", up: true },
              { metric: "Tenant Delinquency", value: "4.2%", delta: "−6.8pp", up: true },
              { metric: "Annual Revenue/PM", value: "$2.1M", delta: "+45%", up: true },
            ].map((row) => (
              <div key={row.metric} className="flex items-center justify-between rounded-lg border px-4 py-3" style={{ borderColor: C.border }}>
                <span className="text-sm font-medium" style={{ color: C.navy }}>{row.metric}</span>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold" style={{ color: C.navy }}>{row.value}</span>
                  <span className="flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: `hsl(152 60% 40% / 0.1)`, color: `hsl(152 60% 40%)` }}>
                    <ArrowUpRight className="h-3 w-3" />{row.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SlideFrame>
    ),
  },
  {
    id: "roadmap",
    render: () => (
      <SlideFrame tag="Execution Plan" title="90-Day Portfolio Onboarding Roadmap">
        <div className="relative flex gap-6">
          {[
            {
              q: "Days 1–30", title: "Foundation", color: "hsl(199 89% 48%)",
              items: ["Audit current rent collection processes", "Migrate property and tenant data", "Configure payment gateways and bank accounts", "Train PM staff on RentFlow platform"],
            },
            {
              q: "Days 31–60", title: "Activation", color: C.teal,
              items: ["Launch tenant payment portal", "Enable autopay enrollment campaigns", "Activate late fee automation", "Begin credit reporting for tenants"],
            },
            {
              q: "Days 61–90", title: "Optimization", color: C.gold,
              items: ["Analyze collection patterns and optimize timing", "Roll out tenant financial wellness features", "Implement predictive delinquency scoring", "Publish portfolio performance reports"],
            },
          ].map((phase, i) => (
            <motion.div key={phase.q} className="flex-1 rounded-xl border p-5" style={{ borderColor: C.border, borderTop: `3px solid ${phase.color}` }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: phase.color }}>{phase.q}</span>
              <h4 className="mt-1 text-base font-bold" style={{ color: C.navy }}>{phase.title}</h4>
              <ul className="mt-3 flex flex-col gap-2">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: C.slate }}>
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: phase.color }} />{item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </SlideFrame>
    ),
  },
  {
    id: "financials",
    render: () => (
      <SlideFrame tag="Financial Model" title="Projected Impact Over 12 Months">
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { v: "$1.2M", l: "Additional Collections", s: "From reduced delinquency" },
            { v: "$480K", l: "Cost Savings", s: "Automated operations" },
            { v: "5.8×", l: "ROI", s: "Year 1 return" },
          ].map((m) => (
            <div key={m.l} className="flex flex-col items-center gap-2 rounded-xl p-6" style={{ background: C.navy, color: C.white }}>
              <span className="text-3xl font-bold" style={{ color: C.teal }}>{m.v}</span>
              <span className="text-sm font-semibold">{m.l}</span>
              <span className="text-xs" style={{ color: "hsl(215 14% 55%)" }}>{m.s}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: C.navy }}>Cost Per Unit Shift</h3>
            <Bar label="Before" pct={100} color="hsl(215 14% 70%)" />
            <div className="h-2" />
            <Bar label="After RentFlow" pct={66} color={C.teal} />
            <p className="mt-2 text-xs" style={{ color: C.slate }}>34% reduction in per-unit operating cost while increasing collection rates by 7 points.</p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: C.navy }}>Revenue Impact Model</h3>
            {[
              { label: "Reduced delinquency", value: "+$640K" },
              { label: "Lower processing costs", value: "+$280K" },
              { label: "Tenant retention uplift", value: "+$320K" },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between border-b py-2.5" style={{ borderColor: C.border }}>
                <span className="text-sm" style={{ color: C.slate }}>{r.label}</span>
                <span className="text-sm font-bold" style={{ color: C.teal }}>{r.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3">
              <span className="text-sm font-bold" style={{ color: C.navy }}>Total Impact</span>
              <span className="text-lg font-bold" style={{ color: C.teal }}>$1.24M</span>
            </div>
          </div>
        </div>
      </SlideFrame>
    ),
  },
  {
    id: "risk",
    render: () => (
      <SlideFrame tag="Risk Mitigation" title="Proactive Risk Management">
        <div className="grid grid-cols-2 gap-6">
          {[
            { risk: "Tenant Adoption Resistance", impact: "High", mitigation: "Phased rollout with incentives (waived convenience fees for first 3 months). In-app onboarding tutorials and 24/7 support.", color: "hsl(0 72% 51%)" },
            { risk: "Payment Processing Failures", impact: "Medium", mitigation: "Pre-built retry logic with smart scheduling. Balance pre-checks via Plaid before ACH initiation.", color: C.gold },
            { risk: "Data Migration Complexity", impact: "Medium", mitigation: "Pre-built connectors for AppFolio, Buildium, and Yardi. Dedicated migration sprint with balance reconciliation gates.", color: C.gold },
            { risk: "Regulatory Compliance", impact: "High", mitigation: "Built-in security deposit tracking per state requirements. Automated trust accounting and audit trails.", color: "hsl(0 72% 51%)" },
          ].map((r) => (
            <div key={r.risk} className="rounded-xl border p-5" style={{ borderColor: C.border, borderLeft: `3px solid ${r.color}` }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold" style={{ color: C.navy }}>{r.risk}</h4>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" style={{ background: `${r.color}15`, color: r.color }}>{r.impact}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: C.slate }}>{r.mitigation}</p>
            </div>
          ))}
        </div>
      </SlideFrame>
    ),
  },
  {
    id: "next-steps",
    render: () => (
      <div className="flex h-full flex-col" style={{ background: C.navy }}>
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6">
            <SectionTag>Next Steps</SectionTag>
            <h2 className="text-4xl font-bold text-white max-w-xl leading-tight">Let's Modernize Your Rent Collection</h2>
            <div className="h-1 w-16 rounded-full" style={{ background: C.teal }} />
            <div className="grid grid-cols-3 gap-6 mt-4 max-w-2xl">
              {[
                { step: "1", title: "Portfolio Review", desc: "Map current collection processes & identify quick wins" },
                { step: "2", title: "Pilot Launch", desc: "Deploy with 2-3 properties to validate impact" },
                { step: "3", title: "Full Rollout", desc: "Scale across entire portfolio with proven playbook" },
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold" style={{ background: C.teal, color: C.white }}>{s.step}</div>
                  <h4 className="text-sm font-semibold text-white">{s.title}</h4>
                  <p className="text-xs" style={{ color: "hsl(215 14% 55%)" }}>{s.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm" style={{ color: "hsl(210 14% 65%)" }}>
              David — we'd love to walk through a live demo tailored to Pinnacle's portfolio.
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

function SlideFrame({ tag, title, children }: { tag: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between px-10 pt-8 pb-4">
        <div className="flex flex-col gap-2">
          <SectionTag>{tag}</SectionTag>
          <h2 className="text-2xl font-bold" style={{ color: C.navy }}>{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: C.teal }}>
            <span className="text-xs font-bold text-white">R</span>
          </div>
        </div>
      </div>
      <div className="flex-1 px-10 pb-8 overflow-auto">{children}</div>
    </div>
  );
}

export default function StrategicDeck() {
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
          <div className="flex h-7 w-7 items-center justify-center rounded-md" style={{ background: C.teal }}>
            <span className="text-xs font-bold text-white">R</span>
          </div>
          <span className="text-sm font-semibold" style={{ color: fullscreen ? C.white : C.navy }}>Rental Finance Transformation Deck</span>
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
              <button key={s.id} onClick={() => setCurrent(i)} className="relative w-full rounded-md overflow-hidden transition-all" style={{ aspectRatio: "16/9", border: i === current ? `2px solid ${C.teal}` : `1px solid ${C.border}`, opacity: i === current ? 1 : 0.6 }}>
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

        <button onClick={prev} disabled={current === 0} className="absolute left-[156px] top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur shadow disabled:opacity-30 transition" style={{ left: fullscreen ? 16 : 156 }}>
          <ChevronLeft className="h-5 w-5" style={{ color: C.navy }} />
        </button>
        <button onClick={next} disabled={current === total - 1} className="absolute right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur shadow disabled:opacity-30 transition">
          <ChevronRight className="h-5 w-5" style={{ color: C.navy }} />
        </button>
      </div>

      <div className="h-1 shrink-0" style={{ background: C.border }}>
        <motion.div className="h-full" style={{ background: C.teal }} animate={{ width: `${((current + 1) / total) * 100}%` }} transition={{ duration: 0.3 }} />
      </div>
    </div>
  );
}
