import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plug, CheckCircle2, ArrowRight,
  Database, Smartphone, Mail, BarChart3, ShoppingBag, KeyRound, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

type Integration = {
  name: string;
  description: string;
  status: "available" | "coming-soon" | "custom";
  bestPractices: string[];
  customerNeeds: string[];
  dataFlows: string[];
  setupSteps: string[];
};

type IntegrationCategory = {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
  integrations: Integration[];
};

const categories: IntegrationCategory[] = [
  {
    id: "cdp",
    label: "CDPs & Data Ingestion",
    icon: Database,
    color: "text-fuchsia-500",
    description: "Customer Data Platforms and warehouse-native ingestion that feed user profiles and events into Braze",
    integrations: [
      {
        name: "Segment",
        description: "Standard CDP source: identify, track, group calls land in Braze as users, custom events, and attributes",
        status: "available",
        bestPractices: [
          "Use a server-side Segment source for trusted events; client-side for engagement",
          "Map `userId` → Braze `external_id` and never use anonymous IDs as the primary identifier",
          "Cap custom attributes; design a clean schema before turning on the destination",
          "Stagger replay to avoid rate-limit spikes on first sync",
        ],
        customerNeeds: ["Segment workspace admin", "Schema/tracking plan", "PII review for the destination"],
        dataFlows: ["App/Web → Segment → Braze /users/track", "Segment audiences → Braze user attributes"],
        setupSteps: ["Add Braze destination", "Map identify/track schema", "Replay historical events", "QA in staging", "Promote to production"],
      },
      {
        name: "mParticle",
        description: "Enterprise CDP with audience and identity resolution; common in retail, media, financial services",
        status: "available",
        bestPractices: [
          "Use mParticle IDSync for deterministic identity resolution",
          "Forward only the audiences the lifecycle team needs as Braze segments",
          "Coordinate consent forwarding for GDPR/CCPA states",
        ],
        customerNeeds: ["mParticle workspace admin", "Identity strategy doc", "Audience taxonomy"],
        dataFlows: ["SDKs → mParticle → Braze (events + audiences)", "mParticle Calculated Attributes → Braze attributes"],
        setupSteps: ["Connect Braze output", "Map audiences", "Validate identity resolution", "Pilot send", "Cutover"],
      },
      {
        name: "Snowflake — Cloud Data Ingestion",
        description: "Warehouse-native ingestion of user profiles and events directly from Snowflake (also Databricks, Redshift, BigQuery)",
        status: "available",
        bestPractices: [
          "Use CDI for batch backfill and nightly updates of attributes",
          "Pair with Currents/Cloud Data Sharing for round-trip analytics",
          "Define a staging table contract and version it with the data team",
        ],
        customerNeeds: ["Snowflake account + RBAC role for Braze", "Source tables with `external_id`", "Refresh SLA"],
        dataFlows: ["Snowflake table → CDI sync → Braze user attributes / events"],
        setupSteps: ["Provision Snowflake role", "Define source tables", "Configure sync cadence", "QA counts vs. source", "Go-live"],
      },
    ],
  },
  {
    id: "channels",
    label: "Channels & Messaging",
    icon: Mail,
    color: "text-pink-500",
    description: "Email, SMS, WhatsApp, Push, In-App and Content Card delivery infrastructure",
    integrations: [
      {
        name: "APNs / FCM (Push)",
        description: "Apple Push Notification service and Firebase Cloud Messaging for iOS & Android push",
        status: "available",
        bestPractices: [
          "Use APNs auth key (p8) over cert-based auth — no annual rotation",
          "Configure FCM v1 API; legacy FCM is being deprecated",
          "Always test on a real device per OS major version before launch",
          "Plan push-prompt timing as a Canvas step, not at app open",
        ],
        customerNeeds: ["Apple Developer admin", "Firebase project admin", "Mobile eng pairing for SDK install"],
        dataFlows: ["Braze → APNs/FCM → Device", "Device push receipts → Braze analytics"],
        setupSteps: ["Upload APNs key + FCM service account", "Install SDK", "Test on device", "Soft launch %", "Full rollout"],
      },
      {
        name: "Email — sending domain & DKIM",
        description: "Braze native email channel with custom sending domain, DKIM, SPF, DMARC, and IP warming",
        status: "available",
        bestPractices: [
          "Use a dedicated subdomain (e.g. `mail.brand.com`) — never the root domain",
          "Publish DMARC `p=quarantine` minimum before first send",
          "Warm dedicated IPs over 4–6 weeks to engaged audiences first",
          "Seed-test inbox placement (Gmail, Yahoo, Outlook) before every major campaign",
        ],
        customerNeeds: ["DNS admin for the sending domain", "Brand from-name + reply-to mailbox", "Suppression list from prior ESP"],
        dataFlows: ["Braze → ESP → Inbox", "Bounces/opens/clicks → Braze profile"],
        setupSteps: ["Authenticate domain", "Configure IPs", "Import suppressions", "Seed-test", "Warm + launch"],
      },
      {
        name: "SMS & WhatsApp",
        description: "Two-way SMS via short codes / long codes / 10DLC, and WhatsApp Business Platform messaging",
        status: "available",
        bestPractices: [
          "Use 10DLC registration in the US for compliant A2P SMS",
          "Build an opt-in/STOP keyword flow in Canvas — never message without explicit consent",
          "For WhatsApp, get templates pre-approved by Meta before launch",
        ],
        customerNeeds: ["10DLC brand + campaign approval", "WhatsApp Business Account", "Consent capture proof"],
        dataFlows: ["Braze → Twilio/short-code aggregator → Carrier → Device"],
        setupSteps: ["Register 10DLC", "Apply WA templates", "Build opt-in Canvas", "Pilot", "Scale"],
      },
    ],
  },
  {
    id: "attribution",
    label: "Mobile Attribution",
    icon: BarChart3,
    color: "text-violet-500",
    description: "MMP partners for deep linking, attribution, and uninstall tracking",
    integrations: [
      {
        name: "AppsFlyer / Branch / Adjust / Kochava",
        description: "Mobile measurement partners feeding install + attribution data into Braze for personalization and exclusion",
        status: "available",
        bestPractices: [
          "Send install + media-source attributes into Braze for audience suppression on paid media",
          "Use deferred deep links from Branch/AppsFlyer in Push & Email CTAs",
          "Avoid double-counting opens between MMP and Braze",
        ],
        customerNeeds: ["MMP workspace admin", "iOS/Android app IDs", "Tracking link domains"],
        dataFlows: ["Install → MMP → Braze custom attributes/events", "Braze CTA → MMP deep link → App route"],
        setupSteps: ["Connect MMP", "Map attribution events", "Build deep link template", "QA install", "Production"],
      },
    ],
  },
  {
    id: "ecommerce",
    label: "E-commerce & Catalogs",
    icon: ShoppingBag,
    color: "text-rose-500",
    description: "Shopify, Salesforce Commerce, and Catalogs powering product personalization",
    integrations: [
      {
        name: "Shopify",
        description: "Native Shopify integration: customers, orders, abandoned checkouts into Braze for lifecycle journeys",
        status: "available",
        bestPractices: [
          "Map Shopify `customer.id` → Braze `external_id`",
          "Sync order events to drive purchase-based Canvas branching",
          "Use Braze Catalogs to render live product cards in email and IAM",
        ],
        customerNeeds: ["Shopify admin", "Product catalog feed", "Order webhook permissions"],
        dataFlows: ["Shopify → Braze (customers, orders, checkouts)", "Catalog feed → Braze Catalogs → Liquid render"],
        setupSteps: ["Install app", "Map identifiers", "Sync catalog", "Build first lifecycle Canvas", "Launch"],
      },
    ],
  },
  {
    id: "migration",
    label: "Migrations from Legacy ESPs",
    icon: ArrowRight,
    color: "text-amber-500",
    description: "Iterable, MoEngage, Salesforce Marketing Cloud, Responsys, Adobe Campaign, Airship — common Braze replacements",
    integrations: [
      {
        name: "Iterable / MoEngage / SFMC / Responsys / Airship",
        description: "Standard migration pattern: parallel send → channel cutover → legacy decommission",
        status: "available",
        bestPractices: [
          "Inventory every active program in the legacy tool before quoting the migration",
          "Migrate suppression lists day 1 — there is no scenario where you skip this",
          "Rebuild journeys in Canvas rather than 1:1 lift-and-shift — it's faster and cleaner",
          "Run parallel sends for one full lifecycle cycle (often 4–6 weeks) before cutover",
        ],
        customerNeeds: ["Read-only export from legacy system", "Suppression list", "Template + asset inventory"],
        dataFlows: ["Legacy export → Braze (users + suppressions)", "Parallel sends → cutover → legacy off"],
        setupSteps: ["Inventory", "Migrate suppressions", "Rebuild Canvases", "Parallel send", "Cutover + decommission"],
      },
    ],
  },
  {
    id: "sso",
    label: "SSO & Permissions",
    icon: KeyRound,
    color: "text-blue-500",
    description: "SAML 2.0 SSO and SCIM provisioning for the Braze dashboard",
    integrations: [
      {
        name: "Okta / Azure AD / Google Workspace",
        description: "SAML SSO + SCIM for Braze dashboard user provisioning and de-provisioning",
        status: "available",
        bestPractices: [
          "Use SCIM for de-provisioning the moment a user leaves",
          "Build groups that map to Braze permission roles (Admin, Manager, Campaign Creator, Read-Only)",
          "Keep one emergency break-glass local admin",
        ],
        customerNeeds: ["IdP admin", "Group/role mapping", "Custom dashboard subdomain (optional)"],
        dataFlows: ["IdP → Braze via SAML/SCIM"],
        setupSteps: ["Connect IdP", "Map groups", "Pilot users", "Full rollout", "Decommission local logins"],
      },
    ],
  },
  {
    id: "currents",
    label: "Currents & Cloud Data Sharing",
    icon: Shield,
    color: "text-emerald-500",
    description: "Stream every Braze event back to the customer's data warehouse for analytics, BI, and ML",
    integrations: [
      {
        name: "Currents / Cloud Data Sharing → Snowflake",
        description: "Near-real-time export of message engagement, conversion, and user events to Snowflake/BigQuery/Redshift/S3",
        status: "available",
        bestPractices: [
          "Prefer Snowflake Cloud Data Sharing over Currents file-drop where available — lower latency, zero infra",
          "Partition tables by event date for cost-efficient BI queries",
          "Design a dbt model on top so the analytics team has a clean semantic layer",
        ],
        customerNeeds: ["Snowflake/BigQuery admin", "Storage cost budget", "BI/analytics owner"],
        dataFlows: ["Braze events → Currents/CDS → Customer warehouse → BI"],
        setupSteps: ["Choose destination", "Provision storage", "Stream events", "Validate counts", "Hand off to analytics"],
      },
    ],
  },
];

