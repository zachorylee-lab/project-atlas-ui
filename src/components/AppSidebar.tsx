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
  ClipboardCheck,
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
  { title: "Payments Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Recovery & KPIs", url: "/metrics", icon: BarChart3 },
  { title: "Merchant Rollouts", url: "/projects", icon: Kanban },
  { title: "Implementation Playbook", url: "/playbook", icon: BookOpen },
  { title: "Templates & Compliance", url: "/templates", icon: FolderOpen },
  { title: "Payment Workflows", url: "/workflows", icon: Database },
  { title: "Partner Integrations", url: "/integrations", icon: Plug },
  { title: "Merchant Onboarding", url: "/handoff", icon: ArrowRightLeft },
  { title: "Advisory Deck", url: "/deck", icon: Presentation },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent">
            <span className="text-sm font-bold text-accent-foreground">Y</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-accent-foreground">Yeeld</span>
              <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">Payment Systems</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-wider">
            Navigation
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
            <p className="text-[11px] text-sidebar-foreground/70">Yeeld Console · v2026.1</p>
            <p className="text-[10px] text-sidebar-foreground/50 mt-0.5">Surcharging · Advisory · Dev</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
