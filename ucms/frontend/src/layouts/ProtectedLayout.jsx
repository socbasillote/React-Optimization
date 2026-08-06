import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { useGetCurrentUserQuery } from "@/features/auth/api/authApi";

import FullScreenLoader from "@/components/common/FullScreenLoader";

export default function ProtectedLayout() {
  const { accessToken, initialized } = useSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetCurrentUserQuery(undefined, {
    skip: !accessToken,
  });

  if (!initialized) {
    return <FullScreenLoader />;
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isError || !data?.data) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
