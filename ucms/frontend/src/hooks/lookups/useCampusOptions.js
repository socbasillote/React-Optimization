import { useMemo } from "react";

import { useGetCampusesQuery } from "@/features/organization/campus/api/campusApi";

export default function useCampusOptions() {
  const { data, isLoading } = useGetCampusesQuery({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });

  const options = useMemo(() => {
    return (
      data?.data?.map((campus) => ({
        value: campus._id,
        label: campus.name,
      })) ?? []
    );
  }, [data]);

  return {
    options,
    isLoading,
  };
}
