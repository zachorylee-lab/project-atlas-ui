import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, ArrowRight, Check, Circle, Loader2, Plug, Sparkles,
  Kanban, MessageSquare, BookOpen, Building2, LineChart, RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

type Provider = {
  id: string;
  name: string;
  category: "PM" | "Comms" | "Docs" | "CRM" | "Analytics";
  icon: typeof Kanban;
  color: string;
  blurb: string;
  authType: "OAuth 2.0" | "API Key" | "Personal Access Token";
  suggestedAreas: string[];
};

type Area = {
  id: string;
  name: string;
  route: string;
  description: string;
  compatibleWith: string[]; // provider IDs
};

const PROVIDERS: Provider[] = [
  {
    id: "jira", name: "Atlassian (Jira + Confluence)", category: "PM",
    icon: Kanban, color: "from-[#0052CC] to-[#2684FF]",
    blurb: "Import Jira issues as RAID entries and Consultant Tasks. Link Confluence pages to Templates.",
    authType: "OAuth 2.0",
    suggestedAreas: ["raid", "pm-tasks", "projects", "templates"],
  },
  {
    id: "linear", name: "Linear", category: "PM",
    icon: Kanban, color: "from-[#5E6AD2] to-[#8B93E8]",
    blurb: "Alternative to Jira. Sync your assigned Linear issues into the Consultant Task Board.",
    authType: "OAuth 2.0",
    suggestedAreas: ["pm-tasks", "raid"],
  },
  {
    id: "slack", name: "Slack", category: "Comms",
    icon: MessageSquare, color: "from-[#4A154B] to-[#ECB22E]",
    blurb: "Post RAG changes, new RAID entries, and handoff notifications to your delivery channel.",
    authType: "OAuth 2.0",
    suggestedAreas: ["raid", "handoff", "projects"],
  },
  {
    id: "notion", name: "Notion", category: "Docs",
    icon: BookOpen, color: "from-[#000000] to-[#4A4A4A]",
    blurb: "Render the Playbook and Templates directly from Notion databases. Publish RACI to the customer workspace.",
    authType: "OAuth 2.0",
    suggestedAreas: ["playbook", "templates", "raci"],
  },
  {
    id: "confluence", name: "Confluence", category: "Docs",
    icon: BookOpen, color: "from-[#0052CC] to-[#0065FF]",
    blurb: "Same as Notion, for Atlassian shops. Playbook, Templates, and RACI publishing.",
    authType: "OAuth 2.0",
    suggestedAreas: ["playbook", "templates", "raci"],
  },
  {
    id: "salesforce", name: "Salesforce", category: "CRM",
    icon: Building2, color: "from-[#00A1E0] to-[#032D60]",
    blurb: "Auto-populate Sales Handoff from the closed-won opportunity. Sync accounts to Active Implementations.",
    authType: "OAuth 2.0",
    suggestedAreas: ["handoff", "projects"],
  },
  {
    id: "hubspot", name: "HubSpot", category: "CRM",
    icon: Building2, color: "from-[#FF7A59] to-[#FF9776]",
    blurb: "Alternative to Salesforce. Auto-populate Sales Handoff and account list.",
    authType: "Personal Access Token",
    suggestedAreas: ["handoff", "projects"],
  },
  {
    id: "posthog", name: "PostHog", category: "Analytics",
    icon: LineChart, color: "from-[#1D4AFF] to-[#F54E00]",
    blurb: "Real Red Oak tenant adoption, AI Review acceptance rate, and workstream usage signals.",
    authType: "API Key",
    suggestedAreas: ["metrics", "workflows", "integrations-page"],
  },
  {
    id: "amplitude", name: "Amplitude", category: "Analytics",
    icon: LineChart, color: "from-[#1E61F0] to-[#00A7CF]",
    blurb: "Alternative to PostHog. Feature-adoption and behavior cohorts for the Portfolio Health page.",
    authType: "API Key",
    suggestedAreas: ["metrics", "workflows"],
  },
];

const AREAS: Area[] = [
  { id: "metrics", name: "Portfolio Health", route: "/metrics",
    description: "TTFR/TTAP, on-time go-live %, CSAT, adoption",
    compatibleWith: ["posthog", "amplitude"] },
  { id: "projects", name: "Active Implementations", route: "/projects",
    description: "Per-account project cards with RAG status",
    compatibleWith: ["jira", "linear", "salesforce", "hubspot", "slack"] },
  { id: "pm-tasks", name: "Consultant Task Board", route: "/pm-tasks",
    description: "Your assigned tasks across all customers",
    compatibleWith: ["jira", "linear"] },
  { id: "playbook", name: "Onboarding Playbook", route: "/playbook",
    description: "6-phase methodology, live-rendered from docs",
    compatibleWith: ["notion", "confluence"] },
  { id: "templates", name: "Templates & SOWs", route: "/templates",
    description: "Deliverable library",
    compatibleWith: ["notion", "confluence", "jira"] },
  { id: "workflows", name: "Workstreams", route: "/workflows",
    description: "Cross-project workstream status",
    compatibleWith: ["posthog", "amplitude", "jira"] },
  { id: "integrations-page", name: "Integrations & Data", route: "/integrations",
    description: "Per-customer integration health",
    compatibleWith: ["posthog"] },
  { id: "handoff", name: "Sales Handoff", route: "/handoff",
    description: "AE → SIC transition doc",
    compatibleWith: ["salesforce", "hubspot", "slack"] },
  { id: "raci", name: "RACI Matrix", route: "/raci",
    description: "Stakeholder responsibility matrix",
    compatibleWith: ["notion", "confluence"] },
  { id: "raid", name: "RAID Log", route: "/raid",
    description: "Risks, Assumptions, Issues, Dependencies",
    compatibleWith: ["jira", "linear", "slack"] },
];

