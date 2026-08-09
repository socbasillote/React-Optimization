import { useMemo } from "react";

import { useGetAcademicYearsQuery } from "@/features/academic/academic-year/api/academicYearApi";

export default function useAcademicYearOptions() {
  const { data, isLoading } = useGetAcademicYearsQuery({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });

  const options = useMemo(() => {
    return (
      data?.data?.map((academicYear) => ({
        value: academicYear._id,
        label: academicYear.name,
      })) ?? []
    );
  }, [data]);

  return {
    options,
    isLoading,
  };
}
