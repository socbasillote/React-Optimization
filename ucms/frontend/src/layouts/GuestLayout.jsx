import { Navigate, Outlet } from "react-router-dom";

import { useGetCurrentUserQuery } from "@/features/auth/api";

export default function GuestLayout() {
  const { data: user } = useGetCurrentUserQuery();

  if (user) {
    return <Navigate replace to="/app/dashboard" />;
  }

  return <Outlet />;
}
