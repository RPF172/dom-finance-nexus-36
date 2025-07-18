import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PledgeHall from "./pages/PledgeHall";
import DoctrineReader from "./pages/DoctrineReader";
import LessonView from "./pages/LessonView";
import Assignments from "./pages/Assignments";
import Tribute from "./pages/Tribute";
import Profile from "./pages/Profile";
import Social from "./pages/Social";
import Friends from "./pages/Friends";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pledgehall" element={<PledgeHall />} />
            <Route path="/doctrine" element={<DoctrineReader />} />
            <Route path="/lesson/:id" element={<LessonView />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/tribute" element={<Tribute />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/social" element={<Social />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/admin/*" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
