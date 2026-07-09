import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plug, CheckCircle2, ArrowRight, Clock, User2, Building2, Zap,
  Database, Users, Calendar, BarChart3, Briefcase, KeyRound, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };

type Owner = "Customer" | "Dayshape" | "Joint";

type DetailedStep = {
  title: string;
  owner: Owner;
  duration: string;
  description: string;
  dayshapeRole: string;
};

type Integration = {
  name: string;
  description: string;
  status: "available" | "coming-soon" | "custom";
  overview: string;
  howDayshapeDoesIt: string;
  bestPractices: string[];
  customerNeeds: string[];
  dataFlows: string[];
  detailedSteps: DetailedStep[];
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
    id: "hris",
    label: "HRIS & People Data",
    icon: Users,
    color: "text-orange-500",
    description: "HR systems that feed staff, roles, grades, skills, and org hierarchy into Dayshape",
    integrations: [
      {
        name: "Workday HCM",
        description: "Enterprise HRIS: people, org, grades, competencies, absences, joiners/leavers/movers",
        status: "available",
        overview:
          "Workday is typically the customer's system of record for who works at the firm, what grade they are, and when they're off. Dayshape reads this nightly and layers scheduling and forecasting on top.",
        howDayshapeDoesIt:
          "Dayshape provides a Workday RaaS (Reports-as-a-Service) integration pack out-of-the-box: pre-built report specs, field mappings for Worker + Job + Absence, and a scheduled connector that runs nightly at 02:00 in the customer's time zone. The Dayshape SIC configures the mapping, the customer's Workday admin publishes the reports, and Dayshape monitors the sync in the Integrations Health dashboard.",
        bestPractices: [
          "Use Workday RaaS reports for reliable delta pulls — avoid direct Web Services",
          "Establish Workday Employee ID as the canonical join key across all systems",
          "Sync absences bidirectionally to prevent double-booking",
          "Agree JLM SLAs (joiners/leavers/movers) — target < 24h propagation",
        ],
        customerNeeds: [
          "Workday integration systems admin (ISA)",
          "Read access to Worker, Job, and Absence data",
          "Data governance sign-off on which fields leave Workday",
        ],
        dataFlows: [
          "Workday → Dayshape: people, org, grades, absences (nightly)",
          "Dayshape → Workday: utilisation signals (optional, weekly)",
        ],
        detailedSteps: [
          {
            title: "Provision a Workday integration system user (ISU)",
            owner: "Customer",
            duration: "1 day",
            description:
              "Customer's Workday admin creates a dedicated ISU with a strong password rotation policy, and a Domain Security Policy granting Get and Report access to Worker, Job Profile, Organisation, and Absence domains.",
            dayshapeRole: "Dayshape provides the exact scope list and reviews the security policy before it's activated.",
          },
          {
            title: "Publish Dayshape's RaaS report specs",
            owner: "Joint",
            duration: "2–3 days",
            description:
              "Dayshape ships pre-built XML report specifications for Worker, Org Hierarchy, Grades, and Absences. The customer imports these into Workday Studio, publishes them as web services, and shares the endpoint URLs.",
            dayshapeRole: "Dayshape SIC walks the Workday ISA through the import and validates the sample output.",
          },
          {
            title: "Map roles, grades, and offices to the Firm Model",
            owner: "Joint",
            duration: "3–5 days",
            description:
              "Workday values (e.g. 'Sr Consultant, Chicago') are mapped to Dayshape grades and offices in the Configuration Workbook. Anything that doesn't map is flagged for the customer's Head of Resourcing to decide.",
            dayshapeRole: "Dayshape drives the workshops, drafts the mapping, and owns the sign-off record.",
          },
          {
            title: "Reconcile a full week's data in sandbox",
            owner: "Joint",
            duration: "1 week",
            description:
              "Run the nightly connector against a Dayshape sandbox, reconcile headcount, grade mix, and absence counts against Workday reports for a full working week. Any variance > 0.5% is investigated.",
            dayshapeRole: "Dayshape produces the reconciliation report; the customer's People Ops team signs it off.",
          },
          {
            title: "Cut over to production and monitor",
            owner: "Dayshape",
            duration: "1 day + 2 weeks Hypercare",
            description:
              "Sync goes live on production Dayshape. For the first two weeks the SIC monitors the nightly run and any deltas surface in the Integrations Health dashboard within 15 minutes.",
            dayshapeRole: "Dayshape owns the production monitoring; the customer gets alerts if the feed fails.",
          },
        ],
      },
      {
        name: "BambooHR / HiBob / SAP SuccessFactors",
        description: "Mid-market and enterprise HRIS options for firms not on Workday",
        status: "available",
        overview:
          "The same integration pattern as Workday, adapted to the customer's HRIS. Each has a supported connector; the moving parts (mapping, reconciliation, cutover) are identical.",
        howDayshapeDoesIt:
          "Dayshape maintains native connectors for BambooHR, HiBob, and SuccessFactors that use each platform's REST API with an OAuth 2.0 or API-key auth model. The customer creates an integration user; Dayshape configures the connector, the field mapping, and the sync cadence.",
        bestPractices: [
          "Standardise your role/grade taxonomy across offices before you sync",
          "Document how contractors, secondees, and part-timers are handled",
          "Confirm ownership of leaver deprovisioning end-to-end",
        ],
        customerNeeds: ["HRIS admin", "API keys or OAuth app", "Data mapping document"],
        dataFlows: ["HRIS → Dayshape (people, org, absences) — nightly or hourly"],
        detailedSteps: [
          {
            title: "Create the integration user or OAuth app",
            owner: "Customer",
            duration: "1 day",
            description:
              "Customer generates API credentials scoped to the fields Dayshape needs (people, jobs, absences). No write access required.",
            dayshapeRole: "Dayshape provides the exact scope list and receives credentials via secure vault.",
          },
          {
            title: "Configure the Dayshape connector",
            owner: "Dayshape",
            duration: "1 day",
            description:
              "Dayshape configures the connector in the customer's tenant, sets the schedule, and runs a first extract into sandbox.",
            dayshapeRole: "Dayshape owns end-to-end.",
          },
          {
            title: "Map fields to the Firm Model",
            owner: "Joint",
            duration: "2–3 days",
            description:
              "Grades, offices, and employment types are mapped in the Configuration Workbook. Contractor and secondee rules documented.",
            dayshapeRole: "Dayshape drafts the mapping; customer's People Ops confirms.",
          },
          {
            title: "Pilot sync with a subset of the firm",
            owner: "Joint",
            duration: "3–5 days",
            description:
              "Sync 1–2 offices or a single practice. Reconcile counts and spot-check individuals. Fix mapping edge cases.",
            dayshapeRole: "Dayshape produces the pilot reconciliation report.",
          },
          {
            title: "Go-live firm-wide",
            owner: "Dayshape",
            duration: "1 day",
            description:
              "Turn on for the full firm. Monitor the first nightly run and confirm counts.",
            dayshapeRole: "Dayshape owns; customer is informed.",
          },
        ],
      },
    ],
  },
  {
    id: "practice",
    label: "Practice Management & Engagements",
    icon: Briefcase,
    color: "text-pink-500",
    description: "The system of record for engagements, clients, budgets, WIP, and time actuals",
    integrations: [
      {
        name: "CCH Axcess",
        description: "Wolters Kluwer practice management — engagements, clients, staff, time and billing",
        status: "available",
        overview:
          "For firms on CCH Axcess, the engagement master lives there. Dayshape schedules against those engagements and reads time actuals back to drive utilisation and realisation reporting.",
        howDayshapeDoesIt:
          "Dayshape has a productised CCH Axcess connector using the CCH Axcess API. It reads engagements, clients, budgets, and time transactions on a nightly schedule (or hourly for time actuals). Dayshape's SIC owns the engagement type mapping — the piece that always needs firm-specific decisions.",
        bestPractices: [
          "Treat CCH engagement master as the source of truth — Dayshape schedules against it",
          "Map CCH engagement types to Dayshape templates before go-live, not after",
          "Push time actuals from CCH into Dayshape for utilisation + realisation reporting",
          "Reconcile daily during Hypercare to catch drift early",
        ],
        customerNeeds: [
          "CCH Axcess admin",
          "API integration user with read scope",
          "Documented engagement type taxonomy",
        ],
        dataFlows: [
          "CCH → Dayshape: engagements, clients, budgets (nightly)",
          "CCH → Dayshape: time transactions (hourly)",
        ],
        detailedSteps: [
          {
            title: "Provision CCH Axcess API user",
            owner: "Customer",
            duration: "2 days",
            description:
              "Customer's CCH admin creates an API user with read access to Engagement, Client, Staff, and Time modules. Provides the tenant ID and API base URL.",
            dayshapeRole: "Dayshape confirms the required CCH modules are licensed and scopes the API user.",
          },
          {
            title: "Inventory and map engagement types",
            owner: "Joint",
            duration: "1 week",
            description:
              "Every CCH engagement type is listed in the Configuration Workbook and mapped to a Dayshape engagement template (Annual audit, Tax compliance – 1120, Advisory, etc.). Unmapped types are decided by the practice leads.",
            dayshapeRole: "Dayshape runs the mapping workshops with each practice; documents and signs off.",
          },
          {
            title: "Backfill open engagements into sandbox",
            owner: "Dayshape",
            duration: "3 days",
            description:
              "Load all currently-open CCH engagements into a Dayshape sandbox. Spot-check budgets, staff, and dates against CCH.",
            dayshapeRole: "Dayshape owns; customer PM validates a sample.",
          },
          {
            title: "Validate WIP tie-out with finance",
            owner: "Joint",
            duration: "1 week",
            description:
              "Reconcile hours and dollars for a completed month between CCH and Dayshape. Finance team signs off variance is < 0.1%.",
            dayshapeRole: "Dayshape produces the tie-out report; customer's controller signs off.",
          },
          {
            title: "Go-live and enter daily reconciliation in Hypercare",
            owner: "Dayshape",
            duration: "1 day + 2 weeks Hypercare",
            description:
              "Production sync enabled. For the first two weeks the SIC runs a daily reconciliation report; any variance is investigated same-day.",
            dayshapeRole: "Dayshape owns Hypercare; customer sees the reconciliation report each morning.",
          },
        ],
      },
      {
        name: "Practice Engine",
        description: "Practice management platform common in mid-market and large accounting firms",
        status: "available",
        overview:
          "Same pattern as CCH — Practice Engine holds engagements, Dayshape schedules against them and reads actuals back for reporting.",
        howDayshapeDoesIt:
          "Dayshape uses the Practice Engine REST API. Nightly sync of engagements and clients; hourly sync of time transactions. Dayshape's SIC drives the engagement taxonomy mapping and the parent/child client hierarchy decisions.",
        bestPractices: [
          "Use Practice Engine's REST API for engagement master and time actuals",
          "Confirm client hierarchy (parent/child) is preserved in Dayshape",
          "Version the engagement type mapping so template changes are auditable",
        ],
        customerNeeds: ["Practice Engine admin", "API credentials", "Client + engagement taxonomy"],
        dataFlows: ["Practice Engine → Dayshape: engagements, clients, budgets, time actuals"],
        detailedSteps: [
          {
            title: "Enable Practice Engine REST API and issue credentials",
            owner: "Customer",
            duration: "2 days",
            description:
              "Customer's Practice Engine admin enables the REST API (may require a Wolters Kluwer support ticket) and generates an API key for Dayshape.",
            dayshapeRole: "Dayshape provides the required scopes and receives credentials via secure vault.",
          },
          {
            title: "Map client hierarchy and engagement types",
            owner: "Joint",
            duration: "1 week",
            description:
              "Parent/child client relationships and engagement types are captured in the Configuration Workbook and mapped to Dayshape.",
            dayshapeRole: "Dayshape leads the mapping workshops with each practice.",
          },
          {
            title: "Sync engagements into sandbox and reconcile",
            owner: "Dayshape",
            duration: "3 days",
            description:
              "Full open engagement backlog is loaded and reconciled against Practice Engine.",
            dayshapeRole: "Dayshape owns; customer signs off a sample.",
          },
          {
            title: "Reconcile time actuals for one month",
            owner: "Joint",
            duration: "1 week",
            description:
              "A completed month's time is reconciled hour-by-hour. Variance target < 0.5%.",
            dayshapeRole: "Dayshape produces the report; customer's controller signs off.",
          },
          {
            title: "Go-live with daily monitoring",
            owner: "Dayshape",
            duration: "1 day + 2 weeks Hypercare",
            description:
              "Production cutover; Dayshape monitors the daily reconciliation during Hypercare.",
            dayshapeRole: "Dayshape owns Hypercare.",
          },
        ],
      },
      {
        name: "Thomson Reuters Practice CS",
        description: "Practice management for accounting firms — engagements, time, billing",
        status: "available",
        overview:
          "Practice CS integrates via scheduled exports (or the newer API where licensed). Same integration pattern — engagements in, actuals in, Dayshape drives scheduling on top.",
        howDayshapeDoesIt:
          "Dayshape supports both the Practice CS API (where the customer has it licensed) and scheduled file exports for firms on the classic deployment. Nightly cadence for engagements, hourly (API) or nightly (file) for time actuals.",
        bestPractices: [
          "Confirm export cadence supports at least nightly sync of engagements",
          "Version the engagement type mapping so changes are auditable",
        ],
        customerNeeds: [
          "Practice CS admin",
          "Export mechanism (API or scheduled file)",
          "Engagement type mapping",
        ],
        dataFlows: ["Practice CS → Dayshape: engagements, time actuals"],
        detailedSteps: [
          {
            title: "Choose transport: API or scheduled file",
            owner: "Joint",
            duration: "2 days",
            description:
              "Dayshape and customer confirm which Practice CS licence is in use and pick the appropriate transport.",
            dayshapeRole: "Dayshape recommends based on licence and volumes.",
          },
          {
            title: "Configure export or API credentials",
            owner: "Customer",
            duration: "2–3 days",
            description:
              "Customer sets up either scheduled export jobs or API credentials scoped to engagements and time.",
            dayshapeRole: "Dayshape provides the exact spec.",
          },
          {
            title: "Map engagement types",
            owner: "Joint",
            duration: "1 week",
            description:
              "Practice CS engagement types mapped to Dayshape templates in the Configuration Workbook.",
            dayshapeRole: "Dayshape drives.",
          },
          {
            title: "Load history and reconcile",
            owner: "Dayshape",
            duration: "3 days",
            description:
              "Backfill open engagements and reconcile counts.",
            dayshapeRole: "Dayshape owns.",
          },
          {
            title: "Go-live and monitor",
            owner: "Dayshape",
            duration: "1 day + 2 weeks",
            description: "Production cutover with Hypercare monitoring.",
            dayshapeRole: "Dayshape owns Hypercare.",
          },
        ],
      },
    ],
  },
  {
    id: "finance",
    label: "Finance & ERP",
    icon: BarChart3,
    color: "text-violet-500",
    description: "Finance/ERP systems for WIP, revenue recognition, and realisation reporting",
    integrations: [
      {
        name: "NetSuite / Sage Intacct / Deltek Vantagepoint",
        description: "Finance / ERP systems that own billing, WIP, and revenue",
        status: "available",
        overview:
          "The finance system owns billing and revenue; Dayshape owns planned effort. Two-way integration lets Dayshape push planned revenue for forecast alignment and pull actuals for realisation reporting.",
        howDayshapeDoesIt:
          "Dayshape has connectors for the three major PS ERPs. Weekly outbound push of approved time and planned revenue after each finance close cutoff; weekly inbound pull of actuals. Dayshape's SIC works closely with the customer's finance controller because this is the integration finance cares most about.",
        bestPractices: [
          "Agree the accounting calendar (fiscal periods, close cutoffs) up front",
          "Reconcile WIP monthly during Hypercare to build finance team trust",
          "Send planned revenue by engagement into finance for forecast alignment",
        ],
        customerNeeds: ["Finance system admin", "Chart of accounts / cost centres", "Fiscal calendar"],
        dataFlows: [
          "ERP → Dayshape: rates, actuals (weekly)",
          "Dayshape → ERP: approved time, planned revenue (weekly)",
        ],
        detailedSteps: [
          {
            title: "Provision ERP integration user",
            owner: "Customer",
            duration: "2 days",
            description:
              "Customer's finance IT team creates an integration user with the scopes Dayshape needs (time, revenue, chart of accounts).",
            dayshapeRole: "Dayshape provides the scope list.",
          },
          {
            title: "Map cost centres and chart of accounts",
            owner: "Joint",
            duration: "1 week",
            description:
              "Every Dayshape practice/office is mapped to a cost centre; time-code categories mapped to GL codes.",
            dayshapeRole: "Dayshape drives the workshop with finance.",
          },
          {
            title: "Reconcile a pilot period",
            owner: "Joint",
            duration: "2 weeks",
            description:
              "For a completed month, reconcile approved time and revenue between Dayshape and the ERP. Variance target < 0.05%.",
            dayshapeRole: "Dayshape produces the reconciliation; finance signs off.",
          },
          {
            title: "Sign off with the CFO's team",
            owner: "Customer",
            duration: "1 week",
            description:
              "Formal sign-off from the customer's CFO or controller.",
            dayshapeRole: "Dayshape supports the sign-off review meeting.",
          },
          {
            title: "Go-live at month-end and Hypercare",
            owner: "Dayshape",
            duration: "1 month",
            description:
              "Go-live is aligned to a month-end so the first live push is a clean period. Dayshape monitors the first close cycle.",
            dayshapeRole: "Dayshape owns Hypercare.",
          },
        ],
      },
    ],
  },
  {
    id: "calendar",
    label: "Calendar & Productivity",
    icon: Calendar,
    color: "text-rose-500",
    description: "Publishing Dayshape bookings to individual calendars and pulling personal availability",
    integrations: [
      {
        name: "Microsoft 365 / Outlook",
        description: "Two-way calendar sync — bookings to Outlook, absences back to Dayshape",
        status: "available",
        overview:
          "Consultants live in Outlook. Dayshape writes their bookings into Outlook so they see their schedule in the calendar they already use, and reads absences back to prevent over-booking.",
        howDayshapeDoesIt:
          "Dayshape uses Microsoft Graph API with application permissions and tenant admin consent — not per-user OAuth, which would break as soon as someone changes their password. The Dayshape SIC coordinates the Entra ID (Azure AD) app registration with the customer's M365 admin.",
        bestPractices: [
          "Use application permissions with tenant admin consent — not per-user OAuth",
          "Filter which meeting categories flow back to Dayshape",
          "Handle recurring bookings carefully to avoid event explosion",
        ],
        customerNeeds: ["Microsoft 365 tenant admin", "Graph API app registration", "Calendar sync policy"],
        dataFlows: ["Dayshape → Outlook: bookings", "Outlook → Dayshape: absences, blocked time"],
        detailedSteps: [
          {
            title: "Register the Dayshape app in Entra ID",
            owner: "Customer",
            duration: "1 day",
            description:
              "Customer's M365 admin registers a new app for Dayshape in Entra ID and captures the app ID and tenant ID.",
            dayshapeRole: "Dayshape provides the exact app registration checklist and required scopes.",
          },
          {
            title: "Grant Graph API scopes with tenant admin consent",
            owner: "Customer",
            duration: "1 day",
            description:
              "M365 admin grants Calendars.ReadWrite and User.Read.All (application scope) and provides admin consent for the whole tenant.",
            dayshapeRole: "Dayshape validates the granted scopes and receives the client secret via secure vault.",
          },
          {
            title: "Agree the calendar sync policy",
            owner: "Joint",
            duration: "3 days",
            description:
              "Firm decides: what meeting categories flow back to Dayshape as blocking, how PTO is represented, whether Dayshape bookings appear as free/busy/tentative in Outlook.",
            dayshapeRole: "Dayshape SIC drives the decision workshop; captures in the Configuration Workbook.",
          },
          {
            title: "Pilot with a single user cohort",
            owner: "Joint",
            duration: "1 week",
            description:
              "Enable for 20–50 users across grades. Confirm bookings appear correctly and absences flow back.",
            dayshapeRole: "Dayshape monitors; customer coordinates the pilot users.",
          },
          {
            title: "Firm-wide rollout",
            owner: "Dayshape",
            duration: "1 day + 1 week monitoring",
            description:
              "Enable for the whole firm. Monitor Graph API rate limits and event volumes.",
            dayshapeRole: "Dayshape owns.",
          },
        ],
      },
      {
        name: "Google Workspace",
        description: "Two-way calendar sync for firms on Google Workspace",
        status: "available",
        overview:
          "Same value as the Outlook integration for Google Workspace firms.",
        howDayshapeDoesIt:
          "Dayshape uses a Google Cloud service account with domain-wide delegation, scoped to Calendar. Customer's Workspace admin authorises the service account in the Admin Console.",
        bestPractices: [
          "Use a domain-wide delegation service account",
          "Document handling of shared calendars and delegates",
        ],
        customerNeeds: ["Google Workspace super admin", "Ability to authorise a service account"],
        dataFlows: ["Dayshape → Google Calendar: bookings", "Google → Dayshape: absences"],
        detailedSteps: [
          {
            title: "Create a Google Cloud service account",
            owner: "Joint",
            duration: "1 day",
            description:
              "Dayshape provides the JSON of the service account it uses; customer's Workspace admin authorises it.",
            dayshapeRole: "Dayshape creates the service account and provides the client ID.",
          },
          {
            title: "Authorise domain-wide delegation",
            owner: "Customer",
            duration: "1 day",
            description:
              "In Workspace Admin Console → API Controls, authorise the client ID with Calendar scope.",
            dayshapeRole: "Dayshape provides the exact scope string.",
          },
          {
            title: "Pilot with a user cohort",
            owner: "Joint",
            duration: "1 week",
            description:
              "Enable for 20–50 users. Validate bookings and absences.",
            dayshapeRole: "Dayshape monitors.",
          },
          {
            title: "Firm-wide rollout",
            owner: "Dayshape",
            duration: "1 day",
            description: "Enable domain-wide.",
            dayshapeRole: "Dayshape owns.",
          },
        ],
      },
    ],
  },
  {
    id: "migration",
    label: "Migrations from Legacy Resourcing",
    icon: ArrowRight,
    color: "text-amber-500",
    description: "Retain, ProStaff, Deltek, spreadsheets, and in-house tools — the systems Dayshape typically replaces",
    integrations: [
      {
        name: "Retain / ProStaff / Deltek / Spreadsheets",
        description: "Extract → map → load → parallel-run → cutover → decommission",
        status: "available",
        overview:
          "Most Dayshape customers are replacing something. The migration approach is the same regardless of source: inventory, rebuild the taxonomy in Dayshape (don't copy legacy quirks), load 12–24 months of history, parallel-run for a full weekly cycle, then cut over.",
        howDayshapeDoesIt:
          "Dayshape has a migration accelerator: extract templates for the common legacy systems, a mapping workbook, a bulk-load API, and a parallel-run reconciliation report. The SIC runs the migration as a distinct workstream inside the Configuration Workbook.",
        bestPractices: [
          "Inventory every active engagement and open booking before quoting the migration",
          "Migrate a rolling 12–24 months of history so partners keep prior-year context",
          "Rebuild the role/grade/skill taxonomy in Dayshape rather than copying legacy quirks",
          "Run parallel scheduling for one full weekly cycle before cutover",
        ],
        customerNeeds: [
          "Read-only export from legacy system",
          "Legacy taxonomy documentation",
          "Historical time actuals for at least 12 months",
        ],
        dataFlows: [
          "Legacy export → Dayshape: engagements, bookings, 12–24m history",
          "Parallel run → cutover → legacy decommission",
        ],
        detailedSteps: [
          {
            title: "Inventory legacy state",
            owner: "Joint",
            duration: "2 weeks",
            description:
              "Every active engagement, open booking, role, grade, and skill in the legacy system is inventoried. Anything ambiguous is decided in workshops.",
            dayshapeRole: "Dayshape drives; customer's resource managers provide the data.",
          },
          {
            title: "Rebuild taxonomy in the Firm Model",
            owner: "Joint",
            duration: "2 weeks",
            description:
              "Roles, grades, offices, and skills are (re)designed in Dayshape — not copied from legacy. Legacy → new mapping is captured for the history migration.",
            dayshapeRole: "Dayshape recommends the taxonomy based on best practice across firms.",
          },
          {
            title: "Load 12–24 months of history",
            owner: "Dayshape",
            duration: "1–2 weeks",
            description:
              "Historical engagements, bookings, and time actuals are loaded so partners retain prior-year context.",
            dayshapeRole: "Dayshape owns end-to-end.",
          },
          {
            title: "Parallel-run for a full weekly cycle",
            owner: "Joint",
            duration: "1–2 weeks",
            description:
              "Resource managers schedule in both legacy and Dayshape for one or two weekly cycles. Variance report generated daily.",
            dayshapeRole: "Dayshape produces the daily variance report; customer schedulers do the double-work.",
          },
          {
            title: "Cutover and decommission legacy",
            owner: "Joint",
            duration: "1 weekend",
            description:
              "Weekend cutover: legacy goes read-only Friday PM, Dayshape becomes system of record Monday AM. Legacy is decommissioned after 90-day parallel history availability.",
            dayshapeRole: "Dayshape runs the runbook.",
          },
        ],
      },
    ],
  },
  {
    id: "sso",
    label: "SSO & Identity",
    icon: KeyRound,
    color: "text-blue-500",
    description: "SAML 2.0 SSO and SCIM provisioning for the Dayshape tenant",
    integrations: [
      {
        name: "Okta / Azure AD / Google Workspace",
        description: "SAML SSO + SCIM for Dayshape user provisioning and de-provisioning",
        status: "available",
        overview:
          "Users sign into Dayshape with their firm credentials. SCIM ensures that when someone leaves the firm their Dayshape access is revoked automatically — no manual clean-up.",
        howDayshapeDoesIt:
          "Dayshape is a pre-built application in the Okta, Azure AD, and Google Workspace catalogues. The customer's IdP admin adds it, configures SCIM with the token Dayshape provides, and maps IdP groups to Dayshape roles.",
        bestPractices: [
          "Use SCIM for de-provisioning the moment a staff member leaves",
          "Build IdP groups that map to Dayshape roles (Resource Manager, Partner, Staff, Admin)",
          "Keep one emergency break-glass local admin outside SSO",
        ],
        customerNeeds: ["IdP admin", "Group/role mapping", "Custom tenant subdomain (optional)"],
        dataFlows: ["IdP → Dayshape: SAML assertions + SCIM provisioning"],
        detailedSteps: [
          {
            title: "Add Dayshape from the IdP app catalogue",
            owner: "Customer",
            duration: "1 hour",
            description:
              "IdP admin adds the pre-built Dayshape app in Okta / Entra / Workspace catalogue.",
            dayshapeRole: "Dayshape provides the tenant ACS URL and Entity ID.",
          },
          {
            title: "Configure SAML with Dayshape metadata",
            owner: "Joint",
            duration: "1 day",
            description:
              "SAML metadata exchanged; test login for one user.",
            dayshapeRole: "Dayshape validates the assertion contents.",
          },
          {
            title: "Configure SCIM provisioning",
            owner: "Customer",
            duration: "1 day",
            description:
              "SCIM endpoint and bearer token from Dayshape entered into IdP; sync started.",
            dayshapeRole: "Dayshape provides SCIM token; monitors the initial sync.",
          },
          {
            title: "Map IdP groups to Dayshape roles",
            owner: "Joint",
            duration: "2 days",
            description:
              "Groups like 'Resource Managers – US' mapped to Dayshape roles. Documented in Configuration Workbook.",
            dayshapeRole: "Dayshape drives the mapping.",
          },
          {
            title: "Pilot, roll out, decommission local logins",
            owner: "Dayshape",
            duration: "1 week",
            description:
              "Pilot with 50 users, then all users. Local logins disabled except for the break-glass admin.",
            dayshapeRole: "Dayshape owns.",
          },
        ],
      },
    ],
  },
  {
    id: "reporting",
    label: "Reporting & Data Warehouse",
    icon: Shield,
    color: "text-emerald-500",
    description: "Export Dayshape data to the firm's warehouse and BI stack for firm-wide reporting",
    integrations: [
      {
        name: "Snowflake / BigQuery / Power BI / Tableau",
        description: "Scheduled export of engagements, bookings, utilisation, forecasts, and time actuals",
        status: "available",
        overview:
          "Dayshape data becomes most valuable when it's joined to the firm's other data in the warehouse — finance, marketing, HR. Dayshape pushes hourly or nightly into Snowflake/BigQuery so the firm's analytics team owns downstream reporting.",
        howDayshapeDoesIt:
          "Dayshape has native connectors for Snowflake and BigQuery, and a generic S3/Azure Blob drop for other warehouses. The SIC works with the customer's analytics team on the semantic model and partition strategy.",
        bestPractices: [
          "Partition tables by fiscal period for efficient BI queries",
          "Design a semantic layer (dbt / Power BI dataset) so partners get consistent metrics",
          "Version-control BI models alongside the Dayshape configuration",
        ],
        customerNeeds: ["Warehouse admin", "BI tool licence", "Analytics owner named in RACI"],
        dataFlows: ["Dayshape → Warehouse → BI: utilisation, forecast, realisation, bookings"],
        detailedSteps: [
          {
            title: "Choose destination and cadence",
            owner: "Joint",
            duration: "2 days",
            description:
              "Warehouse (Snowflake, BigQuery, Redshift, etc.) and cadence (hourly, nightly) confirmed.",
            dayshapeRole: "Dayshape recommends based on volumes and BI patterns.",
          },
          {
            title: "Provision destination storage and credentials",
            owner: "Customer",
            duration: "3 days",
            description:
              "Customer provisions the target schema/dataset and shares write credentials.",
            dayshapeRole: "Dayshape provides the schema DDL.",
          },
          {
            title: "Schedule the export and validate counts",
            owner: "Dayshape",
            duration: "3 days",
            description:
              "Dayshape configures the export and runs three days of syncs. Row counts and totals validated.",
            dayshapeRole: "Dayshape owns.",
          },
          {
            title: "Hand off to the analytics team",
            owner: "Joint",
            duration: "1 week",
            description:
              "Analytics team validates the schema, builds the semantic layer, and takes ownership of downstream BI.",
            dayshapeRole: "Dayshape provides the schema doc and the recommended semantic model.",
          },
          {
            title: "Go-live and monitor",
            owner: "Dayshape",
            duration: "1 day + 2 weeks",
            description:
              "Production sync live; Dayshape monitors during Hypercare.",
            dayshapeRole: "Dayshape owns Hypercare.",
          },
        ],
      },
    ],
  },
];

