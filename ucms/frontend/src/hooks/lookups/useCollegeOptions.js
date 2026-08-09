import { useMemo } from "react";

import { useGetCollegesQuery } from "@/features/organization/college/api/collegeApi";

export default function useCollegeOptions() {
  const { data, isLoading } = useGetCollegesQuery({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });

  const options = useMemo(() => {
    return (
      data?.data?.map((college) => ({
        value: college._id,
        label: college.name,
      })) ?? []
    );
  }, [data]);

  return {
    options,
    isLoading,
  };
}
