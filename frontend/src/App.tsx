import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext.tsx";
import { appRoutes, AppRoute } from "@/routes";

function renderRoutes(routes: AppRoute[]) {
  return routes.map(({ path, element, children }) => (
    <Route key={path} path={path} element={element}>
      {children && renderRoutes(children)}
    </Route>
  ));
}

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
          <Routes>{renderRoutes(appRoutes)}</Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
