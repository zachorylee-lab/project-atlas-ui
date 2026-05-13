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
  Briefcase,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
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
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Metrics", url: "/metrics", icon: BarChart3 },
  { title: "Active Projects", url: "/projects", icon: Kanban },
  { title: "Playbook", url: "/playbook", icon: BookOpen },
  { title: "Templates", url: "/templates", icon: FolderOpen },
  { title: "Data Workflows", url: "/workflows", icon: Database },
  { title: "Integrations", url: "/integrations", icon: Plug },
  { title: "Sales Handoff", url: "/handoff", icon: ArrowRightLeft },
  { title: "Executive Reporting", url: "/deck", icon: Presentation },
  { title: "Director View", url: "/deck-director", icon: Briefcase },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">R</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-accent-foreground">RentFlow</span>
              <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">Rental Finance OS</span>
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
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
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
            <p className="text-[11px] text-sidebar-foreground/60">v1.0 · Internal Tool</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
