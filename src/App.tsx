import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Music } from "./pages/Music";
import { About } from "./pages/About";
import { Projects } from "./pages/Projects";
import { Members } from "./pages/Members";
import { Aliens } from "./pages/Aliens";
import { CoreRuleBook } from "./pages/CoreRuleBook";
import { RemnantsLore } from "./pages/RemnantsLore";
import { TrustysForeword } from "./pages/TrustysForeword";
import { RequireAuth } from "./components/RequireAuth";
import { Auth } from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/music" element={<Music />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<RequireAuth><Projects /></RequireAuth>} />
              <Route path="/members" element={<RequireAuth><Members /></RequireAuth>} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/aliens" element={<Aliens />} />
              <Route path="/core-rule-book" element={<CoreRuleBook />} />
              <Route path="/lore" element={<RemnantsLore />} />
              <Route path="/lore/trustys-foreword" element={<TrustysForeword />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
