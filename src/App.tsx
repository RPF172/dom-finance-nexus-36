import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { MobileBottomNav } from "@/components/ui/mobile-bottom-nav";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
adx
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PledgeHall from "./pages/PledgeHall";
import BookReader from "./pages/BookReader";
import ReadChapters from "./pages/ReadChapters";
import LearnLessons from "./pages/LearnLessons";
import LessonView from "./pages/LessonView";
import { ChapterView } from "./pages/ChapterView";
import Assignments from "./pages/Assignments";
import Tribute from "./pages/Tribute";
import Profile from "./pages/Profile";
import Social from "./pages/Social";
import Friends from "./pages/Friends";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 pb-16 md:pb-0">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/pledgehall" element={<ProtectedRoute><PledgeHall /></ProtectedRoute>} />
                <Route path="/doctrine" element={<ProtectedRoute><BookReader /></ProtectedRoute>} />
                <Route path="/read" element={<ProtectedRoute><ReadChapters /></ProtectedRoute>} />
                <Route path="/learn" element={<ProtectedRoute><LearnLessons /></ProtectedRoute>} />
                <Route path="/lesson/:id" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
                <Route path="/chapter/:chapterId" element={<ProtectedRoute><ChapterView /></ProtectedRoute>} />
                <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
                <Route path="/tribute" element={<ProtectedRoute><Tribute /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/social" element={<ProtectedRoute><Social /></ProtectedRoute>} />
                <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
                <Route path="/admin/*" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <MobileBottomNav />
          </div>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
