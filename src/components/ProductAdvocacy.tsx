import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Megaphone, Lightbulb, Plus } from "lucide-react";
import { motion } from "framer-motion";

const initialAdvocacy = [
  {
    id: "1",
    customer: "Canva Pro",
    useCase: "Segment audience refresh intervals too slow for real-time lifecycle triggers",
    outcome: "Pattern shared with Product; prioritized for Q2 roadmap as a CDI enhancement",
    impact: "roadmap",
    date: "Mar 12, 2026",
  },
  {
    id: "2",
    customer: "MetLife",
    useCase: "Compliance needs native email retention policy controls before enterprise rollout",
    outcome: "Filed with Enterprise Product; tied to regulated financial services vertical expansion",
    impact: "feature-request",
    date: "Mar 18, 2026",
  },
  {
    id: "3",
    customer: "Max Streaming",
    useCase: "Iterable-to-Braze content migration tooling gaps causing 10-day delay",
    outcome: "Escalated to Solutions Engineering; a reusable migration script was shipped to PS playbooks",
    impact: "bug-fix",
    date: "Mar 15, 2026",
  },
];

const impactMeta: Record<string, { label: string; cls: string }> = {
  "feature-request": { label: "Feature Request", cls: "bg-primary/10 text-primary border-primary/30" },
  "bug-fix": { label: "Bug Fix / Tooling", cls: "bg-warning/10 text-warning border-warning/30" },
  roadmap: { label: "Roadmap Input", cls: "bg-success/10 text-success border-success/30" },
};

export function ProductAdvocacy() {
  const [entries, setEntries] = useState(initialAdvocacy);
  const [showForm, setShowForm] = useState(false);
  const [customer, setCustomer] = useState("");
  const [useCase, setUseCase] = useState("");
  const [outcome, setOutcome] = useState("");
  const [impact, setImpact] = useState<keyof typeof impactMeta>("feature-request");

  function addEntry() {
    if (!customer.trim() || !useCase.trim() || !outcome.trim()) return;
    setEntries((prev) => [
      {
        id: Math.random().toString(36).slice(2),
        customer: customer.trim(),
        useCase: useCase.trim(),
        outcome: outcome.trim(),
        impact,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      },
      ...prev,
    ]);
    setCustomer("");
    setUseCase("");
    setOutcome("");
    setImpact("feature-request");
    setShowForm(false);
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-primary" />
            Product Advocacy & Customer Feedback
          </CardTitle>
          <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
            {entries.length} logged
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Customer business use-cases, tooling gaps, and feature requests raised with Product and Engineering.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-lg border p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-3.5 w-3.5 text-accent" />
                  <span className="text-sm font-medium">{entry.customer}</span>
                </div>
                <Badge variant="outline" className={`text-[10px] ${impactMeta[entry.impact].cls}`}>
                  {impactMeta[entry.impact].label}
                </Badge>
              </div>
              <p className="text-sm mt-1.5 leading-snug">{entry.useCase}</p>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                <span className="font-medium text-foreground">Outcome:</span> {entry.outcome}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">{entry.date}</p>
            </motion.div>
          ))}
        </div>

        {showForm ? (
          <div className="mt-4 space-y-2">
            <Input
              placeholder="Customer or project name"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="text-sm"
            />
            <Textarea
              placeholder="Customer use-case or gap"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              className="text-sm min-h-[60px]"
            />
            <Textarea
              placeholder="Outcome / who it was shared with"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="text-sm min-h-[60px]"
            />
            <div className="flex items-center gap-2">
              <select
                value={impact}
                onChange={(e) => setImpact(e.target.value as keyof typeof impactMeta)}
                className="text-sm rounded-md border bg-background px-2 py-1.5"
              >
                {Object.entries(impactMeta).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.label}
                  </option>
                ))}
              </select>
              <Button size="sm" onClick={addEntry} className="ml-auto">
                Log feedback
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => setShowForm(true)}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add customer feedback
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
