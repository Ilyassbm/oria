import { useState } from "react";
import { BarChart3, Users, Plus, Calendar, Settings, Home } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import oriaLogoWhite from "@/assets/oria-logo-white.png";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Tableau de bord", url: "/", icon: Home },
  { title: "Abonnements", url: "/subscriptions", icon: BarChart3 },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Journal", url: "/journal", icon: Calendar },
  { title: "Nouveau", url: "/create", icon: Plus },
  { title: "Paramètres", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path || (path !== "/" && currentPath.startsWith(path));
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-accent text-muted-foreground hover:text-foreground";

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarContent className="p-4">
        <div className="mb-8 flex items-center gap-3">
          <img 
            src={oriaLogoWhite} 
            alt="Oria" 
            className="h-12 w-auto object-contain brightness-0 dark:brightness-100 invert dark:invert-0 transition-all"
          />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${getNavCls({ isActive })}`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{item.title}</span>
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
}