import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import Playbook from "./pages/Playbook";
import Templates from "./pages/Templates";
import ActiveProjects from "./pages/ActiveProjects";
import Metrics from "./pages/Metrics";
import SalesHandoff from "./pages/SalesHandoff";
import DataWorkflows from "./pages/DataWorkflows";
import Integrations from "./pages/Integrations";
import NotFound from "./pages/NotFound";

import PMTasks from "./pages/PMTasks";
import InterviewPrep from "./pages/InterviewPrep";
import DemoMode from "./pages/DemoMode";
import RACI from "./pages/RACI";
import RAIDLog from "./pages/RAIDLog";
import IntegrationSetup from "./pages/IntegrationSetup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/playbook" element={<Playbook />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/projects" element={<ActiveProjects />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/workflows" element={<DataWorkflows />} />
          <Route path="/handoff" element={<SalesHandoff />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/raci" element={<RACI />} />
          <Route path="/raid" element={<RAIDLog />} />
          <Route path="/integration-setup" element={<IntegrationSetup />} />
          
          <Route path="/pm-tasks" element={<PMTasks />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
          <Route path="/demo" element={<DemoMode />} />
          <Route path="/demo/:step" element={<DemoMode />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
