
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Challenge from "./pages/Challenge";
import CreateChallenge from "./pages/CreateChallenge";
import MyChallenge from "./pages/MyChallenge";
import NotFound from "./pages/NotFound";
import Timeline from "./pages/Timeline";
import ConnectNostr from "./pages/ConnectNostr";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/challenge/:id" element={<Challenge />} />
              <Route path="/create" element={<CreateChallenge />} />
              <Route path="/my-challenges" element={<MyChallenge />} />
              <Route path="/connect" element={<ConnectNostr />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
