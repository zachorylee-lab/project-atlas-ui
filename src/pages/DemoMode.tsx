import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, X, Play, Pause, RotateCcw, Maximize, Minimize,
  ArrowRightLeft, Rocket, Hammer, FlaskConical, Zap, HeartPulse, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Beat = {
  id: string;
  phase: string;
  icon: React.ElementType;
  color: string;
  kicker: string;
  title: string;
  narrative: string;
  bullets: string[];
  speakerNotes: string;
  stat?: { label: string; value: string; sub?: string };
  durationSec: number; // target speaking time
};

const BEATS: Beat[] = [
  {
    id: "intro",
    phase: "Opening",
    icon: Sparkles,
    color: "from-primary to-accent",
    kicker: "The problem",
    title: "Professional services firms still schedule people in spreadsheets",
    narrative:
      "Every audit, tax, and advisory firm has the same daily fight: the right person, on the right engagement, at the right time. Retain, ProStaff, and Excel can't keep up with a modern firm's complexity — so partners spend Sunday nights re-planning by hand.",
    bullets: [
      "Resource Managers juggle 200-2,000+ staff across service lines",
      "Forecast accuracy drifts within days of publishing",
      "Utilization decisions get made on gut feel, not signal",
    ],
    speakerNotes:
      "Open with empathy for the audience — most Red Oak buyers were Resource Managers themselves. Land the pain in one sentence, then transition: 'That's why I built this console — to show how I'd run a Red Oak implementation end-to-end.'",
    durationSec: 60,
  },
  {
    id: "handoff",
    phase: "Phase 1 · Handoff",
    icon: ArrowRightLeft,
    color: "from-[hsl(199_89%_48%)] to-[hsl(199_89%_38%)]",
    kicker: "Sales → Delivery",
    title: "Handoff starts before day one",
    narrative:
      "The Senior Implementation Consultant is looped in during late-stage sales. We lock scope, confirm modules — Core RM, AI Review, Forecasting — and identify the source systems (Workday, Practice Engine, NetSuite) before the ink is dry.",
    bullets: [
      "Signed order form + module list validated",
      "Legacy tool identified (Retain / ProStaff / Deltek / spreadsheets)",
      "Sandbox tenant provisioned, delivery pod assigned",
      "TTV targets — TTFR and TTAP — set with the AE",
    ],
    speakerNotes:
      "Emphasize: 'No surprises at kickoff.' The handoff doc is the single source of truth. Show the Sales Handoff tab if asked.",
    stat: { label: "Target handoff-to-kickoff", value: "≤ 10 days", sub: "sandbox live" },
    durationSec: 90,
  },
  {
    id: "kickoff",
    phase: "Phase 2 · Discovery & Kickoff",
    icon: Rocket,
    color: "from-[hsl(262_70%_60%)] to-[hsl(262_70%_50%)]",
    kicker: "Align the firm",
    title: "Discovery is where we earn trust",
    narrative:
      "COO, Head of RM, HR, IT, Practice Ops, and a Partner sponsor in one room. We walk the current-state resourcing model, capture pain, and lock success criteria: Time to First Review, Time to First Approved Piece, forecast accuracy, and adoption.",
    bullets: [
      "Charter + RACI signed by executive sponsor",
      "Current-state discovery workbook — roles, grades, skills, engagement types",
      "Risk & assumption register opened",
      "Weekly cadence + steering committee scheduled",
    ],
    speakerNotes:
      "Story beat: mention the discovery workshop pattern — 'show, don't tell.' Ask the audience how they run discovery today.",
    stat: { label: "Kickoff to first config sign-off", value: "3-4 weeks" },
    durationSec: 90,
  },
  {
    id: "build",
    phase: "Phase 3 · Configure & Integrate",
    icon: Hammer,
    color: "from-primary to-[hsl(22_88%_42%)]",
    kicker: "The heavy lifting",
    title: "Firm model, integrations, and AI tuning",
    narrative:
      "This is where the implementation lives or dies. We stand up the firm hierarchy, load the skills taxonomy, wire Workday for people, Practice Engine for engagements, calendars for availability, and finance for WIP. Then we tune the AI Review weightings — utilization, skill match, staff development.",
    bullets: [
      "Firm hierarchy: offices, service lines, teams, cost centers",
      "Integrations: HRIS + Practice Management + Calendar + Finance",
      "Engagement templates ratified by service line leaders",
      "Historical bookings migrated with reconciliation report",
      "AI Review tuning parameters documented",
    ],
    speakerNotes:
      "This is the longest beat — 90-120 seconds. If demoing live, click into the Integrations page here.",
    stat: { label: "Systems integrated", value: "4-6", sub: "typical firm rollout" },
    durationSec: 120,
  },
  {
    id: "testing",
    phase: "Phase 4 · Test & Train",
    icon: FlaskConical,
    color: "from-[hsl(38_92%_50%)] to-[hsl(38_92%_42%)]",
    kicker: "Enablement is the product",
    title: "UAT, parallel run, and Technical Enablement",
    narrative:
      "We run scheduling scenarios end-to-end, then execute a full weekly parallel against the legacy tool. Resource Managers go through the Decisioning Studio-style Technical Enablement workshops with knowledge checks. Partners get briefed on approvals and dashboards. Then we pilot with one or two service lines before firm-wide cutover.",
    bullets: [
      "UAT test scripts + sign-off log",
      "1-week parallel run with reconciliation",
      "Resource Manager cohort trained + knowledge-checked",
      "Pilot service line adoption metrics captured",
      "Go/No-Go decision signed by executive sponsor",
    ],
    speakerNotes:
      "Callback to the JD: 'Customer Enablement & Training' — mention structured knowledge checks. This is your differentiator.",
    stat: { label: "Parallel-run tolerance", value: "≤ 5% variance", sub: "vs legacy" },
    durationSec: 90,
  },
  {
    id: "golive",
    phase: "Phase 5 · Go-Live",
    icon: Zap,
    color: "from-[hsl(152_60%_40%)] to-[hsl(152_60%_32%)]",
    kicker: "The switch",
    title: "Command-center cutover, then the first firm-wide schedule",
    narrative:
      "Production tenant live, HRIS and Practice Management syncing, legacy tool retired. The first firm-wide schedule publishes with the SIC and Solution Consultant on-call. War room open for launch week, daily executive standup, P1/P2 tracked to closure.",
    bullets: [
      "Runbook + rollback plan rehearsed",
      "First firm-wide schedule published",
      "Users, permissions, and roles matrix live",
      "Day-1 utilization dashboard broadcast to partners",
    ],
    speakerNotes:
      "Speak with confidence here — go-live is where the SIC is most visible. One sentence: 'We don't leave until the first schedule is out and stable.'",
    stat: { label: "Launch-week P1 target", value: "0 open", sub: "by end of week" },
    durationSec: 75,
  },
  {
    id: "hypercare",
    phase: "Phase 6 · Adoption & Handover",
    icon: HeartPulse,
    color: "from-[hsl(195_78%_38%)] to-[hsl(195_78%_30%)]",
    kicker: "Land the value",
    title: "Hypercare, CSM handover, and product advocacy",
    narrative:
      "30-60 days of hypercare. We stabilize the first busy season, tune AI acceptance rate, and capture CSAT. Firm stakeholder hierarchy is documented and handed to the CSM. Customer use-cases and feature requests flow back to Red Oak Product as advocacy input.",
    bullets: [
      "Hypercare exit report: incidents, MTTR, utilization uplift, forecast accuracy",
      "CSAT + adoption scorecard",
      "BAU handover document delivered to CSM",
      "Product advocacy log — feature requests championed internally",
      "Lessons-learned retro with the delivery pod",
    ],
    speakerNotes:
      "Bring it home: 'The implementation isn't done at go-live — it's done when the firm can run without me, and the CSM has everything they need to grow the account.'",
    stat: { label: "Forecast accuracy uplift", value: "+15-25%", sub: "vs baseline" },
    durationSec: 90,
  },
  {
    id: "close",
    phase: "Close",
    icon: Sparkles,
    color: "from-accent to-primary",
    kicker: "Why this matters",
    title: "This console is how I'd show up on day one",
    narrative:
      "Everything you just saw — the playbook, the KPIs, the interview prep, the workstreams — is how I structure a Red Oak implementation. It's opinionated, it's outcome-driven, and it's built to hand off cleanly to Customer Success.",
    bullets: [
      "Structured 6-phase methodology, not ad-hoc",
      "TTFR and TTAP are the north star",
      "Enablement + advocacy are first-class deliverables",
      "Happy to take questions.",
    ],
    speakerNotes:
      "Pause. Smile. 'What questions can I answer?' Then open the Interview Prep tab in another window for the Q&A.",
    durationSec: 45,
  },
];

