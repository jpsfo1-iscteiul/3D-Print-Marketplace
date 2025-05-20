
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Layout from "./components/Layout";
import Designs from "./pages/Designs";
import SubmitDesign from "./pages/SubmitDesign";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

// Define ethereum on window
declare global {
  interface Window {
    ethereum?: any;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/designs" replace />} />
              <Route path="designs" element={<Designs />} />
              <Route path="submit-design" element={<SubmitDesign />} />
              <Route path="reports" element={<Reports />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
