import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Subscriptions from "./pages/Subscriptions";
import Clients from "./pages/Clients";
import CreateSubscription from "./pages/CreateSubscription";
import Journal from "./pages/Journal";
import Settings from "./pages/Settings";
import PublicSubscription from "./pages/PublicSubscription";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="clients" element={<Clients />} />
            <Route path="create" element={<CreateSubscription />} />
            <Route path="journal" element={<Journal />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* Public subscription page - outside main layout */}
          <Route path="/subscribe/:subscriptionId" element={<PublicSubscription />} />
          {/* 404 route outside layout */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
