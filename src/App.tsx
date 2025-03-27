import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NostrAuthProvider } from "@/contexts/NostrAuthProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/utils/ScrollToTop";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import QuestPage from "./pages/Quest";
import CreateQuest from "./pages/CreateQuest";
import MyQuest from "./pages/MyQuest";
import NotFound from "./pages/NotFound";
import Timeline from "./pages/Timeline";
import ConnectNostr from "./pages/ConnectNostr";
import Profile from "./pages/Profile";
import CoachDirectory from "./pages/coach-directory";
import RegisterCoach from "./pages/RegisterCoach";
import EscrowDeposit from "./pages/escrow-deposit/EscrowDeposit";
import Notifications from "./pages/Notifications";

const App = () => (
  <BrowserRouter>
    <TooltipProvider>
      <NostrAuthProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/quest/:id" element={<QuestPage />} />
              <Route path="/create" element={<CreateQuest />} />
              <Route path="/escrow-deposit" element={<EscrowDeposit />} />
              <Route path="/my-quests" element={<MyQuest />} />
              <Route path="/connect" element={<ConnectNostr />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/coach-directory" element={<CoachDirectory />} />
              <Route path="/register-coach" element={<RegisterCoach />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
        <Sonner />
      </NostrAuthProvider>
    </TooltipProvider>
  </BrowserRouter>
);

export default App;