export default function Integrations() {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const totalIntegrations = categories.reduce((sum, c) => sum + c.integrations.length, 0);
  const availableCount = categories.reduce((sum, c) => sum + c.integrations.filter(i => i.status === "available").length, 0);

  return (
    <DashboardLayout>
      <motion.div {...fadeUp} className="space-y-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Plug className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Braze Integrations & Data</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Standard Braze integration patterns the Delivery Manager coordinates: CDPs, channels, attribution, e-commerce, migrations, SSO, and warehouse export.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Plug className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalIntegrations}</p>
                <p className="text-xs text-muted-foreground">Total Integrations</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{availableCount}</p>
                <p className="text-xs text-muted-foreground">Native / Pre-built</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Smartphone className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{categories.length}</p>
                <p className="text-xs text-muted-foreground">Integration Categories</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            return (
              <Card key={cat.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-muted", cat.color)}>
                      <CatIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{cat.label}</CardTitle>
                      <CardDescription className="text-xs">{cat.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cat.integrations.map((i) => (
                      <button
                        key={i.name}
                        onClick={() => setSelectedIntegration(i)}
                        className="text-left rounded-lg border p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-semibold">{i.name}</p>
                          <Badge variant="secondary" className="text-[10px]">
                            {i.status === "available" ? "Ready" : i.status === "custom" ? "Custom" : "Soon"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{i.description}</p>
                        <div className="flex items-center gap-1 text-[11px] text-primary mt-2">
                          View details <ArrowRight className="h-3 w-3" />
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>

      <Dialog open={!!selectedIntegration} onOpenChange={(open) => !open && setSelectedIntegration(null)}>
        {selectedIntegration && (
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedIntegration.name}</DialogTitle>
              <DialogDescription>{selectedIntegration.description}</DialogDescription>
            </DialogHeader>
            <Separator />
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Best Practices</p>
                <ul className="space-y-1.5">
                  {selectedIntegration.bestPractices.map((b) => (
                    <li key={b} className="text-sm flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Customer Needs</p>
                <ul className="space-y-1.5">
                  {selectedIntegration.customerNeeds.map((c) => (
                    <li key={c} className="text-sm flex items-start gap-2">
                      <span className="h-1 w-1 rounded-full bg-foreground/30 mt-2 shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Data Flows</p>
                <ul className="space-y-1.5">
                  {selectedIntegration.dataFlows.map((d) => (
                    <li key={d} className="text-sm flex items-start gap-2 font-mono text-xs">
                      <ArrowRight className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Setup Steps</p>
                <ol className="space-y-1.5 list-decimal list-inside">
                  {selectedIntegration.setupSteps.map((s) => (
                    <li key={s} className="text-sm">{s}</li>
                  ))}
                </ol>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </DashboardLayout>
  );
}
