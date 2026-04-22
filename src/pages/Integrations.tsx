import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plug, CheckCircle2, AlertTriangle, ArrowRight,
  ShoppingBag, RotateCcw, Truck, Calculator,
  Shield, FileText, Zap, Globe, Server,
  ChevronRight, MessageSquare, Sparkles, BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

type Integration = {
  name: string;
  description: string;
  status: "available" | "coming-soon" | "custom";
  bestPractices: string[];
  clientNeeds: string[];
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
    id: "storefront",
    label: "Storefront Platforms",
    icon: ShoppingBag,
    color: "text-blue-500",
    description: "Headless and hosted commerce platforms — connect catalog, checkout, and customer data",
    integrations: [
      {
        name: "Shopify Plus",
        description: "Hosted commerce platform with checkout extensibility and Markets",
        status: "available",
        bestPractices: [
          "Use Shopify Markets for currency and language config; layer CommerceOS on top for duties",
          "Install the CommerceOS app and enable checkout extensions early in the build phase",
          "Sync product feed via the Storefront API rather than CSV exports for accuracy",
          "Configure webhooks for orders/create, fulfillments/update, and refunds/create",
        ],
        clientNeeds: [
          "Shopify Plus organization with admin access",
          "List of active themes and any checkout customizations",
          "Markets configuration (currencies, languages, domains)",
          "Existing app stack (returns, tax, shipping)",
        ],
        dataFlows: ["Orders → CommerceOS ledger", "Catalog → Agentic storefront feed", "Refunds → Returns system"],
        setupSteps: ["Install CommerceOS app", "Authorize scopes", "Configure Markets mapping", "Test sandbox checkout", "Go live"],
      },
      {
        name: "BigCommerce",
        description: "Enterprise SaaS commerce with strong API surface for headless builds",
        status: "available",
        bestPractices: [
          "Use BigCommerce's GraphQL Storefront API for headless builds",
          "Map channels to launch markets to keep inventory clean",
          "Subscribe to webhooks for order, refund, and inventory events",
        ],
        clientNeeds: [
          "BigCommerce store hash and API credentials",
          "Channel and currency configuration",
          "Existing tax/shipping app inventory",
        ],
        dataFlows: ["Orders → CommerceOS", "Catalog → Agentic feed", "Refunds → Returns system"],
        setupSteps: ["Generate API token", "Map channels", "Subscribe webhooks", "Test order flow", "Go live"],
      },
      {
        name: "Salesforce Commerce Cloud",
        description: "Enterprise commerce platform with B2C / B2B configurations",
        status: "custom",
        bestPractices: [
          "Engage SFCC integration partner early for OCAPI / SCAPI provisioning",
          "Plan for site, library, and price book mapping",
          "Run parallel checkout for at least one sprint",
        ],
        clientNeeds: [
          "OCAPI / SCAPI client credentials",
          "Site IDs and price book mapping",
          "Checkout extension hooks documentation",
        ],
        dataFlows: ["Orders → CommerceOS", "Catalog → Agentic feed", "Returns → Refund flows"],
        setupSteps: ["Provision API access", "Map sites & price books", "Build adapters", "Validate", "Cutover"],
      },
    ],
  },
  {
    id: "tax-duties",
    label: "Tax, Duties & Landed Cost",
    icon: Calculator,
    color: "text-emerald-500",
    description: "Calculate accurate landed cost with duties, taxes, and tariffs across global markets",
    integrations: [
      {
        name: "Avalara AvaTax",
        description: "Global tax calculation with US sales tax and international VAT/GST",
        status: "available",
        bestPractices: [
          "Pre-classify your full catalog with HS codes before enabling production",
          "Use AvaTax's CertCapture for B2B exemption certificates",
          "Configure nexus per US state and EU country to avoid over-collection",
          "Reconcile filings monthly between AvaTax and CommerceOS ledger",
        ],
        clientNeeds: [
          "Avalara account with API credentials",
          "Nexus list per state/country",
          "HS code coverage report for catalog",
          "Existing exemption certificate pipeline",
        ],
        dataFlows: ["Cart → Tax calculation", "Order → AvaTax document", "Refund → AvaTax credit memo"],
        setupSteps: ["Connect Avalara API", "Map tax codes", "Configure nexus", "Test scenarios", "Go live"],
      },
      {
        name: "Zonos",
        description: "Cross-border duties, taxes, and IOSS made simple",
        status: "available",
        bestPractices: [
          "Use Zonos Hello to display duties at PDP for higher conversion",
          "Enable DDP at checkout for premium customer experience",
          "Configure IOSS for EU shipments under €150 to bypass customs delays",
        ],
        clientNeeds: [
          "Zonos account with API credentials",
          "HS codes and country of origin per SKU",
          "IOSS / OSS registration status",
          "Carrier accounts for DDP shipping labels",
        ],
        dataFlows: ["Cart → Landed cost quote", "Order → Customs documents", "Shipment → DDP label"],
        setupSteps: ["Connect Zonos", "Upload HS codes", "Enable DDP markets", "Test customs flow", "Go live"],
      },
      {
        name: "TaxJar",
        description: "Sales tax automation focused on US ecommerce",
        status: "available",
        bestPractices: [
          "Use TaxJar's economic nexus monitoring to register proactively",
          "Map product taxability codes for SKUs with reduced or exempt rates",
          "Schedule monthly auto-filing to reduce manual workload",
        ],
        clientNeeds: [
          "TaxJar account",
          "Nexus list per state",
          "Product taxability mapping",
        ],
        dataFlows: ["Cart → Tax calculation", "Order → TaxJar transaction", "Filing → State remittance"],
        setupSteps: ["Connect TaxJar", "Map product codes", "Set nexus", "Test filings", "Go live"],
      },
    ],
  },
  {
    id: "payments",
    label: "Payments & Fraud",
    icon: Plug,
    color: "text-violet-500",
    description: "Global payment gateways and fraud prevention across regions and currencies",
    integrations: [
      {
        name: "Stripe",
        description: "Global payment platform with cards, wallets, and 35+ local methods",
        status: "available",
        bestPractices: [
          "Enable Stripe Payment Element to surface local methods automatically per region",
          "Use Radar with custom rules tuned for each launch market",
          "Settle in local currency where possible to reduce FX fees",
          "Enable Klarna, Afterpay, and iDEAL for the markets that prefer them",
        ],
        clientNeeds: [
          "Stripe account with international entities enabled",
          "Risk policy and chargeback playbook",
          "List of preferred local payment methods per market",
          "PCI compliance documentation",
        ],
        dataFlows: ["Checkout → Payment auth", "Capture → Order paid", "Refund → Returns flow"],
        setupSteps: ["Connect Stripe", "Enable Payment Element", "Configure Radar rules", "Test per market", "Go live"],
      },
      {
        name: "Adyen",
        description: "Enterprise unified commerce payments with rich local method support",
        status: "available",
        bestPractices: [
          "Use Adyen RevenueAccelerate for retry logic on soft declines",
          "Enable network tokens for higher auth rates on recurring",
          "Configure dynamic 3DS based on risk score per market",
        ],
        clientNeeds: [
          "Adyen merchant account",
          "Local entity setup per market",
          "Risk thresholds and 3DS policy",
        ],
        dataFlows: ["Checkout → Payment", "Capture → Settlement", "Refund → Returns"],
        setupSteps: ["Provision Adyen", "Configure methods", "Set risk rules", "Test", "Go live"],
      },
      {
        name: "Signifyd",
        description: "Chargeback protection with guaranteed fraud decisions",
        status: "available",
        bestPractices: [
          "Send full order context (device, customer, history) for accurate decisions",
          "Use chargeback guarantee on high-AOV international orders",
          "Auto-cancel declined orders to free inventory quickly",
        ],
        clientNeeds: [
          "Signifyd account",
          "Order data sharing agreement",
          "Chargeback dispute workflow documentation",
        ],
        dataFlows: ["Order → Risk decision", "Approved → Fulfillment", "Declined → Auto-cancel"],
        setupSteps: ["Connect Signifyd", "Configure decisioning", "Map workflows", "Test", "Go live"],
      },
    ],
  },
  {
    id: "returns",
    label: "Returns & Revenue Retention",
    icon: RotateCcw,
    color: "text-orange-500",
    description: "Branded returns, exchanges, and store credit flows that retain revenue before refunds",
    integrations: [
      {
        name: "Loop Returns",
        description: "Exchange-first returns platform built for Shopify brands",
        status: "available",
        bestPractices: [
          "Lead with exchanges and bonus credit to retain revenue before refunds happen",
          "Configure return windows per market to match local consumer law",
          "Use shop-now flows to convert refund intent into new orders",
        ],
        clientNeeds: [
          "Loop account",
          "Return policy documentation per market",
          "Carrier accounts for return labels",
        ],
        dataFlows: ["Return request → Loop", "Decision → Refund/exchange", "Restock → Inventory"],
        setupSteps: ["Connect Loop", "Configure policies", "Set up labels", "Test flows", "Go live"],
      },
      {
        name: "Narvar",
        description: "Post-purchase experience including tracking and returns",
        status: "available",
        bestPractices: [
          "Combine branded tracking with returns to keep customers in your ecosystem",
          "Use predictive ETAs to reduce 'where is my order' tickets",
          "Surface store credit incentives in the returns flow",
        ],
        clientNeeds: [
          "Narvar account",
          "Brand assets and email templates",
          "Carrier tracking integrations",
        ],
        dataFlows: ["Shipment → Tracking page", "Return → RMA workflow", "Refund → Store credit option"],
        setupSteps: ["Connect Narvar", "Brand templates", "Wire tracking", "Test", "Go live"],
      },
    ],
  },
  {
    id: "logistics",
    label: "Logistics & Fulfillment",
    icon: Truck,
    color: "text-rose-500",
    description: "3PL, multi-carrier shipping, and global fulfillment for cross-border commerce",
    integrations: [
      {
        name: "ShipBob",
        description: "Global 3PL with US, UK, EU, AU, and CA fulfillment centers",
        status: "available",
        bestPractices: [
          "Distribute inventory across regional fulfillment centers to reduce duties exposure",
          "Use ShipBob's reorder point alerts to avoid stockouts on hero SKUs",
          "Enable customs document automation for international shipments",
        ],
        clientNeeds: [
          "ShipBob account with active warehouses",
          "Inventory distribution plan per region",
          "SKU dimensions, weights, and HS codes",
        ],
        dataFlows: ["Order → ShipBob fulfillment", "Shipment → Tracking", "Returns → Restock"],
        setupSteps: ["Connect ShipBob", "Configure warehouses", "Sync inventory", "Test fulfillment", "Go live"],
      },
      {
        name: "EasyPost",
        description: "Multi-carrier shipping API for rate shopping and label generation",
        status: "available",
        bestPractices: [
          "Rate-shop across UPS, FedEx, DHL, USPS to reduce shipping cost per order",
          "Use address verification to reduce undeliverable shipments",
          "Cache rates per destination zone to keep checkout fast",
        ],
        clientNeeds: [
          "EasyPost API key",
          "Carrier accounts (UPS, FedEx, DHL, USPS)",
          "Service-level agreements per market",
        ],
        dataFlows: ["Cart → Rate quote", "Order → Label", "Tracking → Customer notifications"],
        setupSteps: ["Connect EasyPost", "Add carriers", "Configure rate shopping", "Test", "Go live"],
      },
      {
        name: "DHL Express",
        description: "International express shipping with DDP support",
        status: "available",
        bestPractices: [
          "Use DHL Express for premium DDP delivery to reduce customs friction",
          "Enable on-demand pickup for warehouse efficiency",
          "Pre-clear high-volume lanes for faster customs",
        ],
        clientNeeds: [
          "DHL Express account",
          "Customs documentation process",
          "DDP / DAP service preferences per lane",
        ],
        dataFlows: ["Order → DHL label", "Customs → Clearance", "Delivery → Notifications"],
        setupSteps: ["Connect DHL", "Configure services", "Test customs flow", "Go live"],
      },
    ],
  },
  {
    id: "compliance",
    label: "Compliance & Regulatory",
    icon: Shield,
    color: "text-teal-500",
    description: "GPSR, IOSS, restricted SKUs, and regulatory documentation across markets",
    integrations: [
      {
        name: "CommerceOS Compliance Engine",
        description: "Built-in GPSR, IOSS, and restricted SKU enforcement at checkout",
        status: "available",
        bestPractices: [
          "Map a GPSR responsible person for every EU market before activation",
          "Block restricted SKUs at the cart level rather than at checkout",
          "Run quarterly tariff classification audits with brand legal",
        ],
        clientNeeds: [
          "GPSR responsible person details per EU market",
          "Restricted SKU lists per region",
          "CE / RoHS / FDA documentation",
          "IOSS / OSS / VAT registration status",
        ],
        dataFlows: ["SKU → Compliance check", "Cart → Restriction enforcement", "Order → Customs docs"],
        setupSteps: ["Configure responsible persons", "Upload restricted lists", "Map docs", "Test enforcement", "Go live"],
      },
      {
        name: "Avalara Cross-Border",
        description: "HS code classification and trade compliance",
        status: "available",
        bestPractices: [
          "Run AI-assisted HS classification on the full catalog before launch",
          "Re-validate codes annually or when tariffs change materially",
          "Capture country of origin for every SKU to support FTA claims",
        ],
        clientNeeds: [
          "Catalog with descriptions and images",
          "Country of origin per SKU",
          "Existing classification spreadsheets",
        ],
        dataFlows: ["SKU → HS classification", "Order → Customs docs", "Shipment → Trade compliance"],
        setupSteps: ["Connect Avalara CB", "Run classification", "Validate", "Sync to catalog", "Go live"],
      },
    ],
  },
  {
    id: "agentic",
    label: "Agentic Storefront",
    icon: Sparkles,
    color: "text-amber-500",
    description: "AI agents and feeds powering the next generation of commerce experiences",
    integrations: [
      {
        name: "CommerceOS Agentic Feed",
        description: "Native AI-ready product feed with attribute enrichment and live context",
        status: "available",
        bestPractices: [
          "Enrich every SKU with rich attributes (use, occasion, audience) for better agent answers",
          "Wire live inventory and price signals so agents never recommend stockouts",
          "Define brand voice and guardrails before opening to public traffic",
          "Run a controlled pilot at 5-10% traffic before full rollout",
        ],
        clientNeeds: [
          "Product catalog with images and copy",
          "Brand voice guidelines and prohibited topics",
          "FAQ and post-purchase content",
          "Pilot traffic split plan",
        ],
        dataFlows: ["Catalog → Enriched feed", "Inventory → Live signals", "Conversation → Order"],
        setupSteps: ["Provision API keys", "Sync feed", "Configure voice", "Run pilot", "Scale"],
      },
      {
        name: "OpenAI / ChatGPT Shopping",
        description: "Surface your products inside ChatGPT and the OpenAI ecosystem",
        status: "available",
        bestPractices: [
          "Submit a product feed that mirrors your storefront catalog 1:1",
          "Use structured attributes (sizes, materials, certifications) for accurate matching",
          "Refresh inventory and prices at least hourly",
        ],
        clientNeeds: [
          "OpenAI merchant account",
          "Public product feed URL",
          "Inventory sync infrastructure",
        ],
        dataFlows: ["Feed → ChatGPT index", "Conversation → Storefront", "Click → Checkout"],
        setupSteps: ["Submit feed", "Validate", "Enable channel", "Monitor", "Iterate"],
      },
      {
        name: "Perplexity Shop",
        description: "Native commerce surface inside Perplexity answers",
        status: "coming-soon",
        bestPractices: [
          "Provide structured catalog with strong attribute coverage",
          "Use comparison-ready attributes to win 'best X for Y' queries",
        ],
        clientNeeds: [
          "Perplexity merchant onboarding",
          "Catalog feed",
          "Inventory & price sync",
        ],
        dataFlows: ["Feed → Perplexity", "Answer → Storefront", "Click → Checkout"],
        setupSteps: ["Apply", "Submit feed", "Validate", "Enable", "Monitor"],
      },
    ],
  },
  {
    id: "communications",
    label: "Customer Communications",
    icon: MessageSquare,
    color: "text-indigo-500",
    description: "Email, SMS, and lifecycle messaging across the post-purchase experience",
    integrations: [
      {
        name: "Klaviyo",
        description: "Email & SMS for ecommerce lifecycle marketing",
        status: "available",
        bestPractices: [
          "Sync orders, returns, and shipment events for full lifecycle automation",
          "Segment by market for region-specific promotions and compliance",
          "Use abandoned-checkout flows tuned per launch market",
        ],
        clientNeeds: [
          "Klaviyo account & API key",
          "Brand assets and email templates",
          "Consent records per region",
        ],
        dataFlows: ["Orders → Klaviyo events", "Returns → Lifecycle flows", "Browse → Abandonment"],
        setupSteps: ["Connect Klaviyo", "Map events", "Build flows", "Test sends", "Go live"],
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics & BI",
    icon: BarChart3,
    color: "text-cyan-500",
    description: "Business intelligence and reporting for cross-border performance",
    integrations: [
      {
        name: "Custom BI Integration",
        description: "Connect to any BI platform for advanced commerce analytics",
        status: "custom",
        bestPractices: [
          "Export orders, returns, and duties data on a nightly schedule",
          "Map market and channel hierarchies for drill-down reporting",
          "Configure real-time dashboards for international AOV and return rate",
        ],
        clientNeeds: [
          "BI platform details (Looker, Tableau, Power BI, etc.)",
          "KPI definitions per market",
          "Data warehouse connection details",
          "Reporting cadence",
        ],
        dataFlows: ["Orders → Warehouse", "Returns → Dashboards", "Compliance → Audit reports"],
        setupSteps: ["Connect warehouse", "Map data models", "Build dashboards", "Validate", "Go live"],
      },
    ],
  },
];

export default function Integrations() {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const totalIntegrations = categories.reduce((sum, c) => sum + c.integrations.length, 0);
  const availableCount = categories.reduce((sum, c) => sum + c.integrations.filter(i => i.status === "available").length, 0);

  return (
    <DashboardLayout>
      <motion.div {...fadeUp} className="space-y-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Plug className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Connect CommerceOS to the storefront, tax, payment, returns, and logistics tools your brands already use. Best practices, data requirements, and setup guides for every integration.
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
                <p className="text-xs text-muted-foreground">Pre-built & Ready</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Globe className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{categories.length}</p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="all" className="text-xs">All Categories</TabsTrigger>
            <TabsTrigger value="best-practices" className="text-xs">Best Practices</TabsTrigger>
            <TabsTrigger value="client-needs" className="text-xs">Client Requirements</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.div key={category.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={cn("h-5 w-5", category.color)} />
                            <CardTitle className="text-base">{category.label}</CardTitle>
                          </div>
                          <Badge variant="secondary" className="text-[10px]">
                            {category.integrations.length} {category.integrations.length === 1 ? "tool" : "tools"}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs">{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {category.integrations.map((integration) => (
                          <button
                            key={integration.name}
                            onClick={() => { setSelectedIntegration(integration); setSelectedCategory(category.label); }}
                            className="w-full flex items-center justify-between p-2.5 rounded-md border bg-muted/30 hover:bg-muted/60 transition-colors text-left group"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">{integration.name}</span>
                              <Badge
                                variant="outline"
                                className={cn("text-[9px] px-1.5", {
                                  "border-emerald-500/30 text-emerald-600": integration.status === "available",
                                  "border-amber-500/30 text-amber-600": integration.status === "coming-soon",
                                  "border-blue-500/30 text-blue-600": integration.status === "custom",
                                })}
                              >
                                {integration.status === "available" ? "Ready" : integration.status === "coming-soon" ? "Soon" : "Custom"}
                              </Badge>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </button>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="best-practices" className="space-y-4">
            <Accordion type="multiple" defaultValue={[categories[0].id]} className="space-y-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <AccordionItem key={category.id} value={category.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex items-center gap-2">
                        <Icon className={cn("h-4 w-4", category.color)} />
                        <span className="font-semibold text-sm">{category.label}</span>
                        <Badge variant="secondary" className="text-[10px] ml-2">{category.integrations.length}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pb-4">
                      {category.integrations.map((integration) => (
                        <Card key={integration.name} className="border-muted">
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Shield className="h-3.5 w-3.5 text-primary" />
                              {integration.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="px-4 pb-3">
                            <ul className="space-y-1.5">
                              {integration.bestPractices.map((bp, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                  <span>{bp}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </TabsContent>

          <TabsContent value="client-needs" className="space-y-4">
            <Accordion type="multiple" defaultValue={[categories[0].id]} className="space-y-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <AccordionItem key={category.id} value={category.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex items-center gap-2">
                        <Icon className={cn("h-4 w-4", category.color)} />
                        <span className="font-semibold text-sm">{category.label}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pb-4">
                      {category.integrations.map((integration) => (
                        <Card key={integration.name} className="border-muted">
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <FileText className="h-3.5 w-3.5 text-primary" />
                              {integration.name}
                              <span className="text-xs font-normal text-muted-foreground">— What we need from clients</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="px-4 pb-3">
                            <ul className="space-y-1.5">
                              {integration.clientNeeds.map((need, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                                  <span>{need}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedIntegration} onOpenChange={() => setSelectedIntegration(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            {selectedIntegration && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <DialogTitle className="text-lg">{selectedIntegration.name}</DialogTitle>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px]", {
                        "border-emerald-500/30 text-emerald-600": selectedIntegration.status === "available",
                        "border-blue-500/30 text-blue-600": selectedIntegration.status === "custom",
                        "border-amber-500/30 text-amber-600": selectedIntegration.status === "coming-soon",
                      })}
                    >
                      {selectedIntegration.status === "available" ? "Pre-built" : selectedIntegration.status === "coming-soon" ? "Coming Soon" : "Custom Build"}
                    </Badge>
                  </div>
                  <DialogDescription>{selectedIntegration.description}</DialogDescription>
                  {selectedCategory && (
                    <Badge variant="secondary" className="w-fit text-[10px]">{selectedCategory}</Badge>
                  )}
                </DialogHeader>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-primary" /> Data Flows
                  </h4>
                  <div className="space-y-1.5">
                    {selectedIntegration.dataFlows.map((flow, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-md px-3 py-2">
                        <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                        <span>{flow}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <Server className="h-3.5 w-3.5 text-primary" /> Setup Steps
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedIntegration.setupSteps.map((step, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs bg-muted/40 rounded-full px-3 py-1.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">{i + 1}</span>
                        <span className="text-foreground">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-primary" /> Best Practices
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedIntegration.bestPractices.map((bp, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-primary" /> What We Need From Clients
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedIntegration.clientNeeds.map((need, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                        <span>{need}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
}