const TOTAL_SECONDS = BEATS.reduce((a, b) => a + b.durationSec, 0);

export default function DemoMode() {
  const navigate = useNavigate();
  const params = useParams<{ step?: string }>();
  const stepFromUrl = Math.max(0, Math.min(BEATS.length - 1, Number(params.step ?? 0) || 0));
  const [index, setIndex] = useState(stepFromUrl);
  const [showNotes, setShowNotes] = useState(true);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const beat = BEATS[index];
  const beatStartOffset = useMemo(
    () => BEATS.slice(0, index).reduce((a, b) => a + b.durationSec, 0),
    [index]
  );

  useEffect(() => {
    if (stepFromUrl !== index) setIndex(stepFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepFromUrl]);

  useEffect(() => {
    navigate(`/demo/${index}`, { replace: true });
    document.title = `Demo · ${index + 1}/${BEATS.length} — ${beat.title}`;
  }, [index, beat.title, navigate]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      else if (e.key === "Escape") navigate("/");
      else if (e.key.toLowerCase() === "n") setShowNotes((v) => !v);
      else if (e.key.toLowerCase() === "f") toggleFullscreen();
      else if (e.key.toLowerCase() === "p") setRunning((v) => !v);
      else if (e.key.toLowerCase() === "r") { setElapsed(0); setRunning(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const go = (delta: number) =>
    setIndex((i) => Math.max(0, Math.min(BEATS.length - 1, i + delta)));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) rootRef.current?.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const r = (s % 60).toString().padStart(2, "0");
    return `${m}:${r}`;
  };

  const beatElapsed = Math.max(0, elapsed - beatStartOffset);
  const beatProgress = Math.min(100, (beatElapsed / beat.durationSec) * 100);
  const overProgress = Math.min(100, (elapsed / TOTAL_SECONDS) * 100);
  const overBudget = elapsed > TOTAL_SECONDS;
  const beatOver = beatElapsed > beat.durationSec;
  const Icon = beat.icon;

  // Audible + visual cue the moment a beat crosses its target
  const cuedRef = useRef<string | null>(null);
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (!running) return;
    if (beatElapsed >= beat.durationSec && cuedRef.current !== beat.id) {
      cuedRef.current = beat.id;
      setFlash(true);
      window.setTimeout(() => setFlash(false), 1400);
      try {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new Ctx();
        const now = ctx.currentTime;
        [0, 0.18].forEach((t) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "sine";
          o.frequency.value = 880;
          g.gain.setValueAtTime(0.0001, now + t);
          g.gain.exponentialRampToValueAtTime(0.25, now + t + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.14);
          o.connect(g).connect(ctx.destination);
          o.start(now + t);
          o.stop(now + t + 0.16);
        });
        window.setTimeout(() => ctx.close(), 800);
      } catch { /* ignore audio errors */ }
    }
  }, [beatElapsed, beat.id, beat.durationSec, running]);
  useEffect(() => { cuedRef.current = null; setFlash(false); }, [beat.id]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 bg-gradient-to-br from-[hsl(220_50%_8%)] via-[hsl(220_45%_11%)] to-[hsl(220_50%_6%)] text-white flex flex-col overflow-hidden"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-xs font-bold">D</span>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-white/50">Red Oak · Demo Mode</div>
            <div className="text-sm font-medium">Implementation methodology walkthrough</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col items-end mr-1">
            <div className="text-[10px] uppercase tracking-widest text-white/40">This beat</div>
            <div className={cn(
              "font-mono text-sm tabular-nums",
              beatOver ? "text-destructive" : "text-white/90"
            )}>
              {fmt(beatElapsed)} <span className="text-white/40">/ {fmt(beat.durationSec)}</span>
            </div>
          </div>
          <div className={cn(
            "px-3 py-1.5 rounded-md font-mono text-sm tabular-nums",
            overBudget ? "bg-destructive/20 text-destructive-foreground" : "bg-white/10"
          )}>
            {fmt(elapsed)} <span className="text-white/40">/ {fmt(TOTAL_SECONDS)}</span>
          </div>
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10"
            onClick={() => setRunning((v) => !v)}>
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10"
            onClick={() => { setElapsed(0); setRunning(false); }}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="ghost" className="text-white hover:bg-white/10" onClick={() => navigate("/")}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Global progress */}
      <div className="h-1 bg-white/5 shrink-0">
        <div
          className={cn("h-full transition-all", overBudget ? "bg-destructive" : "bg-gradient-to-r from-primary to-accent")}
          style={{ width: `${overProgress}%` }}
        />
      </div>

      {/* Beat progress — always visible, current beat vs target */}
      <div className="px-6 pt-2 shrink-0">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-white/40 mb-1">
          <span>Beat {index + 1} / {BEATS.length} · {beat.phase}</span>
          <span className={cn("tabular-nums font-mono", beatOver && "text-destructive")}>
            {fmt(beatElapsed)} / {fmt(beat.durationSec)}{beatOver && " · OVER"}
          </span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500",
              beatOver ? "bg-destructive" : "bg-gradient-to-r from-primary to-accent"
            )}
            style={{ width: `${beatProgress}%` }}
          />
        </div>
      </div>

      {/* Flash overlay + banner when a beat ends */}
      {flash && (
        <>
          <div className="pointer-events-none fixed inset-0 z-40 animate-pulse bg-destructive/20 mix-blend-screen" />
          <div className="pointer-events-none fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-destructive text-destructive-foreground text-sm font-semibold shadow-2xl animate-fade-in">
            Beat time reached — wrap up and advance
          </div>
        </>
      )}

      {/* Main slide */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_360px]">
        <div className="relative overflow-hidden flex items-center justify-center p-8 lg:p-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={beat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="max-w-4xl w-full"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={cn("h-11 w-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg", beat.color)}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-white/50">{beat.phase}</div>
                  <div className="text-xs text-white/60">{beat.kicker}</div>
                </div>
              </div>

              <h1 className="text-4xl lg:text-5xl font-semibold leading-tight tracking-tight mb-6">
                {beat.title}
              </h1>

              <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-3xl">
                {beat.narrative}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 mb-8">
                {beat.bullets.map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <div className={cn("h-1.5 w-1.5 rounded-full mt-2 shrink-0 bg-gradient-to-br", beat.color)} />
                    <span className="text-sm text-white/85">{b}</span>
                  </div>
                ))}
              </div>

              {beat.stat && (
                <div className="inline-flex items-baseline gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-3xl font-semibold tabular-nums bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                    {beat.stat.value}
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-white/50">{beat.stat.label}</div>
                    {beat.stat.sub && <div className="text-xs text-white/40">{beat.stat.sub}</div>}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Notes panel */}
        {showNotes && (
          <div className="border-l border-white/10 bg-black/30 p-6 overflow-y-auto hidden lg:block">
            <div className="text-[11px] uppercase tracking-widest text-white/50 mb-2">Speaker notes</div>
            <p className="text-sm text-white/80 leading-relaxed mb-6">{beat.speakerNotes}</p>

            <div className="text-[11px] uppercase tracking-widest text-white/50 mb-2">Beat timing</div>
            <div className="text-xs text-white/60 mb-2 tabular-nums">
              {fmt(beatElapsed)} / {fmt(beat.durationSec)} target
            </div>
            <Progress value={beatProgress} className="h-1.5 bg-white/10" />

            <div className="mt-8 text-[11px] uppercase tracking-widest text-white/50 mb-3">All beats</div>
            <div className="space-y-1">
              {BEATS.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-xs transition-colors flex items-center justify-between",
                    i === index ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5"
                  )}
                >
                  <span className="truncate">{i + 1}. {b.phase}</span>
                  <span className="text-white/40 tabular-nums ml-2">{fmt(b.durationSec)}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 text-[10px] text-white/40 leading-relaxed">
              ← → navigate · Space next · P play/pause · R reset · N notes · F fullscreen · Esc exit
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 shrink-0">
        <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => go(-1)} disabled={index === 0}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Prev
        </Button>
        <div className="flex items-center gap-1.5">
          {BEATS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-8 bg-primary" : "w-2 bg-white/20 hover:bg-white/40"
              )}
              aria-label={`Go to beat ${i + 1}`}
            />
          ))}
        </div>
        <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => go(1)} disabled={index === BEATS.length - 1}>
          Next <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
