import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  Kanban,
  BarChart3,
  ArrowRightLeft,
  Database,
  Plug,
  Presentation,
  ListChecks,
  MessageSquare,
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

const navItems = [
  { title: "PS Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Utilization & Health", url: "/metrics", icon: BarChart3 },
  { title: "Active Implementations", url: "/projects", icon: Kanban },
  { title: "PM Task Board", url: "/pm-tasks", icon: ListChecks },
  { title: "Delivery Playbook", url: "/playbook", icon: BookOpen },
  { title: "Templates & SOWs", url: "/templates", icon: FolderOpen },
  { title: "HCM Modules", url: "/workflows", icon: Database },
  { title: "Integrations", url: "/integrations", icon: Plug },
  { title: "Client Onboarding", url: "/handoff", icon: ArrowRightLeft },
  { title: "Strategic Deck", url: "/deck", icon: Presentation },
  { title: "Interview Prep", url: "/interview-prep", icon: MessageSquare },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent">
            <span className="text-sm font-bold text-accent-foreground">S</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-accent-foreground">Sage HCM</span>
              <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">Professional Services</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider">
            Project Manager Console
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
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
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="rounded-lg bg-sidebar-accent/50 p-3">
            <p className="text-[11px] text-sidebar-foreground/70">Sage HCM Console · v2026.Q2</p>
            <p className="text-[10px] text-sidebar-foreground/50 mt-0.5">HR · Payroll · Benefits · Talent · Time</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
