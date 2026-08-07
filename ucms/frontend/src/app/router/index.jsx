import { createBrowserRouter, Navigate } from "react-router-dom";

import ProtectedLayout from "@/layouts/ProtectedLayout";
import GuestLayout from "@/layouts/GuestLayout";

import LoginPage from "@/features/auth/pages/LoginPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";

import organizationRoutes from "./organization.routes";
