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
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  Layers,
  GitBranch,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── colour tokens (BCG-inspired navy / teal / warm grey) ─── */
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

/* ─── slide data ─── */
interface Slide {
  id: string;
  render: () => JSX.Element;
}

/* ─── small reusable pieces ─── */
const SectionTag = ({ children }: { children: string }) => (
  <span
    className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em]"
    style={{ background: C.teal, color: C.white }}
  >
    {children}
  </span>
);

const Metric = ({
  value,
  label,
  sub,
}: {
  value: string;
  label: string;
  sub?: string;
}) => (
  <div className="flex flex-col items-center gap-1 text-center">
    <span className="text-4xl font-bold" style={{ color: C.teal }}>
      {value}
    </span>
    <span className="text-sm font-semibold" style={{ color: C.navy }}>
      {label}
    </span>
    {sub && (
      <span className="text-xs" style={{ color: C.slate }}>
        {sub}
      </span>
    )}
  </div>
);

const IconCircle = ({
  icon: Icon,
  color = C.teal,
}: {
  icon: React.ElementType;
  color?: string;
}) => (
  <div
    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
    style={{ background: `${color}18`, color }}
  >
    <Icon className="h-5 w-5" />
  </div>
);

const Bar = ({
  label,
  pct,
  color = C.teal,
}: {
  label: string;
  pct: number;
  color?: string;
}) => (
  <div className="flex items-center gap-3">
    <span className="w-28 text-right text-xs font-medium" style={{ color: C.slate }}>
      {label}
    </span>
    <div className="relative h-3 flex-1 rounded-full" style={{ background: C.border }}>
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
    <span className="w-10 text-xs font-semibold" style={{ color: C.navy }}>
      {pct}%
    </span>
  </div>
);

/* ─── SLIDES ─── */

