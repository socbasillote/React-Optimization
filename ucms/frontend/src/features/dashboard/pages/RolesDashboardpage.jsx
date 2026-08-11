import { Navigate } from "react-router-dom";

import { useGetCurrentUserQuery } from "@/features/auth/api/authApi";

import DashboardPage from "./DashboardPage";
import StudentDashboardPage from "@/features/students/pages/StudentDashboardPage";

export default function RoleDashboardPage() {
  const { data, isLoading } = useGetCurrentUserQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const role = data?.data?.role;

  if (role === "STUDENT") {
    return <StudentDashboardPage />;
  }

  if (role === "SUPER_ADMIN" || role === "ADMIN" || role === "FACULTY") {
    return <DashboardPage />;
  }

  return <Navigate to="/login" replace />;
}
