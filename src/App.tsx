import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicHome from "@/pages/PublicHome";
import NotFound from "@/pages/NotFound";
import PortalLayout from "@/components/portal/PortalLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CoachDashboard from "@/pages/coach/CoachDashboard";
import ParentDashboard from "@/pages/parent/ParentDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<PublicHome />} />
          <Route path="/academy" element={<PublicHome />} />
          <Route path="/teams" element={<PublicHome />} />
          <Route path="/matches" element={<PublicHome />} />
          <Route path="/coaching" element={<PublicHome />} />

          {/* Portal Routes */}
          <Route path="/admin/*" element={<PortalLayout role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="teams" element={<AdminDashboard />} />
            <Route path="players" element={<AdminDashboard />} />
            <Route path="matches" element={<AdminDashboard />} />
            <Route path="coaches" element={<AdminDashboard />} />
            <Route path="parents" element={<AdminDashboard />} />
            <Route path="subscriptions" element={<AdminDashboard />} />
            <Route path="facilities" element={<AdminDashboard />} />
            <Route path="settings" element={<AdminDashboard />} />
          </Route>

          <Route path="/coach/*" element={<PortalLayout role="coach" />}>
            <Route index element={<CoachDashboard />} />
            <Route path="teams" element={<CoachDashboard />} />
            <Route path="training" element={<CoachDashboard />} />
            <Route path="matches" element={<CoachDashboard />} />
            <Route path="reports" element={<CoachDashboard />} />
            <Route path="attendance" element={<CoachDashboard />} />
            <Route path="settings" element={<CoachDashboard />} />
          </Route>

          <Route path="/parent/*" element={<PortalLayout role="parent" />}>
            <Route index element={<ParentDashboard />} />
            <Route path="children" element={<ParentDashboard />} />
            <Route path="matches" element={<ParentDashboard />} />
            <Route path="training" element={<ParentDashboard />} />
            <Route path="payments" element={<ParentDashboard />} />
            <Route path="subscriptions" element={<ParentDashboard />} />
            <Route path="settings" element={<ParentDashboard />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;