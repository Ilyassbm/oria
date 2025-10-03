import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import Subscriptions from "./pages/Subscriptions";
import Clients from "./pages/Clients";
import CreateSubscription from "./pages/CreateSubscription";
import Journal from "./pages/Journal";
import Settings from "./pages/Settings";
import PublicSubscription from "./pages/PublicSubscription";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public auth route */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="clients" element={<Clients />} />
              <Route path="create" element={<CreateSubscription />} />
              <Route path="journal" element={<Journal />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Public subscription page */}
            <Route path="/subscribe/:subscriptionId" element={<PublicSubscription />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
