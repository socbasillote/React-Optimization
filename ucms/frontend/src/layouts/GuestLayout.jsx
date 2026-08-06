import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function GuestLayout() {
  const { accessToken } = useSelector((state) => state.auth);

  if (accessToken) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
}
