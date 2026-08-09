import { createBrowserRouter, Navigate } from "react-router-dom";

import GuestLayout from "@/layouts/GuestLayout";
import ProtectedLayout from "@/layouts/ProtectedLayout";

import LoginPage from "@/features/auth/pages/LoginPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import { AppLayout } from "@/components/layout";
import CampusPage from "@/features/organization/campus/pages/CampusPage";
import CollegePage from "@/features/organization/college/page/CollegePage";
import DepartmentPage from "@/features/organization/department/pages/DepartmentPage";
import ProgramPage from "@/features/organization/program/pages/ProgramPage";
import AcademicYearPage from "@/features/academic/academic-year/pages/AcademicYearPage";

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
          {
            path: "campuses",
            element: <CampusPage />,
            handle: {
              title: "Campuses",
              breadcrumb: [{ label: "Campuses" }],
            },
          },
          {
            path: "colleges",
            element: <CollegePage />,
            handle: {
              title: "Colleges",
              breadcrumb: [{ label: "Colleges" }],
            },
          },
          {
            path: "departments",
            element: <DepartmentPage />,
            handle: {
              title: "Departments",
              breadcrumb: [{ label: "Departments" }],
            },
          },
          {
            path: "programs",
            element: <ProgramPage />,
            handle: {
              title: "Programs",
              breadcrumb: [{ label: "Programs" }],
            },
          },
          {
            path: "academic-years",
            element: <AcademicYearPage />,
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
