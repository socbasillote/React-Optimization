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
      data?.data?.map((curriculumSubject) => ({
        value: curriculumSubject._id,
        label: `${curriculumSubject.subject?.code ?? ""} - ${
          curriculumSubject.subject?.title ?? ""
        }`,
      })) ?? []
    );
  }, [data]);

  return {
    options,
    isLoading,
  };
}
