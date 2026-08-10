import { useMemo } from "react";

import { useGetAcademicTermsQuery } from "@/features/academic/academic-term/api/academicTermApi";

export default function useAcademicTermOptions({ academicYear } = {}) {
  const { data, isLoading } = useGetAcademicTermsQuery({
    page: 1,
    limit: 100,
    status: "ACTIVE",
    ...(academicYear && {
      academicYear,
    }),
  });

  const options = useMemo(() => {
    return (
      data?.data?.map((academicTerm) => ({
        value: academicTerm._id,
        label: academicTerm.name,
      })) ?? []
    );
  }, [data]);

  return {
    options,
    isLoading,
  };
}
