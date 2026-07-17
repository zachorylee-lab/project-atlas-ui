import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play, FileText, ExternalLink, Plus, Search, Eye, Clock, GraduationCap, Video, BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Source = "Loom" | "Scribe" | "Guidde" | "PDF" | "Slide";
type Persona = "Admin" | "Scheduler" | "Partner" | "Consultant" | "All";
type Module =
  | "Firm Model"
  | "Scheduler"
  | "Forecast"
  | "AI Review"
  | "Integrations"
  | "Reporting"
  | "General";

type Asset = {
  id: string;
  title: string;
  source: Source;
  module: Module;
  personas: Persona[];
  durationMin: number;
  views: number;
  completion: number; // %
  updatedDaysAgo: number;
  url: string;
  description: string;
};

const seed: Asset[] = [
  {
    id: "a1",
    title: "Firm Model — Grades, Roles & Rate Cards",
    source: "Loom",
    module: "Firm Model",
    personas: ["Admin"],
    durationMin: 12,
    views: 184,
    completion: 78,
    updatedDaysAgo: 6,
    url: "https://loom.com/share/example-firm-model",
    description: "Walkthrough of configuring grade hierarchy, role families, and effective-dated rate cards.",
  },
  {
    id: "a2",
    title: "Scheduler — Drag, Drop & Conflict Resolution",
    source: "Loom",
    module: "Scheduler",
    personas: ["Scheduler", "Admin"],
    durationMin: 8,
    views: 412,
    completion: 91,
    updatedDaysAgo: 2,
    url: "https://loom.com/share/example-scheduler",
    description: "Day-in-the-life for a scheduling manager — resolving conflicts, honoring soft preferences.",
  },
  {
    id: "a3",
    title: "Forecast — Reading Utilization vs. Capacity",
    source: "Scribe",
    module: "Forecast",
    personas: ["Partner", "Admin"],
    durationMin: 5,
    views: 96,
    completion: 64,
    updatedDaysAgo: 14,
    url: "https://scribehow.com/shared/example-forecast",
    description: "Step-by-step SOP for interpreting the forecast heatmap and drilling into hot cells.",
  },
  {
    id: "a4",
    title: "AI Review — Tuning Priorities",
    source: "Loom",
    module: "AI Review",
    personas: ["Admin"],
    durationMin: 15,
    views: 58,
    completion: 42,
    updatedDaysAgo: 3,
    url: "https://loom.com/share/example-ai-tuning",
    description: "How to weight partner preference, utilization balance, and engagement fit.",
  },
  {
    id: "a5",
    title: "Workday Integration — Sync Cadence & Field Map",
    source: "Scribe",
    module: "Integrations",
    personas: ["Admin"],
    durationMin: 7,
    views: 71,
    completion: 88,
    updatedDaysAgo: 21,
    url: "https://scribehow.com/shared/example-workday",
    description: "Verify Workday connector health, review field mapping, handle sync failures.",
  },
  {
    id: "a6",
    title: "Consultant Self-Service — Availability & Preferences",
    source: "Loom",
    module: "General",
    personas: ["Consultant"],
    durationMin: 4,
    views: 903,
    completion: 96,
    updatedDaysAgo: 30,
    url: "https://loom.com/share/example-consultant",
    description: "Onboarding video shown to every consultant on first login.",
  },
  {
    id: "a7",
    title: "Power BI Export — Weekly Utilization Pack",
    source: "Scribe",
    module: "Reporting",
    personas: ["Partner", "Admin"],
    durationMin: 6,
    views: 44,
    completion: 55,
    updatedDaysAgo: 9,
    url: "https://scribehow.com/shared/example-powerbi",
    description: "SOP for the weekly export → refresh → distribute cycle.",
  },
];

const sourceIcon = (s: Source) =>
  s === "Loom" || s === "Guidde" ? Video : s === "Scribe" ? FileText : BookOpen;

const sourceTint: Record<Source, string> = {
  Loom: "bg-[hsl(280_60%_55%)]/15 text-[hsl(280_60%_55%)] border-[hsl(280_60%_55%)]/30",
  Scribe: "bg-[hsl(200_70%_50%)]/15 text-[hsl(200_70%_50%)] border-[hsl(200_70%_50%)]/30",
  Guidde: "bg-[hsl(320_60%_55%)]/15 text-[hsl(320_60%_55%)] border-[hsl(320_60%_55%)]/30",
  PDF: "bg-muted text-muted-foreground border-border",
  Slide: "bg-muted text-muted-foreground border-border",
};

/**
 * Convert a shared Loom/Scribe/Guidde URL into an embeddable iframe src.
 * Returns null if the URL isn't from a known embeddable source.
 */
