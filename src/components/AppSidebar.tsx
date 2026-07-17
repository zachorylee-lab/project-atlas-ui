import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  Kanban,
  BarChart3,
  ArrowRightLeft,
  Database,
  Plug,
  ListChecks,
  MessageSquare,
  Presentation,
  Grid3x3,
  ShieldAlert,
  Settings2,
  GraduationCap,
  Activity,
  ClipboardList,
  ClipboardCheck,
  BookOpenCheck,
  ScrollText,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navGroups: { label: string; items: { title: string; url: string; icon: typeof LayoutDashboard }[] }[] = [
  {
    label: "Overview",
    items: [
      { title: "Implementation Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Portfolio Health", url: "/metrics", icon: BarChart3 },
      { title: "Knowledge Base", url: "/knowledge-base", icon: BookOpenCheck },
    ],
  },
  {
    label: "Pre-Kickoff",
    items: [
      { title: "Sales Handoff", url: "/handoff", icon: ArrowRightLeft },
      { title: "Onboarding Playbook", url: "/playbook", icon: BookOpen },
      { title: "Requirements Gathering", url: "/requirements", icon: ScrollText },
      { title: "RACI Matrix", url: "/raci", icon: Grid3x3 },
      { title: "Templates & SOWs", url: "/templates", icon: FolderOpen },
    ],
  },
  {
    label: "Delivery",
    items: [
      { title: "Active Implementations", url: "/projects", icon: Kanban },
      { title: "Consultant Task Board", url: "/pm-tasks", icon: ListChecks },
      { title: "Workstreams", url: "/workflows", icon: Database },
      { title: "Configuration Workbook", url: "/configuration-workbook", icon: ClipboardList },
      { title: "UAT Tracker", url: "/uat", icon: ClipboardCheck },
      { title: "Integrations & Data", url: "/integrations", icon: Plug },
      { title: "RAID Log", url: "/raid", icon: ShieldAlert },
    ],
  },
  {
    label: "Customer Enablement",
    items: [
      { title: "Training Library", url: "/training-library", icon: GraduationCap },
      { title: "Adoption Tracker", url: "/adoption", icon: Activity },
    ],
  },
  {
    label: "Setup",
    items: [
      { title: "Integration Setup", url: "/integration-setup", icon: Settings2 },
    ],
  },
  {
    label: "Interview & Demo",
    items: [
      { title: "Interview Prep", url: "/interview-prep", icon: MessageSquare },
      { title: "Demo Mode", url: "/demo", icon: Presentation },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <span className="text-sm font-bold text-white">R</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-accent-foreground">Red Oak</span>
              <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">Compliance Implementation Console</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className="hover:bg-sidebar-accent/60 transition-colors"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="rounded-lg bg-sidebar-accent/50 p-3">
            <p className="text-[11px] text-sidebar-foreground/70">Red Oak Delivery · v2026.Q2</p>
            <p className="text-[10px] text-sidebar-foreground/50 mt-0.5">Ad Review · AI Review · Disclosures · Registration · Supervision</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
