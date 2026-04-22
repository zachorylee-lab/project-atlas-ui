import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Target,
  Zap,
  Shield,
  BarChart3,
  CheckCircle2,
  Clock,
  Users,
  Layers,
  ArrowUpRight,
  Globe,
  RotateCcw,
  Sparkles,
  AlertTriangle,
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
                <span className="text-lg font-bold text-white">C</span>
              </div>
              <span className="text-lg font-semibold tracking-wide" style={{ color: C.tealMuted }}>COMMERCEOS</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-white max-w-2xl">
              Global Commerce
              <br />Transformation
            </h1>
            <div className="h-1 w-16 rounded-full" style={{ background: C.teal }} />
            <p className="max-w-lg text-base leading-relaxed" style={{ color: "hsl(210 14% 65%)" }}>
              A data-driven framework for cross-border commerce, returns, compliance, and agentic storefront infrastructure.
            </p>
          </motion.div>
        </div>
        <div className="flex items-center justify-between px-12 py-5 text-xs" style={{ color: "hsl(215 14% 40%)", borderTop: `1px solid hsl(220 20% 18%)` }}>
          <span>Prepared for [Brand Name] · [Organization]</span>
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
            { v: "+34%", l: "International AOV", s: "with DDP at checkout" },
            { v: "9 days", l: "Time to First Intl. Order", s: "from contract signed" },
            { v: "22%", l: "Returns Revenue Retained", s: "via exchange-first flow" },
            { v: "99.2%", l: "Duties Accuracy", s: "across all markets" },
          ].map((m) => (
            <div key={m.l} className="rounded-xl border p-5 text-center" style={{ borderColor: C.border }}>
              <Metric value={m.v} label={m.l} sub={m.s} />
            </div>
          ))}
        </div>
        <div className="rounded-xl p-6" style={{ background: `hsl(220 25% 10% / 0.04)` }}>
          <p className="text-sm leading-relaxed" style={{ color: C.slate }}>
            CommerceOS unifies cross-border checkout, returns, compliance, and agentic storefront infrastructure into a single operating layer for modern brands. By controlling pricing, tax, and duties upfront — and retaining revenue before refunds happen — we help merchants launch new markets faster and convert more global demand.
          </p>
        </div>
      </SlideFrame>
    ),
  },
  {
    id: "problem",
    render: () => (
      <SlideFrame tag="Context" title="The Global Commerce Challenge">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: C.navy }}>Industry Pain Points</h3>
            {[
              { icon: Globe, text: "Surprise duties at delivery cause 28% of cross-border refusals" },
              { icon: RotateCcw, text: "Returns drain 16-24% of ecommerce revenue when handled reactively" },
              { icon: Shield, text: "GPSR, IOSS, and tariff changes outpace most brands' compliance teams" },
              { icon: Layers, text: "Fragmented stacks (tax, returns, shipping) create checkout drop-off" },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <IconCircle icon={item.icon} color="hsl(0 72% 51%)" />
                <p className="text-sm leading-relaxed pt-2" style={{ color: C.slate }}>{item.text}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: C.navy }}>CommerceOS Differentiation</h3>
            {[
              { icon: Zap, text: "Landed cost shown upfront — DDP checkout in every supported market" },
              { icon: RotateCcw, text: "Exchange-first returns with bonus credit retain revenue before refunds" },
              { icon: Shield, text: "Built-in GPSR, IOSS, and restricted-SKU enforcement at checkout" },
              { icon: Sparkles, text: "Agentic storefront infrastructure ready for ChatGPT and AI commerce" },
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
            { title: "Standardise", desc: "Codify brand onboarding into repeatable templates per market mix and platform." },
            { title: "Automate", desc: "Trigger duties, returns, compliance, and agentic feed sync automatically." },
            { title: "Measure", desc: "Track international AOV, return retention, duties accuracy, and time-to-launch in real time." },
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
      <SlideFrame tag="Performance Data" title="Global Commerce Metrics That Matter">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: C.navy }}>Launch Performance</h3>
            <Bar label="Checkout Conv." pct={94} />
            <Bar label="Duties Accuracy" pct={99} />
            <Bar label="DDP Adoption" pct={78} color={C.gold} />
            <Bar label="CSAT" pct={91} />
            <Bar label="Return Retention" pct={64} />
            <Bar label="Compliance Pass" pct={98} />
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: C.navy }}>Business Impact</h3>
            {[
              { metric: "International AOV", value: "+34%", delta: "vs. baseline", up: true },
              { metric: "Time to Launch (new market)", value: "9 days", delta: "−12 days", up: true },
              { metric: "Returns Revenue Retained", value: "22%", delta: "+18pp", up: true },
              { metric: "Cross-border Refusals", value: "3.1%", delta: "−24pp", up: true },
              { metric: "Annual Net New GMV", value: "$2.1M", delta: "+45%", up: true },
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
      <SlideFrame tag="Execution Plan" title="90-Day Brand Onboarding Roadmap">
        <div className="relative flex gap-6">
          {[
            {
              q: "Days 1–30", title: "Foundation", color: "hsl(199 89% 48%)",
              items: ["Audit storefront, catalog, and current intl. flow", "Connect platform, tax, and 3PL integrations", "Classify HS codes and compliance posture", "Train brand team on CommerceOS"],
            },
            {
              q: "Days 31–60", title: "Activation", color: C.teal,
              items: ["Launch DDP checkout in priority markets", "Activate branded returns portal with exchanges", "Go live with compliance enforcement (GPSR, IOSS)", "Pilot agentic storefront feed"],
            },
            {
              q: "Days 61–90", title: "Optimization", color: C.gold,
              items: ["Tune duties, FX, and local payment methods", "Expand exchange-first flows and credit incentives", "Roll out agentic storefront to full traffic", "Publish global performance dashboards"],
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
            { v: "$1.2M", l: "Net New Intl. GMV", s: "From DDP & new markets" },
            { v: "$480K", l: "Returns Revenue Retained", s: "Exchanges + credit" },
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
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: C.navy }}>Cost Per Order Shift</h3>
            <Bar label="Before" pct={100} color="hsl(215 14% 70%)" />
            <div className="h-2" />
            <Bar label="After CommerceOS" pct={66} color={C.teal} />
            <p className="mt-2 text-xs" style={{ color: C.slate }}>34% reduction in fulfillment + returns cost while expanding to 4 new markets.</p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: C.navy }}>Revenue Impact Model</h3>
            {[
              { label: "International conversion uplift", value: "+$640K" },
              { label: "Returns revenue retained", value: "+$480K" },
              { label: "Lower customs refusals", value: "+$120K" },
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
            { risk: "Surprise Duties at Delivery", impact: "High", mitigation: "Show landed cost on PDP and enforce DDP at checkout in every supported market.", color: "hsl(0 72% 51%)" },
            { risk: "GPSR / Compliance Gaps", impact: "Critical", mitigation: "Built-in responsible-person mapping, restricted SKU enforcement, and quarterly tariff audits.", color: "hsl(0 72% 51%)" },
            { risk: "High Refund Rate Erodes Margin", impact: "High", mitigation: "Exchange-first returns flow with bonus store credit and shop-now conversion.", color: "hsl(0 72% 51%)" },
            { risk: "Catalog Migration Complexity", impact: "Medium", mitigation: "Pre-built connectors for Shopify, BigCommerce, SFCC. Reconciliation gates per milestone.", color: C.gold },
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
    id: "raci-matrix",
    render: () => (
      <SlideFrame tag="Governance" title="RACI Matrix — Onboarding Roles & Responsibilities">
        <div className="overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 font-bold border-b-2" style={{ color: C.navy, borderColor: C.teal }}>Activity</th>
                {["Brand Ops Lead", "CommerceOS PM", "Engineering", "Tax & Compliance", "Exec Sponsor"].map((h) => (
                  <th key={h} className="text-center py-2 px-2 font-bold border-b-2" style={{ color: C.navy, borderColor: C.teal }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { task: "Catalog & HS Code Migration", roles: ["A", "R", "C", "C", "I"] },
                { task: "Storefront / Checkout Integration", roles: ["C", "R", "A", "C", "I"] },
                { task: "Returns Portal Configuration", roles: ["A", "R", "C", "I", "I"] },
                { task: "Compliance (GPSR / IOSS) Setup", roles: ["C", "R", "C", "A", "I"] },
                { task: "Agentic Storefront Pilot", roles: ["A", "R", "C", "I", "I"] },
                { task: "UAT & Launch Sign-Off", roles: ["A", "R", "C", "C", "R"] },
                { task: "Hypercare Monitoring", roles: ["I", "R", "C", "A", "I"] },
                { task: "Escalation & Risk Decisions", roles: ["C", "C", "I", "I", "A"] },
              ].map((row) => (
                <tr key={row.task} className="border-b" style={{ borderColor: C.border }}>
                  <td className="py-2.5 px-3 font-medium" style={{ color: C.navy }}>{row.task}</td>
                  {row.roles.map((role, i) => (
                    <td key={i} className="text-center py-2.5 px-2">
                      <span
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold"
                        style={{
                          background: role === "R" ? C.teal : role === "A" ? C.navy : role === "C" ? C.gold : `hsl(215 14% 90%)`,
                          color: role === "I" ? C.slate : C.white,
                        }}
                      >
                        {role}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-6 mt-5 justify-center">
          {[
            { letter: "R", label: "Responsible", color: C.teal },
            { letter: "A", label: "Accountable", color: C.navy },
            { letter: "C", label: "Consulted", color: C.gold },
            { letter: "I", label: "Informed", color: `hsl(215 14% 90%)` },
          ].map((l) => (
            <div key={l.letter} className="flex items-center gap-2 text-xs">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold" style={{ background: l.color, color: l.letter === "I" ? C.slate : C.white }}>{l.letter}</span>
              <span style={{ color: C.slate }}>{l.label}</span>
            </div>
          ))}
        </div>
      </SlideFrame>
    ),
  },
  {
    id: "steering-committee",
    render: () => (
      <SlideFrame tag="Governance" title="Steering Committee Deck — Executive Review">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="rounded-xl border p-5" style={{ borderColor: C.border }}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: C.navy }}>Meeting Cadence</h3>
            {[
              { freq: "Weekly", desc: "Tactical standups — Brand Ops + CommerceOS PM", icon: Clock },
              { freq: "Bi-Weekly", desc: "Steering review — Exec Sponsor + Tax Lead", icon: Users },
              { freq: "Monthly", desc: "Portfolio health report — All stakeholders", icon: BarChart3 },
            ].map((m) => (
              <div key={m.freq} className="flex items-start gap-3 mb-3">
                <IconCircle icon={m.icon} color={C.teal} />
                <div>
                  <span className="text-sm font-bold" style={{ color: C.navy }}>{m.freq}</span>
                  <p className="text-xs" style={{ color: C.slate }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border p-5" style={{ borderColor: C.border }}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: C.navy }}>Standard Agenda</h3>
            {[
              { item: "Project Status & Phase Progress", time: "10 min" },
              { item: "KPI Review — Intl. AOV, Return Retention, Duties Accuracy", time: "10 min" },
              { item: "Risk & Issue Escalations", time: "10 min" },
              { item: "Upcoming Market Launches & Dependencies", time: "5 min" },
              { item: "Decisions Required & Action Items", time: "10 min" },
              { item: "Open Discussion", time: "5 min" },
            ].map((a, i) => (
              <div key={a.item} className="flex items-center justify-between py-2 border-b" style={{ borderColor: C.border }}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: C.teal }}>{i + 1}.</span>
                  <span className="text-xs font-medium" style={{ color: C.navy }}>{a.item}</span>
                </div>
                <span className="text-[10px] font-medium rounded-full px-2 py-0.5" style={{ background: `hsl(172 66% 40% / 0.1)`, color: C.teal }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-5" style={{ background: `hsl(220 25% 10% / 0.04)` }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: C.navy }}>Escalation Path</h3>
          <div className="flex items-center gap-2">
            {["Brand Ops Lead", "CommerceOS PM", "VP Operations", "Exec Sponsor"].map((role, i) => (
              <div key={role} className="flex items-center gap-2">
                <span className="rounded-lg px-3 py-1.5 text-xs font-semibold" style={{ background: i === 3 ? C.navy : i === 2 ? C.gold : C.teal, color: C.white }}>{role}</span>
                {i < 3 && <ChevronRight className="h-4 w-4" style={{ color: C.slate }} />}
              </div>
            ))}
          </div>
        </div>
      </SlideFrame>
    ),
  },
  {
    id: "risk-log",
    render: () => (
      <SlideFrame tag="Risk Management" title="Risk Mitigation Log — Active Tracker">
        <div className="overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                {["ID", "Risk Description", "Likelihood", "Impact", "Status", "Mitigation Plan", "Owner"].map((h) => (
                  <th key={h} className="text-left py-2 px-2 font-bold border-b-2 whitespace-nowrap" style={{ color: C.navy, borderColor: C.teal }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { id: "R-001", desc: "Surprise duties cause checkout abandonment", like: "Medium", impact: "High", status: "Mitigated", mitigation: "DDP at checkout with landed-cost display on PDP", owner: "CommerceOS PM" },
                { id: "R-002", desc: "EU GPSR responsible-person not assigned", like: "Medium", impact: "Critical", status: "Open", mitigation: "Block EU launch until responsible person registered per market", owner: "Tax & Compliance" },
                { id: "R-003", desc: "HS code misclassification causes customs holds", like: "Medium", impact: "High", status: "Open", mitigation: "AI-assisted classification + quarterly audit with brand legal", owner: "Tax & Compliance" },
                { id: "R-004", desc: "Catalog migration breaks variant relationships", like: "Low", impact: "High", status: "Mitigated", mitigation: "Reconciliation gates and parallel-run period before cutover", owner: "Engineering" },
                { id: "R-005", desc: "Returns volume spikes post-launch", like: "High", impact: "Medium", status: "Open", mitigation: "Exchange-first portal + bonus store credit; daily monitoring in week 1-2", owner: "Brand Ops Lead" },
                { id: "R-006", desc: "Agentic storefront responses off-brand", like: "Medium", impact: "Medium", status: "Monitoring", mitigation: "Voice guardrails + conversation logging + 5% pilot before full rollout", owner: "CommerceOS PM" },
              ].map((r) => {
                const statusColor = r.status === "Mitigated" ? C.teal : r.status === "Open" ? "hsl(0 72% 51%)" : C.gold;
                const impactColor = r.impact === "Critical" ? "hsl(0 72% 51%)" : r.impact === "High" ? C.gold : C.teal;
                return (
                  <tr key={r.id} className="border-b" style={{ borderColor: C.border }}>
                    <td className="py-2.5 px-2 font-bold" style={{ color: C.teal }}>{r.id}</td>
                    <td className="py-2.5 px-2 font-medium max-w-[200px]" style={{ color: C.navy }}>{r.desc}</td>
                    <td className="py-2.5 px-2" style={{ color: C.slate }}>{r.like}</td>
                    <td className="py-2.5 px-2">
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" style={{ background: `${impactColor}15`, color: impactColor }}>{r.impact}</span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase" style={{ background: `${statusColor}15`, color: statusColor }}>{r.status}</span>
                    </td>
                    <td className="py-2.5 px-2 max-w-[220px]" style={{ color: C.slate }}>{r.mitigation}</td>
                    <td className="py-2.5 px-2 whitespace-nowrap font-medium" style={{ color: C.navy }}>{r.owner}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 mt-5 justify-center">
          {[
            { label: "Open", color: "hsl(0 72% 51%)", count: 3 },
            { label: "Mitigated", color: C.teal, count: 2 },
            { label: "Monitoring", color: C.gold, count: 1 },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-xs">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
              <span style={{ color: C.slate }}>{s.label} ({s.count})</span>
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
            <h2 className="text-4xl font-bold text-white max-w-xl leading-tight">Let's Launch Your Global Commerce Stack</h2>
            <div className="h-1 w-16 rounded-full" style={{ background: C.teal }} />
            <div className="grid grid-cols-3 gap-6 mt-4 max-w-2xl">
              {[
                { step: "1", title: "Catalog Review", desc: "Map current intl. flow & identify quick wins" },
                { step: "2", title: "Pilot Market", desc: "Launch DDP + returns in 1-2 markets to validate impact" },
                { step: "3", title: "Full Rollout", desc: "Scale across all priority markets with proven playbook" },
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold" style={{ background: C.teal, color: C.white }}>{s.step}</div>
                  <h4 className="text-sm font-semibold text-white">{s.title}</h4>
                  <p className="text-xs" style={{ color: "hsl(215 14% 55%)" }}>{s.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm" style={{ color: "hsl(210 14% 65%)" }}>
              We'd love to walk through a live demo tailored to your catalog and target markets.
            </p>
          </motion.div>
        </div>
        <div className="flex items-center justify-between px-12 py-5 text-xs" style={{ color: "hsl(215 14% 40%)", borderTop: `1px solid hsl(220 20% 18%)` }}>
          <span>commerceos.io</span>
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
            <span className="text-xs font-bold text-white">C</span>
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
            <span className="text-xs font-bold text-white">C</span>
          </div>
          <span className="text-sm font-semibold" style={{ color: fullscreen ? C.white : C.navy }}>Global Commerce Transformation Deck</span>
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
