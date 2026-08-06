import { createBrowserRouter, Navigate } from "react-router-dom";

import GuestLayout from "@/layouts/GuestLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";

import LoginPage from "@/features/auth/pages/LoginPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import { AppLayout } from "@/components/layout";

const router = createBrowserRouter([
  {
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },

  {
    path: "/app",
    element: <ProtectedLayout />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "dashboard",
            element: <DashboardPage />,
            handle: {
              title: "Dashboard",
              breadcrumb: [{ label: "Dashboard" }],
            },
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default router;
