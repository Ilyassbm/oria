import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/AppSidebar";
import { Outlet } from "react-router-dom";
import { UserMenu } from "@/components/UserMenu";

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
            </div>
            <UserMenu />
          </header>
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}