const ownerTint: Record<Owner, string> = {
  Customer: "bg-[hsl(200_70%_50%)]/15 text-[hsl(200_70%_50%)]",
  Dayshape: "bg-primary/15 text-primary",
  Joint: "bg-[hsl(280_55%_55%)]/15 text-[hsl(280_55%_55%)]",
};

const ownerIcon: Record<Owner, React.ElementType> = {
  Customer: Building2,
  Dayshape: Zap,
  Joint: User2,
};

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
            <h1 className="text-2xl font-bold text-foreground">Dayshape Integrations & Data</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Every standard Dayshape integration — with step-by-step setup, who owns each step, how long it takes,
            and how Dayshape does it. Open any integration for the full playbook.
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
                <p className="text-xs text-muted-foreground">Integrations available</p>
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
                <p className="text-xs text-muted-foreground">Native / pre-built</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Database className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{categories.length}</p>
                <p className="text-xs text-muted-foreground">Integration categories</p>
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
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[11px] text-muted-foreground">
                            {i.detailedSteps.length} steps
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-primary">
                            View playbook <ArrowRight className="h-3 w-3" />
                          </span>
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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedIntegration.name}</DialogTitle>
              <DialogDescription>{selectedIntegration.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 pt-2">
              {/* Overview */}
              <div className="rounded-lg border bg-muted/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Overview
                </p>
                <p className="text-sm leading-relaxed">{selectedIntegration.overview}</p>
              </div>

              {/* How Dayshape does it */}
              <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    How Dayshape does it
                  </p>
                </div>
                <p className="text-sm leading-relaxed">{selectedIntegration.howDayshapeDoesIt}</p>
              </div>

              {/* Data flows + Customer needs, side by side */}
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Data flows
                  </p>
                  <ul className="space-y-1.5">
                    {selectedIntegration.dataFlows.map((d) => (
                      <li key={d} className="text-xs font-mono flex items-start gap-2">
                        <ArrowRight className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    What you'll need
                  </p>
                  <ul className="space-y-1.5">
                    {selectedIntegration.customerNeeds.map((c) => (
                      <li key={c} className="text-xs flex items-start gap-2">
                        <span className="h-1 w-1 rounded-full bg-foreground/40 mt-1.5 shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Detailed steps */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Step-by-step playbook
                </p>
                <ol className="space-y-3">
                  {selectedIntegration.detailedSteps.map((step, idx) => {
                    const OwnerIcon = ownerIcon[step.owner];
                    return (
                      <li key={idx} className="relative rounded-lg border bg-card p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            {idx + 1}
                          </div>
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <p className="text-sm font-semibold">{step.title}</p>
                              <div className="flex items-center gap-1.5">
                                <Badge className={cn("text-[10px] gap-1", ownerTint[step.owner])}>
                                  <OwnerIcon className="h-3 w-3" />
                                  {step.owner}
                                </Badge>
                                <Badge variant="outline" className="text-[10px] gap-1">
                                  <Clock className="h-3 w-3" />
                                  {step.duration}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                              {step.description}
                            </p>
                            <div className="rounded-md bg-primary/5 border-l-2 border-primary/40 px-3 py-2">
                              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-0.5">
                                Dayshape's role
                              </p>
                              <p className="text-xs leading-relaxed">{step.dayshapeRole}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Best practices */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Best practices
                </p>
                <ul className="space-y-1.5">
                  {selectedIntegration.bestPractices.map((b) => (
                    <li key={b} className="text-sm flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </DashboardLayout>
  );
}
