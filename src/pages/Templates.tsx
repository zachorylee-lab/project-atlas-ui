import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";

const templates = [
  { name: "Customer Kickoff Deck", category: "Kickoff", phase: "kickoff", downloads: 142, rating: 4.8, updated: "Mar 12, 2026" },
  { name: "Project Charter Template", category: "Kickoff", phase: "kickoff", downloads: 98, rating: 4.6, updated: "Feb 28, 2026" },
  { name: "Technical Requirements Doc", category: "Handoff", phase: "handoff", downloads: 187, rating: 4.9, updated: "Mar 18, 2026" },
  { name: "Data Migration Checklist", category: "Build", phase: "build", downloads: 76, rating: 4.5, updated: "Mar 5, 2026" },
  { name: "UAT Test Plan", category: "Testing", phase: "testing", downloads: 112, rating: 4.7, updated: "Feb 20, 2026" },
  { name: "Go-Live Runbook", category: "Go-Live", phase: "golive", downloads: 134, rating: 4.9, updated: "Mar 15, 2026" },
  { name: "Hypercare Tracker", category: "Hypercare", phase: "hypercare", downloads: 63, rating: 4.4, updated: "Jan 30, 2026" },
  { name: "Sales Handoff Form", category: "Handoff", phase: "handoff", downloads: 201, rating: 4.8, updated: "Mar 20, 2026" },
  { name: "RACI Matrix Template", category: "Kickoff", phase: "kickoff", downloads: 89, rating: 4.3, updated: "Feb 14, 2026" },
];

const categories = ["All", "Handoff", "Kickoff", "Build", "Testing", "Go-Live", "Hypercare"];

import { useState } from "react";

export default function Templates() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? templates : templates.filter(t => t.category === filter);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold">Templates Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Standardized templates across all implementation phases. Download and customize.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((template, i) => (
            <motion.div key={template.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="rounded-lg bg-primary/8 p-2">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className={`phase-badge phase-${template.phase} text-[10px]`}>
                      {template.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold mt-3">{template.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Download className="h-3 w-3" />{template.downloads}</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3" />{template.rating}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{template.updated}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
