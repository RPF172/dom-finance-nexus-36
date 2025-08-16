import {
  LayoutDashboard,
  FileText,
  Users,
  BookOpen,
  DollarSign,
  Settings,
  Crown,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Overview",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Week & Slides",
    url: "/admin/week-slides",
    icon: BookOpen,
  },
  {
    title: "Week-Module Links",
    url: "/admin/week-modules",
    icon: FileText,
  },
  {
    title: "Content",
    url: "/admin/content",
    icon: BookOpen,
  },
  {
    title: "Modules",
    url: "/admin/content/modules",
    icon: FileText,
  },
  {
    title: "Students",
    url: "/admin/students",
    icon: Users,
  },
  {
    title: "Tributes",
    url: "/admin/tributes",
    icon: DollarSign,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className="w-64" collapsible="icon">
      <SidebarContent className="bg-sidebar-background border-r border-sidebar-border">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Crown className="h-8 w-8 text-sidebar-primary" />
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">MAGAT ADMIN</h1>
              <p className="text-xs text-sidebar-foreground/60">University Control</p>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className={({ isActive: active }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                          active || isActive(item.url)
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        }`
                      }
                      >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;