const STORAGE_KEY = "red oak-integration-wizard-v1";
const STEPS = ["Select providers", "Connect", "Map to areas", "Review"] as const;

type WizardState = {
  selected: string[];
  connections: Record<string, "pending" | "connecting" | "connected" | "error">;
  mappings: Record<string, string[]>; // providerId -> areaIds
};

const emptyState: WizardState = { selected: [], connections: {}, mappings: {} };

export default function IntegrationSetup() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(emptyState);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...emptyState, ...JSON.parse(raw) });
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  const toggleProvider = (id: string) => {
    setState((s) => {
      const isSelected = s.selected.includes(id);
      const selected = isSelected ? s.selected.filter((x) => x !== id) : [...s.selected, id];
      const mappings = { ...s.mappings };
      if (!isSelected && !mappings[id]) {
        const p = PROVIDERS.find((x) => x.id === id);
        mappings[id] = p?.suggestedAreas ?? [];
      }
      return { ...s, selected };
    });
  };

  const connect = (id: string) => {
    setState((s) => ({ ...s, connections: { ...s.connections, [id]: "connecting" } }));
    setTimeout(() => {
      setState((s) => ({ ...s, connections: { ...s.connections, [id]: "connected" } }));
      toast({ title: `${PROVIDERS.find((p) => p.id === id)?.name} connected`,
        description: "Simulated connection — wire the real edge function next." });
    }, 900);
  };

  const toggleMapping = (providerId: string, areaId: string) => {
    setState((s) => {
      const current = s.mappings[providerId] ?? [];
      const next = current.includes(areaId) ? current.filter((x) => x !== areaId) : [...current, areaId];
      return { ...s, mappings: { ...s.mappings, [providerId]: next } };
    });
  };

  const reset = () => { setState(emptyState); setStep(0); };

  const selectedProviders = useMemo(
    () => PROVIDERS.filter((p) => state.selected.includes(p.id)),
    [state.selected]
  );

  const canAdvance = useMemo(() => {
    if (step === 0) return state.selected.length > 0;
    if (step === 1) return selectedProviders.every((p) => state.connections[p.id] === "connected");
    if (step === 2) return selectedProviders.every((p) => (state.mappings[p.id] ?? []).length > 0);
    return true;
  }, [step, state, selectedProviders]);

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
              <Plug className="h-6 w-6 text-primary" />
              Integration Setup
            </h1>
            <p className="text-muted-foreground mt-1 max-w-3xl">
              Connect the systems that will replace this console's seed data with live customer signal. Pick providers,
              authenticate, and map each one to the dashboard areas it should power.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="h-4 w-4 mr-2" /> Reset wizard
          </Button>
        </div>

        {/* Stepper */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              {STEPS.map((label, i) => (
                <div key={label} className="flex items-center gap-2 flex-1">
                  <div className={cn(
                    "h-7 w-7 rounded-full grid place-items-center text-xs font-semibold shrink-0 border-2 transition-colors",
                    i < step && "bg-primary text-primary-foreground border-primary",
                    i === step && "bg-background text-primary border-primary",
                    i > step && "bg-muted text-muted-foreground border-border"
                  )}>
                    {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span className={cn("text-xs font-medium hidden sm:inline",
                    i === step ? "text-foreground" : "text-muted-foreground")}>{label}</span>
                  {i < STEPS.length - 1 && <div className="h-px flex-1 bg-border mx-2" />}
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-1" />
          </CardContent>
        </Card>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && <StepSelect state={state} onToggle={toggleProvider} />}
            {step === 1 && <StepConnect providers={selectedProviders} state={state} onConnect={connect} />}
            {step === 2 && <StepMap providers={selectedProviders} state={state} onToggle={toggleMapping} />}
            {step === 3 && <StepReview providers={selectedProviders} state={state} />}
          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</div>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} disabled={!canAdvance}>
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => {
              toast({ title: "Integration plan saved", description: "Selections persisted locally. Ready to wire edge functions." });
            }}>
              <Sparkles className="h-4 w-4 mr-2" /> Finish
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// ---------- Step 1: Select providers ----------
function StepSelect({ state, onToggle }: { state: WizardState; onToggle: (id: string) => void }) {
  const grouped = useMemo(() => {
    const g: Record<string, Provider[]> = {};
    PROVIDERS.forEach((p) => { (g[p.category] ||= []).push(p); });
    return g;
  }, []);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([cat, providers]) => (
        <div key={cat}>
          <h3 className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">{cat}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {providers.map((p) => {
              const selected = state.selected.includes(p.id);
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => onToggle(p.id)}
                  className={cn(
                    "text-left border rounded-lg p-4 transition-all hover:shadow-md",
                    selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-border"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-lg bg-gradient-to-br grid place-items-center shrink-0",
                      p.color
                    )}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm">{p.name}</span>
                        {selected ? (
                          <Check className="h-4 w-4 text-primary shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-snug">{p.blurb}</p>
                      <Badge variant="outline" className="text-[10px] mt-2">{p.authType}</Badge>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Step 2: Connect ----------
function StepConnect({
  providers, state, onConnect,
}: { providers: Provider[]; state: WizardState; onConnect: (id: string) => void }) {
  if (providers.length === 0) {
    return <EmptyHint text="Go back and select at least one provider." />;
  }
  return (
    <div className="space-y-3">
      {providers.map((p) => {
        const status = state.connections[p.id] ?? "pending";
        const Icon = p.icon;
        return (
          <Card key={p.id}>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className={cn("h-11 w-11 rounded-lg bg-gradient-to-br grid place-items-center shrink-0", p.color)}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.authType} · {p.blurb.split(".")[0]}</div>
              </div>
              {status === "connected" ? (
                <Badge className="gap-1.5 bg-emerald-500/15 text-emerald-700 border-emerald-500/30" variant="outline">
                  <Check className="h-3 w-3" /> Connected
                </Badge>
              ) : status === "connecting" ? (
                <Button disabled variant="outline">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Connecting
                </Button>
              ) : (
                <Button onClick={() => onConnect(p.id)}>Connect</Button>
              )}
            </CardContent>
          </Card>
        );
      })}
      <p className="text-[11px] text-muted-foreground text-center">
        Connections here are simulated. The real OAuth/API-key flow is wired via Lovable Cloud + connector when you're ready.
      </p>
    </div>
  );
}

// ---------- Step 3: Map to areas ----------
function StepMap({
  providers, state, onToggle,
}: { providers: Provider[]; state: WizardState; onToggle: (pid: string, aid: string) => void }) {
  if (providers.length === 0) return <EmptyHint text="Go back and select at least one provider." />;

  return (
    <div className="space-y-4">
      {providers.map((p) => {
        const compatible = AREAS.filter((a) => a.compatibleWith.includes(p.id));
        const mapped = state.mappings[p.id] ?? [];
        const Icon = p.icon;
        return (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-base">
                <div className={cn("h-8 w-8 rounded-md bg-gradient-to-br grid place-items-center", p.color)}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                {p.name}
                <Badge variant="outline" className="text-[10px] ml-auto">
                  {mapped.length} / {compatible.length} areas
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 md:grid-cols-2">
              {compatible.map((a) => {
                const checked = mapped.includes(a.id);
                return (
                  <label key={a.id} className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                    checked ? "border-primary bg-primary/5" : "hover:bg-muted/30"
                  )}>
                    <Checkbox checked={checked} onCheckedChange={() => onToggle(p.id, a.id)} className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.description}</div>
                      <div className="text-[10px] font-mono text-muted-foreground/60 mt-0.5">{a.route}</div>
                    </div>
                  </label>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ---------- Step 4: Review ----------
function StepReview({ providers, state }: { providers: Provider[]; state: WizardState }) {
  if (providers.length === 0) return <EmptyHint text="No integrations selected yet." />;
  const totalMappings = providers.reduce((n, p) => n + (state.mappings[p.id]?.length ?? 0), 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-semibold tabular-nums">{providers.length}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest">Providers</div>
          </div>
          <div>
            <div className="text-3xl font-semibold tabular-nums text-emerald-600">
              {providers.filter((p) => state.connections[p.id] === "connected").length}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest">Connected</div>
          </div>
          <div>
            <div className="text-3xl font-semibold tabular-nums text-primary">{totalMappings}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest">Area mappings</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Integration plan</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {providers.map((p) => {
            const mapped = state.mappings[p.id] ?? [];
            const Icon = p.icon;
            return (
              <div key={p.id} className="border rounded-lg p-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn("h-8 w-8 rounded-md bg-gradient-to-br grid place-items-center", p.color)}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">{p.authType}</div>
                  </div>
                  {state.connections[p.id] === "connected" ? (
                    <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 gap-1" variant="outline">
                      <Check className="h-3 w-3" /> Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">Not connected</Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 pl-11">
                  {mapped.length === 0 && <span className="text-xs text-muted-foreground italic">No areas mapped</span>}
                  {mapped.map((aid) => {
                    const a = AREAS.find((x) => x.id === aid);
                    if (!a) return null;
                    return (
                      <Badge key={aid} variant="outline" className="text-[10px]">
                        {a.name} <span className="text-muted-foreground/60 ml-1">{a.route}</span>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">{text}</CardContent></Card>
  );
}
