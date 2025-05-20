import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Designs from "@/pages/Designs";
import SubmitDesign from "@/pages/SubmitDesign";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/NotFound";

export interface AppRoute {
  path: string;
  element: React.ReactNode;
  children?: AppRoute[];
}

export const appRoutes: AppRoute[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Navigate to="/designs" replace /> },
      { path: "designs", element: <Designs /> },
      { path: "submit-design", element: <SubmitDesign /> },
      { path: "reports", element: <Reports /> },
    ],
  },
  { path: "*", element: <NotFound /> },
];
