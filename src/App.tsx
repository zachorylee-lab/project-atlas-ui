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
import StrategicDeck from "./pages/StrategicDeck";
import DirectorDeck from "./pages/DirectorDeck";

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
          <Route path="/deck" element={<StrategicDeck />} />
          <Route path="/deck-director" element={<DirectorDeck />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