function toEmbedUrl(url: string, source: Source): string | null {
  try {
    const u = new URL(url);
    if (source === "Loom" || u.hostname.includes("loom.com")) {
      // https://www.loom.com/share/<id>  ->  https://www.loom.com/embed/<id>
      const m = u.pathname.match(/\/(?:share|embed)\/([a-zA-Z0-9]+)/);
      if (m) return `https://www.loom.com/embed/${m[1]}`;
    }
    if (source === "Scribe" || u.hostname.includes("scribehow.com")) {
      // https://scribehow.com/shared/<slug>  ->  https://scribehow.com/embed/<slug>
      const m = u.pathname.match(/\/(?:shared|embed)\/([^/?#]+)/);
      if (m) return `https://scribehow.com/embed/${m[1]}`;
    }
    if (source === "Guidde" || u.hostname.includes("guidde.com")) {
      if (u.pathname.includes("/embed/")) return url;
      const m = u.pathname.match(/\/share\/([^/?#]+)/);
      if (m) return `https://app.guidde.com/embed/${m[1]}`;
    }
  } catch {}
  return null;
}


const STORE_KEY = "red oak.training.library.v1";

function load(): Asset[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw) as Asset[];
  } catch {}
  return seed;
}

export default function TrainingLibrary() {
  const [assets, setAssets] = useState<Asset[]>(load);
  const [query, setQuery] = useState("");
  const [module, setModule] = useState<string>("all");
  const [persona, setPersona] = useState<string>("all");
  const [source, setSource] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<Asset | null>(null);
  const [draft, setDraft] = useState<Partial<Asset>>({
    source: "Loom",
    module: "General",
    personas: ["Admin"],
  });

  const persist = (next: Asset[]) => {
    setAssets(next);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch {}
  };

  const filtered = useMemo(
    () =>
      assets.filter((a) => {
        if (query && !`${a.title} ${a.description}`.toLowerCase().includes(query.toLowerCase())) return false;
        if (module !== "all" && a.module !== module) return false;
        if (source !== "all" && a.source !== source) return false;
        if (persona !== "all" && !a.personas.includes(persona as Persona)) return false;
        return true;
      }),
    [assets, query, module, persona, source],
  );

  const stats = useMemo(() => {
    const total = assets.length;
    const totalViews = assets.reduce((s, a) => s + a.views, 0);
    const avgCompletion = total
      ? Math.round(assets.reduce((s, a) => s + a.completion, 0) / total)
      : 0;
    const totalMinutes = assets.reduce((s, a) => s + a.durationMin, 0);
    return { total, totalViews, avgCompletion, totalMinutes };
  }, [assets]);

  const addAsset = () => {
    if (!draft.title || !draft.url) return;
    const next: Asset = {
      id: `a_${Date.now()}`,
      title: draft.title!,
      source: (draft.source as Source) ?? "Loom",
      module: (draft.module as Module) ?? "General",
      personas: (draft.personas as Persona[]) ?? ["Admin"],
      durationMin: Number(draft.durationMin ?? 5),
      views: 0,
      completion: 0,
      updatedDaysAgo: 0,
      url: draft.url!,
      description: draft.description ?? "",
    };
    persist([next, ...assets]);
    setOpen(false);
    setDraft({ source: "Loom", module: "General", personas: ["Admin"] });
  };

  const modules: Module[] = [
    "Firm Model", "Scheduler", "Forecast", "AI Review", "Integrations", "Reporting", "General",
  ];
  const personas: Persona[] = ["Admin", "Scheduler", "Partner", "Consultant"];
  const sources: Source[] = ["Loom", "Scribe", "Guidde", "PDF", "Slide"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <GraduationCap className="h-3.5 w-3.5" />
              Customer Enablement
            </div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Training Library</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Reusable Loom walkthroughs, Scribe SOPs, and enablement assets — tagged by product module and audience.
              Clone into any customer enablement plan.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add asset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add training asset</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input
                  placeholder="Title"
                  value={draft.title ?? ""}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
                <Input
                  placeholder="URL (Loom / Scribe / Guidde share link)"
                  value={draft.url ?? ""}
                  onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                />
                <div className="grid grid-cols-3 gap-2">
                  <Select value={draft.source as string} onValueChange={(v) => setDraft({ ...draft, source: v as Source })}>
                    <SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger>
                    <SelectContent>{sources.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={draft.module as string} onValueChange={(v) => setDraft({ ...draft, module: v as Module })}>
                    <SelectTrigger><SelectValue placeholder="Module" /></SelectTrigger>
                    <SelectContent>{modules.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Min"
                    value={draft.durationMin ?? ""}
                    onChange={(e) => setDraft({ ...draft, durationMin: Number(e.target.value) })}
                  />
                </div>
                <Textarea
                  placeholder="What does this asset teach?"
                  value={draft.description ?? ""}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
                <div className="flex flex-wrap gap-1.5">
                  {personas.map((p) => {
                    const on = (draft.personas as Persona[])?.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          const cur = (draft.personas as Persona[]) ?? [];
                          setDraft({
                            ...draft,
                            personas: on ? cur.filter((x) => x !== p) : [...cur, p],
                          });
                        }}
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-xs transition",
                          on ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground",
                        )}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={addAsset}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Assets", value: stats.total, icon: BookOpen },
            { label: "Total views", value: stats.totalViews.toLocaleString(), icon: Eye },
            { label: "Avg completion", value: `${stats.avgCompletion}%`, icon: GraduationCap },
            { label: "Total runtime", value: `${stats.totalMinutes} min`, icon: Clock },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                  <div className="mt-1 text-2xl font-semibold">{s.value}</div>
                </div>
                <s.icon className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="flex flex-wrap gap-2 p-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search title or description…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={module} onValueChange={setModule}>
              <SelectTrigger className="w-[170px]"><SelectValue placeholder="Module" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All modules</SelectItem>
                {modules.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={persona} onValueChange={setPersona}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Persona" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All personas</SelectItem>
                {personas.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                {sources.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Tabs defaultValue="grid">
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="module">By module</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((a, i) => {
                const Icon = sourceIcon(a.source);
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Card className="h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <Badge variant="outline" className={cn("gap-1", sourceTint[a.source])}>
                            <Icon className="h-3 w-3" /> {a.source}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground">Updated {a.updatedDaysAgo}d ago</span>
                        </div>
                        <CardTitle className="mt-2 text-base leading-snug">{a.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">{a.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="secondary">{a.module}</Badge>
                          {a.personas.map((p) => (
                            <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                          ))}
                        </div>
                        <div className="grid grid-cols-3 gap-2 rounded-md bg-muted/40 p-2 text-center text-[11px]">
                          <div>
                            <div className="text-muted-foreground">Duration</div>
                            <div className="font-semibold">{a.durationMin}m</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Views</div>
                            <div className="font-semibold">{a.views}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Completion</div>
                            <div className="font-semibold">{a.completion}%</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {toEmbedUrl(a.url, a.source) ? (
                            <Button size="sm" className="flex-1" onClick={() => setPreview(a)}>
                              <Play className="mr-1.5 h-3.5 w-3.5" /> Preview
                            </Button>
                          ) : (
                            <Button asChild size="sm" className="flex-1">
                              <a href={a.url} target="_blank" rel="noreferrer">
                                <Play className="mr-1.5 h-3.5 w-3.5" /> Open
                              </a>
                            </Button>
                          )}
                          <Button asChild size="sm" variant="outline">
                            <a href={a.url} target="_blank" rel="noreferrer">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
              {filtered.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="p-8 text-center text-sm text-muted-foreground">
                    No assets match your filters.
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="module" className="mt-4 space-y-4">
            {modules.map((m) => {
              const items = filtered.filter((a) => a.module === m);
              if (items.length === 0) return null;
              return (
                <Card key={m}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{m} · {items.length}</CardTitle>
                  </CardHeader>
                  <CardContent className="divide-y">
                    {items.map((a) => (
                      <div key={a.id} className="flex items-center gap-3 py-2.5">
                        <Badge variant="outline" className={cn(sourceTint[a.source])}>{a.source}</Badge>
                        <div className="flex-1 min-w-0">
                          <div className="truncate text-sm font-medium">{a.title}</div>
                          <div className="truncate text-xs text-muted-foreground">{a.personas.join(", ")} · {a.durationMin} min</div>
                        </div>
                        <span className="text-xs text-muted-foreground">{a.completion}% avg</span>
                        <Button asChild size="sm" variant="ghost">
                          <a href={a.url} target="_blank" rel="noreferrer"><ExternalLink className="h-3.5 w-3.5" /></a>
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>

        <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {preview && (
                  <Badge variant="outline" className={cn(sourceTint[preview.source])}>
                    {preview.source}
                  </Badge>
                )}
                {preview?.title}
              </DialogTitle>
            </DialogHeader>
            {preview && (
              <div className="space-y-3">
                <div className="relative w-full overflow-hidden rounded-md border bg-muted" style={{ paddingTop: "56.25%" }}>
                  <iframe
                    src={toEmbedUrl(preview.url, preview.source) ?? preview.url}
                    className="absolute inset-0 h-full w-full"
                    allow="fullscreen; clipboard-write; encrypted-media"
                    allowFullScreen
                    title={preview.title}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{preview.module} · {preview.personas.join(", ")} · {preview.durationMin} min</span>
                  <a href={preview.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                    Open in {preview.source} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
