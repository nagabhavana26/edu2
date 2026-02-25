import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import QuizTake from "./pages/QuizTake";
import NotFound from "./pages/NotFound";
import WordGame from "./pages/WordGame";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <LanguageProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Dashboard />} />
            <Route path="/quizzes" element={<Dashboard />} />
            <Route path="/analytics" element={<Dashboard />} />
            <Route path="/jobs" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/students" element={<Dashboard />} />
            <Route path="/content" element={<Dashboard />} />
            <Route path="/settings" element={<Dashboard />} />
            <Route path="/children" element={<Dashboard />} />
            <Route path="/performance" element={<Dashboard />} />
            <Route path="/alerts" element={<Dashboard />} />
            <Route path="/reports" element={<Dashboard />} />
            <Route path="/users" element={<Dashboard />} />
            <Route path="/voice" element={<Dashboard />} />
            <Route path="/game" element={<WordGame />} />
            <Route path="/quiz/:quizId" element={<QuizTake />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);

export default App;
