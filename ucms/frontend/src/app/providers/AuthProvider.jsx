import { useGetCurrentUserQuery } from "@/features/auth/api";

import FullScreenLoader from "@/components/common/FullScreenLoader";

export default function AuthProvider({ children }) {
  const { isLoading } = useGetCurrentUserQuery();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return children;
}
