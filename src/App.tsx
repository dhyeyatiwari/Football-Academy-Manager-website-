import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicHome from "@/pages/PublicHome";
import NotFound from "@/pages/NotFound";
import PortalLayout from "@/components/portal/PortalLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminPlayers from "@/pages/admin/AdminPlayers";
import AdminCoaches from "@/pages/admin/AdminCoaches";
import AdminTeams from "@/pages/admin/AdminTeams";
import AdminParents from "@/pages/admin/AdminParents";
import AdminTraining from "@/pages/admin/AdminTraining";
import AdminAttendance from "@/pages/admin/AdminAttendance";
import AdminMatches from "@/pages/admin/AdminMatches";
import AdminFees from "@/pages/admin/AdminFees";
import AdminAnnouncements from "@/pages/admin/AdminAnnouncements";
import CoachDashboard from "@/pages/coach/CoachDashboard";
import CoachTeams from "@/pages/coach/CoachTeams";
import CoachTraining from "@/pages/coach/CoachTraining";
import CoachMatches from "@/pages/coach/CoachMatches";
import CoachSessionPlans from "@/pages/coach/CoachSessionPlans";
import CoachAttendance from "@/pages/coach/CoachAttendance";
import CoachPlayerDevelopment from "@/pages/coach/CoachPlayerDevelopment";
import ParentDashboard from "@/pages/parent/ParentDashboard";
import ParentChildren from "@/pages/parent/ParentChildren";
import ParentMatches from "@/pages/parent/ParentMatches";
import ParentTraining from "@/pages/parent/ParentTraining";
import ParentPayments from "@/pages/parent/ParentPayments";
import ParentSubscriptions from "@/pages/parent/ParentSubscriptions";
import ParentAnnouncements from "@/pages/parent/ParentAnnouncements";
import ParentSettings from "@/pages/parent/ParentSettings";
import { LoginPage, AuthGuard } from "@/components/portal/AuthGuard";

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

          {/* Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Portal Routes */}
          <Route path="/admin/*" element={
            <AuthGuard allowedRoles={['admin']}>
              <PortalLayout role="admin" />
            </AuthGuard>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="players" element={<AdminPlayers />} />
            <Route path="coaches" element={<AdminCoaches />} />
            <Route path="teams" element={<AdminTeams />} />
            <Route path="parents" element={<AdminParents />} />
            <Route path="training" element={<AdminTraining />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="matches" element={<AdminMatches />} />
            <Route path="fees" element={<AdminFees />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="settings" element={<AdminDashboard />} />
          </Route>

          {/* Coach Portal Routes */}
          <Route path="/coach/*" element={
            <AuthGuard allowedRoles={['coach', 'admin']}>
              <PortalLayout role="coach" />
            </AuthGuard>
          }>
            <Route index element={<CoachDashboard />} />
            <Route path="teams" element={<CoachTeams />} />
            <Route path="training" element={<CoachTraining />} />
            <Route path="session-plans" element={<CoachSessionPlans />} />
            <Route path="matches" element={<CoachMatches />} />
            <Route path="attendance" element={<CoachAttendance />} />
            <Route path="reports" element={<CoachPlayerDevelopment />} />
            <Route path="settings" element={<CoachDashboard />} />
          </Route>

          {/* Parent Portal Routes */}
          <Route path="/parent/*" element={
            <AuthGuard allowedRoles={['parent', 'admin']}>
              <PortalLayout role="parent" />
            </AuthGuard>
          }>
            <Route index element={<ParentDashboard />} />
            <Route path="children" element={<ParentChildren />} />
            <Route path="matches" element={<ParentMatches />} />
            <Route path="training" element={<ParentTraining />} />
            <Route path="payments" element={<ParentPayments />} />
            <Route path="subscriptions" element={<ParentSubscriptions />} />
            <Route path="announcements" element={<ParentAnnouncements />} />
            <Route path="settings" element={<ParentSettings />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;