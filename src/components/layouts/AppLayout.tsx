import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/AppSidebar";
import { Outlet } from "react-router-dom";

import oriaLogo from "@/assets/oria-logo.png";

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card">
            <SidebarTrigger className="lg:hidden" />
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-3">
            <img src={oriaLogo} alt="Oria" className="h-8 w-8" />
            <span className="text-2xl font-bold text-primary">Oria</span>
          </div>
        </div>
          </header>
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}