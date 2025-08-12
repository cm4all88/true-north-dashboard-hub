
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AutoRefreshProvider } from "./components/dashboard/AutoRefreshProvider";
import { DashboardDataProvider } from "./contexts/DashboardDataContext";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { BudgetProvider } from "./contexts/BudgetContext";
import ProjectsPage from "./pages/budget/ProjectsPage";
import NewProjectPage from "./pages/budget/NewProjectPage";
import EditProjectPage from "./pages/budget/EditProjectPage";
import ArchivedProjectsPage from "./pages/budget/ArchivedProjectsPage";
import ExpensesPage from "./pages/budget/ExpensesPage";
import BudgetDashboardPage from "./pages/budget/BudgetDashboardPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <DashboardDataProvider>
        <AutoRefreshProvider refreshInterval={900000}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Admin />} />
              {/* Budgeting routes */}
              <Route path="/projects" element={
                <BudgetProvider>
                  <ProjectsPage />
                </BudgetProvider>
              } />
              <Route path="/projects/new" element={
                <BudgetProvider>
                  <NewProjectPage />
                </BudgetProvider>
              } />
              <Route path="/projects/edit/:id" element={
                <BudgetProvider>
                  <EditProjectPage />
                </BudgetProvider>
              } />
              <Route path="/projects/archived" element={
                <BudgetProvider>
                  <ArchivedProjectsPage />
                </BudgetProvider>
              } />
              <Route path="/expenses" element={
                <BudgetProvider>
                  <ExpensesPage />
                </BudgetProvider>
              } />
              <Route path="/budget" element={
                <BudgetProvider>
                  <BudgetDashboardPage />
                </BudgetProvider>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AutoRefreshProvider>
      </DashboardDataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
