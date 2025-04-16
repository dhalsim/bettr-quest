import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { NostrAuthProvider } from "@/contexts/NostrAuthProvider";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';
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
import Profile from "./pages/profile/Profile";
import CoachDirectory from "./pages/coach-directory";
import RegisterCoach from "./pages/RegisterCoach";
import Notifications from "./pages/Notifications";
import Premium from "./pages/Premium";
import { useRef, useEffect } from 'react';
import VerifyProof from "./pages/VerifyProof";
import { pages } from '@/lib/pages';

const HistoryHandler = () => {
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);

  useEffect(() => {
    // Store the previous path in history state
    const newState = { 
      ...window.history.state,
      previousPath: previousPathRef.current 
    };

    console.log('newState', newState);
    window.history.replaceState(newState, '', window.location.href);

    // Update the ref for next navigation
    previousPathRef.current = location.pathname;
  }, [location]);

  return null;
};

const App = () => (
  <I18nextProvider i18n={i18n}>
    <BrowserRouter>
      <HistoryHandler />
      <TooltipProvider>
        <NostrAuthProvider>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path={pages.home.location} element={<Index />} />
                <Route path={pages.explore.location} element={<Explore />} />
                <Route path={pages.timeline.location} element={<Timeline />} />
                <Route path={pages.quest.path} element={<QuestPage />} />
                <Route path={pages.createQuest.location} element={<CreateQuest />} />
                <Route path={pages.verifyProof.path} element={<VerifyProof />} />
                <Route path={pages.myQuest.location} element={<MyQuest />} />
                <Route path={pages.connect.location} element={<ConnectNostr />} />
                <Route path={pages.profile.location} element={<Profile />} />
                <Route path={pages.coachDirectory.location} element={<CoachDirectory />} />
                <Route path={pages.registerCoach.location} element={<RegisterCoach />} />
                <Route path={pages.notifications.location} element={<Notifications />} />
                <Route path={pages.premium.location} element={<Premium />} />
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
  </I18nextProvider>
);

export default App;
