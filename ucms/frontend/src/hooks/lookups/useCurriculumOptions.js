import { useMemo } from "react";

import { useGetCurriculaQuery } from "@/features/academic/curriculum/api/curriculumApi";

export default function useCurriculumOptions() {
  const { data, isLoading } = useGetCurriculaQuery({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });

  const options = useMemo(() => {
    return (
      data?.data?.map((curriculum) => ({
        value: curriculum._id,
        label: curriculum.name,
      })) ?? []
    );
  }, [data]);

  return {
    options,
    isLoading,
  };
}
