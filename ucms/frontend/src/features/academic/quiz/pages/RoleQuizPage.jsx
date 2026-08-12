import { Navigate } from "react-router-dom";

import { useGetCurrentUserQuery } from "@/features/auth/api/authApi";

import StudentQuizPage from "./StudentQuizPage";
import QuizPage from "./QuizPage";

export default function RoleAssignmentPage() {
  const { data, isLoading } = useGetCurrentUserQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading assignments...</p>
      </div>
    );
  }

  const role = data?.data?.role;

  if (role === "STUDENT") {
    return <StudentQuizPage />;
  }

  if (role === "SUPER_ADMIN" || role === "ADMIN" || role === "FACULTY") {
    return <QuizPage />;
  }

  return <Navigate to="/login" replace />;
}
