import { useMemo } from "react";

import { useGetCurriculumSubjectsQuery } from "@/features/academic/curriculum-subject/api/curriculumSubjectApi";

export default function useCurriculumSubjectOptions({ curriculum } = {}) {
  const { data, isLoading } = useGetCurriculumSubjectsQuery({
    page: 1,
    limit: 100,
    status: "ACTIVE",
    ...(curriculum && { curriculum }),
  });

  const options = useMemo(() => {
    return (
      data?.data?.map((item) => ({
        value: item._id,
        label: `${item.subject?.code ?? ""} - ${item.subject?.title ?? ""}`,
      })) ?? []
    );
  }, [data]);

  return {
    options,
    isLoading,
  };
}
