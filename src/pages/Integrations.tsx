import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plug, CheckCircle2, AlertTriangle, Info, ArrowRight,
  Users, Briefcase, GraduationCap, ShoppingCart, BookOpen,
  MessageSquare, Wallet, Heart, UserCheck, DollarSign,
  Shield, Clock, FileText, Zap, Globe, Server,
  ChevronRight, Star, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

type IntegrationCategory = {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
  integrations: Integration[];
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

const categories: IntegrationCategory[] = [
  {
    id: "ats",
    label: "ATS",
    icon: UserCheck,
    color: "text-blue-500",
    description: "Applicant Tracking Systems — seamless candidate-to-employee data transfer",
    integrations: [
      {
        name: "Workday",
        description: "Enterprise-grade HCM and ATS platform",
        status: "available",
        bestPractices: [
          "Map candidate fields before go-live to avoid data gaps",
          "Configure auto-sync frequency based on hiring volume",
          "Test with a batch of 50 candidates before full migration",
          "Set up webhook notifications for new hire events",
        ],
        clientNeeds: [
          "Workday API credentials (ISU account with integration permissions)",
          "Custom report definitions for candidate export",
          "Field mapping document signed off by HR lead",
          "Staging tenant access for testing",
        ],
        dataFlows: ["New hires → Sona employee records", "Position data → Role mapping", "Org structure → Location hierarchy"],
        setupSteps: ["Provision API credentials", "Configure field mappings", "Test in staging", "Enable production sync"],
      },
      {
        name: "BambooHR",
        description: "Cloud-based HR platform for SMBs",
        status: "available",
        bestPractices: [
          "Use BambooHR's webhook system for real-time sync",
          "Align custom fields before integration setup",
          "Schedule initial bulk import during off-peak hours",
        ],
        clientNeeds: [
          "BambooHR API key (admin access required)",
          "List of custom fields in use",
          "Employee data export for validation",
        ],
        dataFlows: ["Employee records → Sona profiles", "Time-off requests → Absence data", "Department structure → Teams"],
        setupSteps: ["Generate API key", "Map employee fields", "Run test sync", "Go live"],
      },
      {
        name: "SAP SuccessFactors",
        description: "Enterprise HR and talent management",
        status: "available",
        bestPractices: [
          "Engage SAP BASIS team early for API provisioning",
          "Use OData API v2 for maximum compatibility",
          "Plan for complex org hierarchy mapping",
        ],
        clientNeeds: [
          "SAP SuccessFactors API user credentials",
          "OData endpoint configuration",
          "Company structure documentation",
          "IT team availability for firewall/network configuration",
        ],
        dataFlows: ["Employee master data → Sona profiles", "Position management → Roles", "Org units → Location mapping"],
        setupSteps: ["Configure API access", "Set up middleware connection", "Map org hierarchy", "Validate data", "Enable sync"],
      },
      {
        name: "TalentFunnel",
        description: "Recruitment and applicant tracking for frontline hiring",
        status: "available",
        bestPractices: [
          "Configure auto-push for accepted candidates only",
          "Align role taxonomy between systems before go-live",
        ],
        clientNeeds: [
          "TalentFunnel API access",
          "Role mapping spreadsheet",
          "Hiring workflow documentation",
        ],
        dataFlows: ["Accepted candidates → New employee records", "Role data → Position mapping"],
        setupSteps: ["Connect API", "Map roles", "Test candidate flow", "Enable auto-sync"],
      },
    ],
  },
  {
    id: "lms",
    label: "LMS",
    icon: GraduationCap,
    color: "text-emerald-500",
    description: "Learning Management Systems — training compliance and completion tracking",
    integrations: [
      {
        name: "Moodle",
        description: "Open-source learning management platform",
        status: "available",
        bestPractices: [
          "Map mandatory training courses to Sona compliance flags",
          "Set up automated alerts for expiring certifications",
          "Use Moodle web services API for real-time completion sync",
        ],
        clientNeeds: [
          "Moodle admin access for API token generation",
          "List of mandatory training courses with IDs",
          "Certification expiry rules by role",
          "Web services plugin enabled",
        ],
        dataFlows: ["Course completions → Training compliance", "Certifications → Qualification records", "Enrolments → Training schedule"],
        setupSteps: ["Enable web services", "Generate API token", "Map courses to compliance", "Test completion sync", "Go live"],
      },
      {
        name: "Docebo",
        description: "AI-powered enterprise learning platform",
        status: "available",
        bestPractices: [
          "Leverage Docebo's SSO integration for seamless user experience",
          "Sync training completions daily at minimum",
          "Map learning plans to role-based requirements",
        ],
        clientNeeds: [
          "Docebo API credentials (OAuth2 app)",
          "Learning plan structure documentation",
          "SSO configuration details if applicable",
        ],
        dataFlows: ["Learning completions → Compliance tracking", "User enrolments → Training assignments"],
        setupSteps: ["Create OAuth2 app", "Configure webhook events", "Map learning plans", "Enable sync"],
      },
      {
        name: "Your Hippo",
        description: "Social care training and compliance platform",
        status: "available",
        bestPractices: [
          "Align training modules with CQC/regulatory requirements",
          "Configure automatic expiry notifications for mandatory training",
        ],
        clientNeeds: [
          "Your Hippo account with API access",
          "Mandatory training matrix by role",
          "Expiry period definitions",
        ],
        dataFlows: ["Training completions → Staff compliance", "Certificate data → Qualification records"],
        setupSteps: ["Connect API", "Map training modules", "Set expiry rules", "Test and go live"],
      },
    ],
  },
  {
    id: "pos",
    label: "POS",
    icon: ShoppingCart,
    color: "text-orange-500",
    description: "Point of Sale — revenue and demand data for intelligent scheduling",
    integrations: [
      {
        name: "Fourth",
        description: "Hospitality workforce and inventory management",
        status: "available",
        bestPractices: [
          "Pull sales data at 15-min intervals for accurate demand forecasting",
          "Align POS location IDs with Sona site hierarchy",
          "Configure revenue-per-labour-hour targets per location",
        ],
        clientNeeds: [
          "Fourth API credentials",
          "Location/site mapping document",
          "12 months of historical sales data (CSV or API access)",
          "Revenue targets per location",
        ],
        dataFlows: ["Transaction data → Demand forecasting", "Revenue metrics → Labour cost analysis", "Cover counts → Staffing ratios"],
        setupSteps: ["Connect API", "Map locations", "Import historical data", "Configure demand models", "Validate forecasts"],
      },
      {
        name: "Square",
        description: "All-in-one POS and payment platform",
        status: "available",
        bestPractices: [
          "Use Square's webhook API for real-time transaction events",
          "Map Square locations to Sona sites 1:1",
        ],
        clientNeeds: [
          "Square Developer application credentials",
          "Location list with IDs",
          "Historical transaction data access",
        ],
        dataFlows: ["Sales transactions → Demand data", "Location metrics → Staffing insights"],
        setupSteps: ["Create Square app", "Authorise locations", "Map sites", "Enable data sync"],
      },
      {
        name: "Toast",
        description: "Restaurant-focused POS and management platform",
        status: "available",
        bestPractices: [
          "Sync labour data alongside sales for real-time cost tracking",
          "Use Toast's reporting API for end-of-day summaries",
        ],
        clientNeeds: [
          "Toast Partner API access",
          "Restaurant GUID list",
          "Menu and revenue category structure",
        ],
        dataFlows: ["Sales data → Demand forecasting", "Labour reports → Cost analysis", "Menu data → Revenue categories"],
        setupSteps: ["Get Partner API access", "Map restaurants", "Configure data feeds", "Validate"],
      },
      {
        name: "Tenzo",
        description: "AI-powered restaurant analytics platform",
        status: "available",
        bestPractices: [
          "Leverage Tenzo's demand forecasting alongside Sona scheduling",
          "Sync daily sales summaries for labour planning",
        ],
        clientNeeds: [
          "Tenzo API credentials",
          "Location mapping",
          "Forecast model preferences",
        ],
        dataFlows: ["Sales analytics → Demand insights", "Forecast data → Scheduling inputs"],
        setupSteps: ["Connect Tenzo API", "Align location data", "Configure forecast sync", "Go live"],
      },
      {
        name: "Comtrex (Zonal)",
        description: "Hospitality POS and EPOS solutions",
        status: "available",
        bestPractices: [
          "Configure SFTP or API data exchange based on client infrastructure",
          "Schedule data pulls aligned with shift closing times",
        ],
        clientNeeds: [
          "Comtrex/Zonal API or SFTP credentials",
          "Site and terminal mapping",
          "Data format specifications",
        ],
        dataFlows: ["Transaction data → Demand planning", "Cover counts → Staffing levels"],
        setupSteps: ["Set up data connection", "Map sites", "Test data ingestion", "Enable production sync"],
      },
    ],
  },
  {
    id: "care-planning",
    label: "Care Planning",
    icon: Heart,
    color: "text-rose-500",
    description: "Care management platforms — resident needs driving staffing requirements",
    integrations: [
      {
        name: "Nourish",
        description: "Digital care planning and management",
        status: "available",
        bestPractices: [
          "Sync care needs data to inform staffing ratios",
          "Map care categories to skill requirements in Sona",
          "Configure alerts for acuity changes affecting staffing",
        ],
        clientNeeds: [
          "Nourish API access",
          "Care category taxonomy",
          "Staffing ratio rules by care level",
          "Location/home mapping",
        ],
        dataFlows: ["Care needs → Staffing requirements", "Acuity levels → Skill matching", "Resident data → Demand planning"],
        setupSteps: ["Connect API", "Map care categories", "Configure staffing rules", "Test acuity-driven scheduling", "Go live"],
      },
      {
        name: "PCS",
        description: "Person Centred Software — digital care management",
        status: "available",
        bestPractices: [
          "Use dependency levels to drive minimum staffing thresholds",
          "Sync daily to capture care plan updates",
        ],
        clientNeeds: [
          "PCS API credentials",
          "Dependency level definitions",
          "Home/unit structure",
        ],
        dataFlows: ["Dependency data → Minimum staffing", "Care activities → Workload planning"],
        setupSteps: ["Connect PCS API", "Map dependency levels", "Set staffing thresholds", "Validate and go live"],
      },
      {
        name: "CareDocs",
        description: "Electronic care planning system",
        status: "available",
        bestPractices: [
          "Align care plan updates with shift planning cycles",
          "Map resident categories to role requirements",
        ],
        clientNeeds: [
          "CareDocs data export access",
          "Resident categorisation rules",
          "Care home structure documentation",
        ],
        dataFlows: ["Resident needs → Staffing levels", "Care categories → Skill requirements"],
        setupSteps: ["Set up data connection", "Map categories", "Configure rules", "Test and go live"],
      },
    ],
  },
  {
    id: "comms",
    label: "Communications",
    icon: MessageSquare,
    color: "text-indigo-500",
    description: "Messaging and communication platforms for staff engagement",
    integrations: [
      {
        name: "Sona Comms (Built-in)",
        description: "Native in-app messaging and announcements",
        status: "available",
        bestPractices: [
          "Enable push notifications for shift changes and announcements",
          "Use targeted messaging by location and role",
          "Set up automated shift reminder notifications",
        ],
        clientNeeds: [
          "Staff mobile app rollout plan",
          "Communication policy/guidelines",
          "Notification preference defaults by role",
        ],
        dataFlows: ["Shift changes → Push notifications", "Announcements → Targeted messages", "Schedule updates → Staff alerts"],
        setupSteps: ["Configure notification settings", "Set up message templates", "Define audience groups", "Enable push notifications"],
      },
    ],
  },
  {
    id: "ewa",
    label: "Earned Wage Access",
    icon: Wallet,
    color: "text-teal-500",
    description: "Earned Wage Access providers — financial wellbeing for staff",
    integrations: [
      {
        name: "Stream",
        description: "Earned wage access and financial wellbeing",
        status: "available",
        bestPractices: [
          "Sync worked hours in real-time for accurate earned wage calculations",
          "Ensure payroll integration is configured first",
          "Communicate EWA benefit during onboarding",
        ],
        clientNeeds: [
          "Stream partnership agreement",
          "Payroll schedule and pay period definitions",
          "Worked hours data feed configuration",
          "Staff communication plan for EWA rollout",
        ],
        dataFlows: ["Worked hours → Earned wage calculations", "Pay periods → Withdrawal limits", "Employee data → EWA eligibility"],
        setupSteps: ["Set up Stream partnership", "Configure hours data feed", "Align pay periods", "Test withdrawals", "Staff rollout"],
      },
    ],
  },
  {
    id: "tipping",
    label: "Tipping",
    icon: Star,
    color: "text-yellow-500",
    description: "Tip management and distribution platforms",
    integrations: [
      {
        name: "TipJar",
        description: "Digital tipping and tip distribution",
        status: "available",
        bestPractices: [
          "Map tip pools to Sona team/location structure",
          "Sync worked hours for proportional tip distribution",
          "Configure tip reporting for payroll integration",
        ],
        clientNeeds: [
          "TipJar account setup",
          "Tip distribution policy documentation",
          "Team/pool structure aligned with Sona locations",
        ],
        dataFlows: ["Worked hours → Tip allocation", "Team structure → Tip pools", "Tip data → Payroll reporting"],
        setupSteps: ["Connect TipJar", "Map team structures", "Configure distribution rules", "Test tip flows", "Go live"],
      },
    ],
  },
  {
    id: "neutral-vendor",
    label: "Neutral Vendor",
    icon: Briefcase,
    color: "text-slate-500",
    description: "Agency and temporary staffing management",
    integrations: [
      {
        name: "Neuven",
        description: "Neutral vendor management for agency staff",
        status: "available",
        bestPractices: [
          "Sync open shifts to agency platform only after internal fill attempts",
          "Map agency worker profiles to Sona role requirements",
          "Track agency spend alongside permanent staff costs",
        ],
        clientNeeds: [
          "Neuven account and API access",
          "Agency usage policy (fill order, approval rules)",
          "Role and qualification requirements for agency workers",
          "Budget thresholds for agency spend alerts",
        ],
        dataFlows: ["Unfilled shifts → Agency requests", "Agency bookings → Schedule", "Agency costs → Labour spend reporting"],
        setupSteps: ["Connect Neuven API", "Configure fill order rules", "Map roles and qualifications", "Set budget alerts", "Go live"],
      },
    ],
  },
  {
    id: "payroll",
    label: "Payroll",
    icon: DollarSign,
    color: "text-green-500",
    description: "Payroll systems — accurate, automated pay data transfer",
    integrations: [
      {
        name: "Custom Payroll API",
        description: "Bespoke integration with any payroll provider",
        status: "custom",
        bestPractices: [
          "Validate pay rules in Sona match payroll system exactly",
          "Run parallel payroll for at least 2 pay periods before cutover",
          "Automate timesheet approval workflows to reduce pay delays",
          "Configure exception reporting for payroll discrepancies",
        ],
        clientNeeds: [
          "Payroll system API documentation or SFTP details",
          "Complete pay rules document (overtime, premiums, allowances)",
          "Pay period schedule and cutoff dates",
          "Timesheet approval workflow documentation",
          "Payroll team point of contact for UAT",
        ],
        dataFlows: ["Approved timesheets → Payroll input file", "Pay rules → Automated calculations", "Absence data → Pay adjustments", "Overtime → Premium calculations"],
        setupSteps: ["Document pay rules", "Configure Sona pay calculations", "Build export file format", "Run parallel payroll", "Validate and go live"],
      },
    ],
  },
  {
    id: "hr",
    label: "HR Systems",
    icon: Users,
    color: "text-violet-500",
    description: "Core HR platforms — employee lifecycle management",
    integrations: [
      {
        name: "Custom HR Integration",
        description: "Connect to existing HRIS for employee data sync",
        status: "custom",
        bestPractices: [
          "Establish Sona as the source of truth for scheduling data",
          "Sync employee lifecycle events (joiners, leavers, transfers)",
          "Align absence types between HR system and Sona",
        ],
        clientNeeds: [
          "HR system API access or data export capabilities",
          "Employee data fields list and mapping requirements",
          "Absence type taxonomy",
          "Joiner/leaver process documentation",
          "Data governance requirements",
        ],
        dataFlows: ["Employee records → Sona profiles", "Joiners/Leavers → Auto-activation/deactivation", "Absence requests → Schedule adjustments", "Contract changes → Availability updates"],
        setupSteps: ["Audit HR data quality", "Define field mappings", "Configure sync direction", "Test lifecycle events", "Enable production sync"],
      },
    ],
  },
  {
    id: "bookings",
    label: "Bookings",
    icon: BookOpen,
    color: "text-cyan-500",
    description: "Reservation and booking platforms — demand-driven scheduling",
    integrations: [
      {
        name: "Custom Bookings Integration",
        description: "Connect reservation systems for demand-based staffing",
        status: "custom",
        bestPractices: [
          "Sync booking data at least every 30 minutes for accurate demand",
          "Map booking types to staffing requirement models",
          "Configure overbooking thresholds for buffer staffing",
        ],
        clientNeeds: [
          "Booking system API or data feed access",
          "Booking type definitions and staffing impact rules",
          "Historical booking data (6+ months)",
          "Peak period definitions",
        ],
        dataFlows: ["Reservations → Demand forecasting", "Booking volumes → Staffing requirements", "Cancellations → Real-time schedule adjustments"],
        setupSteps: ["Connect booking data source", "Map booking types", "Configure demand models", "Validate against historical data", "Go live"],
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
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Plug className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Connect Sona to the tools your clients already use. Best practices, data requirements, and setup guides for every integration.
          </p>
        </div>

        {/* Summary Cards */}
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

        {/* Integration Categories */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="all" className="text-xs">All Categories</TabsTrigger>
            <TabsTrigger value="best-practices" className="text-xs">Best Practices</TabsTrigger>
            <TabsTrigger value="client-needs" className="text-xs">Client Requirements</TabsTrigger>
          </TabsList>

          {/* All Categories View */}
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

          {/* Best Practices View */}
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

          {/* Client Requirements View */}
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

        {/* Integration Detail Dialog */}
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
                      })}
                    >
                      {selectedIntegration.status === "available" ? "Pre-built" : "Custom Build"}
                    </Badge>
                  </div>
                  <DialogDescription>{selectedIntegration.description}</DialogDescription>
                  {selectedCategory && (
                    <Badge variant="secondary" className="w-fit text-[10px]">{selectedCategory}</Badge>
                  )}
                </DialogHeader>

                <Separator />

                {/* Data Flows */}
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

                {/* Setup Steps */}
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

                {/* Best Practices */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-emerald-500" /> Best Practices
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

                {/* Client Requirements */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> What We Need From Clients
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedIntegration.clientNeeds.map((need, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Info className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
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