const slides: Slide[] = [
  /* 1 ─ Title */
  {
    id: "title",
    render: () => (
      <div className="flex h-full flex-col" style={{ background: C.navy }}>
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center gap-5"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: C.teal }}
              >
                <span className="text-lg font-bold text-white">V</span>
              </div>
              <span
                className="text-lg font-semibold tracking-wide"
                style={{ color: C.tealMuted }}
              >
                VELOCITY
              </span>
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-white max-w-2xl">
              Strategic Optimization
              <br />& Scaling
            </h1>

            <div className="h-1 w-16 rounded-full" style={{ background: C.teal }} />

            <p className="max-w-lg text-base leading-relaxed" style={{ color: "hsl(210 14% 65%)" }}>
              A data-driven framework for accelerating customer implementation
              velocity and operational excellence.
            </p>
          </motion.div>
        </div>
        <div
          className="flex items-center justify-between px-12 py-5 text-xs"
          style={{ color: "hsl(215 14% 40%)", borderTop: `1px solid hsl(220 20% 18%)` }}
        >
          <span>Prepared for Rob Whiting · Boom</span>
          <span>Confidential · {new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</span>
        </div>
      </div>
    ),
  },

  /* 2 ─ Executive Summary */
  {
    id: "exec-summary",
    render: () => (
      <SlideFrame tag="Executive Summary" title="The Opportunity at a Glance">
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { v: "3.2×", l: "Faster Onboarding", s: "vs. industry avg" },
            { v: "42%", l: "Cost Reduction", s: "per implementation" },
            { v: "98%", l: "Retention Rate", s: "post go-live" },
            { v: "18d", l: "Time to Value", s: "median" },
          ].map((m) => (
            <div
              key={m.l}
              className="rounded-xl border p-5 text-center"
              style={{ borderColor: C.border }}
            >
              <Metric value={m.v} label={m.l} sub={m.s} />
            </div>
          ))}
        </div>
        <div
          className="rounded-xl p-6"
          style={{ background: `hsl(220 25% 10% / 0.04)` }}
        >
          <p className="text-sm leading-relaxed" style={{ color: C.slate }}>
            Sona's Implementation OS transforms the traditional services engagement into a
            scalable, repeatable operating system. By codifying best practices,
            automating handoffs, and providing real-time visibility, we compress
            time-to-value while preserving the white-glove experience customers
            expect from a premium platform.
          </p>
        </div>
      </SlideFrame>
    ),
  },

  /* 3 ─ Problem */
  {
    id: "problem",
    render: () => (
      <SlideFrame tag="Context" title="The Implementation Challenge">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: C.navy }}>
              Industry Pain Points
            </h3>
            {[
              { icon: Clock, text: "Average 90-day implementations lead to churn risk" },
              { icon: Users, text: "Manual handoffs create information loss at every stage" },
              { icon: DollarSign, text: "Rising CS costs without proportional revenue gain" },
              { icon: Layers, text: "No standardised playbook — every deal starts from scratch" },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <IconCircle icon={item.icon} color="hsl(0 72% 51%)" />
                <p className="text-sm leading-relaxed pt-2" style={{ color: C.slate }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: C.navy }}>
              Sona's Differentiation
            </h3>
            {[
              { icon: Zap, text: "Automated phase transitions with built-in quality gates" },
              { icon: Target, text: "Templatised playbooks per segment — SMB to Enterprise" },
              { icon: BarChart3, text: "Real-time health scoring across every active implementation" },
              { icon: Shield, text: "Proactive risk detection before escalation" },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <IconCircle icon={item.icon} color={C.teal} />
                <p className="text-sm leading-relaxed pt-2" style={{ color: C.slate }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SlideFrame>
    ),
  },

  /* 4 ─ Framework */
  {
    id: "framework",
    render: () => (
      <SlideFrame tag="Strategic Framework" title="6-Phase Implementation Model">
        <div className="grid grid-cols-6 gap-3">
          {[
            { phase: "Handoff", color: "hsl(199 89% 48%)", pct: 100 },
            { phase: "Kickoff", color: "hsl(262 52% 55%)", pct: 88 },
            { phase: "Build", color: "hsl(172 66% 40%)", pct: 72 },
            { phase: "Testing", color: "hsl(38 92% 50%)", pct: 55 },
            { phase: "Go-Live", color: "hsl(152 60% 40%)", pct: 40 },
            { phase: "Hypercare", color: "hsl(340 65% 50%)", pct: 25 },
          ].map((p) => (
            <motion.div
              key={p.phase}
              className="flex flex-col items-center gap-3 rounded-xl border p-4"
              style={{ borderColor: C.border }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: p.color }}
              >
                {p.pct}%
              </div>
              <span className="text-xs font-semibold" style={{ color: C.navy }}>
                {p.phase}
              </span>
              <div className="h-1 w-full rounded-full" style={{ background: C.border }}>
                <div
                  className="h-full rounded-full"
                  style={{ background: p.color, width: `${p.pct}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { title: "Standardise", desc: "Codify best practices into repeatable templates per segment." },
            { title: "Automate", desc: "Trigger phase transitions, alerts, and tasks automatically." },
            { title: "Measure", desc: "Track speed-to-value, CSAT, and escalation rates in real time." },
          ].map((c) => (
            <div key={c.title} className="rounded-lg p-4" style={{ background: `hsl(172 66% 40% / 0.06)` }}>
              <h4 className="text-sm font-bold mb-1" style={{ color: C.teal }}>
                {c.title}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: C.slate }}>
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </SlideFrame>
    ),
  },

  /* 5 ─ Data & Metrics */
  {
    id: "metrics",
    render: () => (
      <SlideFrame tag="Performance Data" title="Operational Metrics That Matter">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: C.navy }}>
              Implementation Velocity
            </h3>
            <Bar label="Handoff" pct={95} />
            <Bar label="Kickoff" pct={88} />
            <Bar label="Build" pct={72} color={C.gold} />
            <Bar label="Testing" pct={65} color={C.gold} />
            <Bar label="Go-Live" pct={82} />
            <Bar label="Hypercare" pct={91} />
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: C.navy }}>
              Business Impact
            </h3>
            {[
              { metric: "NRR", value: "118%", delta: "+12pp", up: true },
              { metric: "Avg Implementation", value: "18 days", delta: "−42 days", up: true },
              { metric: "CS Cost / Customer", value: "£1,240", delta: "−38%", up: true },
              { metric: "First-Year Churn", value: "2.1%", delta: "−6.4pp", up: true },
              { metric: "Expansion Revenue", value: "£2.4M", delta: "+67%", up: true },
            ].map((row) => (
              <div
                key={row.metric}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
                style={{ borderColor: C.border }}
              >
                <span className="text-sm font-medium" style={{ color: C.navy }}>
                  {row.metric}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold" style={{ color: C.navy }}>
                    {row.value}
                  </span>
                  <span
                    className="flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold"
                    style={{
                      background: `hsl(152 60% 40% / 0.1)`,
                      color: `hsl(152 60% 40%)`,
                    }}
                  >
                    <ArrowUpRight className="h-3 w-3" />
                    {row.delta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SlideFrame>
    ),
  },

  /* 6 ─ Roadmap */
  {
    id: "roadmap",
    render: () => (
      <SlideFrame tag="Execution Plan" title="90-Day Scaling Roadmap">
        <div className="relative flex gap-6">
          {[
            {
              q: "Days 1–30",
              title: "Foundation",
              color: "hsl(199 89% 48%)",
              items: [
                "Audit current implementation processes",
                "Deploy playbook templates for top 3 segments",
                "Instrument baseline metrics",
                "Train CS team on new workflow",
              ],
            },
            {
              q: "Days 31–60",
              title: "Acceleration",
              color: C.teal,
              items: [
                "Activate automated phase transitions",
                "Launch real-time health dashboard",
                "Integrate CRM handoff automation",
                "Begin parallel implementations",
              ],
            },
            {
              q: "Days 61–90",
              title: "Scale",
              color: C.gold,
              items: [
                "Roll out self-serve onboarding for SMB",
                "Implement predictive risk scoring",
                "Expand template library to 25+ playbooks",
                "Publish ROI case studies",
              ],
            },
          ].map((phase, i) => (
            <motion.div
              key={phase.q}
              className="flex-1 rounded-xl border p-5"
              style={{ borderColor: C.border, borderTop: `3px solid ${phase.color}` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: phase.color }}>
                {phase.q}
              </span>
              <h4 className="mt-1 text-base font-bold" style={{ color: C.navy }}>
                {phase.title}
              </h4>
              <ul className="mt-3 flex flex-col gap-2">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: C.slate }}>
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: phase.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </SlideFrame>
    ),
  },

  /* 7 ─ Financial Impact */
  {
    id: "financials",
    render: () => (
      <SlideFrame tag="Financial Model" title="Projected Impact Over 12 Months">
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { v: "£1.8M", l: "Cost Savings", s: "Reduced CS overhead" },
            { v: "£2.4M", l: "Expansion Revenue", s: "Faster time-to-value → upsell" },
            { v: "4.2×", l: "ROI", s: "Year 1 return" },
          ].map((m) => (
            <div
              key={m.l}
              className="flex flex-col items-center gap-2 rounded-xl p-6"
              style={{ background: C.navy, color: C.white }}
            >
              <span className="text-3xl font-bold" style={{ color: C.teal }}>
                {m.v}
              </span>
              <span className="text-sm font-semibold">{m.l}</span>
              <span className="text-xs" style={{ color: "hsl(215 14% 55%)" }}>
                {m.s}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: C.navy }}>
              Unit Economics Shift
            </h3>
            <Bar label="Before" pct={100} color="hsl(215 14% 70%)" />
            <div className="h-2" />
            <Bar label="After Sona" pct={58} color={C.teal} />
            <p className="mt-2 text-xs" style={{ color: C.slate }}>
              42% reduction in per-implementation cost while increasing CSAT by 23 points.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: C.navy }}>
              Revenue Impact Model
            </h3>
            {[
              { label: "Faster onboarding", value: "+£820K" },
              { label: "Reduced churn", value: "+£640K" },
              { label: "Expansion uplift", value: "+£940K" },
            ].map((r) => (
              <div
                key={r.label}
                className="flex items-center justify-between border-b py-2.5"
                style={{ borderColor: C.border }}
              >
                <span className="text-sm" style={{ color: C.slate }}>
                  {r.label}
                </span>
                <span className="text-sm font-bold" style={{ color: C.teal }}>
                  {r.value}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3">
              <span className="text-sm font-bold" style={{ color: C.navy }}>
                Total Impact
              </span>
              <span className="text-lg font-bold" style={{ color: C.teal }}>
                £2.4M
              </span>
            </div>
          </div>
        </div>
      </SlideFrame>
    ),
  },

  /* 8 ─ Risk */
  {
    id: "risk",
    render: () => (
      <SlideFrame tag="Risk Mitigation" title="Proactive Risk Management">
        <div className="grid grid-cols-2 gap-6">
          {[
            {
              risk: "Change Management Resistance",
              impact: "High",
              mitigation: "Phased rollout with champion programme. Embedded training in workflow, not separate sessions.",
              color: "hsl(0 72% 51%)",
            },
            {
              risk: "Data Migration Complexity",
              impact: "Medium",
              mitigation: "Pre-built connectors for top 10 HRIS/payroll systems. Dedicated migration sprint with validation gates.",
              color: C.gold,
            },
            {
              risk: "Integration Latency",
              impact: "Medium",
              mitigation: "Async webhook architecture. Retry policies and dead-letter queues for reliability.",
              color: C.gold,
            },
            {
              risk: "Scope Creep",
              impact: "High",
              mitigation: "Fixed-scope templates per segment. Change requests routed through structured approval workflow.",
              color: "hsl(0 72% 51%)",
            },
          ].map((r) => (
            <div
              key={r.risk}
              className="rounded-xl border p-5"
              style={{ borderColor: C.border, borderLeft: `3px solid ${r.color}` }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold" style={{ color: C.navy }}>
                  {r.risk}
                </h4>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                  style={{ background: `${r.color}15`, color: r.color }}
                >
                  {r.impact}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: C.slate }}>
                {r.mitigation}
              </p>
            </div>
          ))}
        </div>
      </SlideFrame>
    ),
  },

  /* 9 ─ Next Steps / CTA */
  {
    id: "next-steps",
    render: () => (
      <div className="flex h-full flex-col" style={{ background: C.navy }}>
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <SectionTag>Next Steps</SectionTag>
            <h2 className="text-4xl font-bold text-white max-w-xl leading-tight">
              Let's Build the Operating System for Scale
            </h2>
            <div className="h-1 w-16 rounded-full" style={{ background: C.teal }} />

            <div className="grid grid-cols-3 gap-6 mt-4 max-w-2xl">
              {[
                { step: "1", title: "Discovery Workshop", desc: "Map current processes & define success metrics" },
                { step: "2", title: "Pilot Programme", desc: "Deploy with 3 customers across segments" },
                { step: "3", title: "Full Rollout", desc: "Scale to all new implementations" },
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center gap-2">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                    style={{ background: C.teal, color: C.white }}
                  >
                    {s.step}
                  </div>
                  <h4 className="text-sm font-semibold text-white">{s.title}</h4>
                  <p className="text-xs" style={{ color: "hsl(215 14% 55%)" }}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm" style={{ color: "hsl(210 14% 65%)" }}>
              Rob — we'd love to walk through a live demo tailored to Boom's workflows.
            </p>
          </motion.div>
        </div>
        <div
          className="flex items-center justify-between px-12 py-5 text-xs"
          style={{ color: "hsl(215 14% 40%)", borderTop: `1px solid hsl(220 20% 18%)` }}
        >
          <span>sona.ai</span>
          <span>Confidential</span>
        </div>
      </div>
    ),
  },
];

/* ─── Slide Frame wrapper for content slides ─── */
function SlideFrame({
  tag,
  title,
  children,
}: {
  tag: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between px-10 pt-8 pb-4">
        <div className="flex flex-col gap-2">
          <SectionTag>{tag}</SectionTag>
          <h2 className="text-2xl font-bold" style={{ color: C.navy }}>
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: C.teal }}>
            <span className="text-xs font-bold text-white">S</span>
          </div>
        </div>
      </div>
      <div className="flex-1 px-10 pb-8 overflow-auto">{children}</div>
    </div>
  );
}

/* ─── Main Deck Component ─── */
export default function StrategicDeck() {
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const total = slides.length;

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, total - 1)), [total]);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "f" || e.key === "F") setFullscreen((f) => !f);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const containerClass = fullscreen
    ? "fixed inset-0 z-50 flex flex-col bg-black"
    : "flex h-screen flex-col";

  return (
    <div className={containerClass}>
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2 shrink-0"
        style={{
          background: fullscreen ? "hsl(220 30% 8%)" : C.offWhite,
          borderBottom: fullscreen ? "none" : `1px solid ${C.border}`,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md" style={{ background: C.teal }}>
            <span className="text-xs font-bold text-white">S</span>
          </div>
          <span
            className="text-sm font-semibold"
            style={{ color: fullscreen ? C.white : C.navy }}
          >
            Strategic Optimization & Scaling Deck
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: C.slate }}>
            {current + 1} / {total}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setFullscreen((f) => !f)}
          >
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Slide area */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden" style={{ background: fullscreen ? "black" : "hsl(220 15% 94%)" }}>
        {/* Thumbnail strip (non-fullscreen) */}
        {!fullscreen && (
          <div
            className="absolute left-0 top-0 bottom-0 w-[140px] overflow-y-auto py-4 px-3 flex flex-col gap-2 shrink-0"
            style={{ background: C.offWhite, borderRight: `1px solid ${C.border}` }}
          >
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrent(i)}
                className="relative w-full rounded-md overflow-hidden transition-all"
                style={{
                  aspectRatio: "16/9",
                  border: i === current ? `2px solid ${C.teal}` : `1px solid ${C.border}`,
                  opacity: i === current ? 1 : 0.6,
                }}
              >
                <div className="absolute inset-0 scale-[0.18] origin-top-left" style={{ width: "556%", height: "556%" }}>
                  {s.render()}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Main slide */}
        <div
          className="relative"
          style={{
            width: fullscreen ? "min(100vw, 177.78vh)" : "calc(100% - 180px)",
            maxWidth: fullscreen ? undefined : "960px",
            aspectRatio: "16/9",
            marginLeft: fullscreen ? 0 : "140px",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="absolute inset-0 rounded-lg overflow-hidden shadow-xl"
              style={{ border: fullscreen ? "none" : `1px solid ${C.border}` }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {slides[current].render()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav arrows */}
        <button
          onClick={prev}
          disabled={current === 0}
          className="absolute left-[156px] top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur shadow disabled:opacity-30 transition"
          style={{ left: fullscreen ? 16 : 156 }}
        >
          <ChevronLeft className="h-5 w-5" style={{ color: C.navy }} />
        </button>
        <button
          onClick={next}
          disabled={current === total - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur shadow disabled:opacity-30 transition"
        >
          <ChevronRight className="h-5 w-5" style={{ color: C.navy }} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 shrink-0" style={{ background: C.border }}>
        <motion.div
          className="h-full"
          style={{ background: C.teal }}
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
