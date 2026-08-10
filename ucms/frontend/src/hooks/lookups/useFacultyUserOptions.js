import { useMemo } from "react";

import { useGetUsersQuery } from "@/features/users/api/userApi";

export default function useFacultyUserOptions() {
  const { data, isLoading } = useGetUsersQuery({
    page: 1,
    limit: 100,
    role: "FACULTY",
    status: "ACTIVE",
  });

  const options = useMemo(() => {
    return (
      data?.data?.map((user) => ({
        value: user._id,
        label: `${user.firstName} ${user.lastName} - ${user.email}`,
      })) ?? []
    );
  }, [data]);

  return {
    options,
    isLoading,
  };
}
