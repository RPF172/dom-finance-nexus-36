import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { EnhancedMobileNav } from "@/components/ui/enhanced-mobile-nav";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PledgeHall from "./pages/PledgeHall";
import BookReader from "./pages/BookReader";
import ReadChapters from "./pages/ReadChapters";
import { WeekBasedLearning } from "@/pages/WeekBasedLearning";
import { WeekSlideExperience } from "@/pages/WeekSlideExperience";
import LearningHub from "./pages/LearningHub";
import LearningAnalytics from "./pages/LearningAnalytics";
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
import Compete from "./pages/Compete";
import TypingTrial from "./pages/games/TypingTrial";
import { LearningExperience } from "./pages/LearningExperience";
import CommunityHub from "./pages/CommunityHub";

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
                <Route path="/learning-hub" element={<ProtectedRoute><LearningHub /></ProtectedRoute>} />
                <Route path="/doctrine" element={<ProtectedRoute><BookReader /></ProtectedRoute>} />
                <Route path="/read" element={<ProtectedRoute><ReadChapters /></ProtectedRoute>} />
                <Route path="/learn" element={<ProtectedRoute><WeekBasedLearning /></ProtectedRoute>} />
                <Route path="/week/:weekId/experience" element={<ProtectedRoute><WeekSlideExperience /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><LearningAnalytics /></ProtectedRoute>} />
                <Route path="/lesson/:id" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
                <Route path="/chapter/:chapterId" element={<ProtectedRoute><ChapterView /></ProtectedRoute>} />
                <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
                <Route path="/tribute" element={<ProtectedRoute><Tribute /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/social" element={<ProtectedRoute><Social /></ProtectedRoute>} />
                <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
                <Route path="/admin/*" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                <Route path="/compete" element={<ProtectedRoute><Compete /></ProtectedRoute>} />
                <Route path="/games/typing-trial" element={<ProtectedRoute><TypingTrial /></ProtectedRoute>} />
                <Route path="/learning-experience" element={<ProtectedRoute><LearningExperience /></ProtectedRoute>} />
                <Route path="/learning-experience/:id" element={<ProtectedRoute><LearningExperience /></ProtectedRoute>} />
                <Route path="/community" element={<ProtectedRoute><CommunityHub /></ProtectedRoute>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
        {/* Replace old mobile nav with enhanced version */}
        <EnhancedMobileNav />
          </div>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
