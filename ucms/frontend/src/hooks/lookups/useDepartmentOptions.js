import { useMemo } from "react";

import { useGetDepartmentsQuery } from "@/features/organization/department/api/departmentApi";

export default function useDepartmentOptions() {
  const { data, isLoading } = useGetDepartmentsQuery({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });

  const options = useMemo(() => {
    return (
      data?.data?.map((department) => ({
        value: department._id,
        label: `${department.code} - ${department.name}`,
      })) ?? []
    );
  }, [data]);

  return {
    options,
    isLoading,
  };
}
