import { useMemo } from "react";

import { useGetSubjectsQuery } from "@/features/academic/subject/api/subjectApi";

export default function useSubjectOptions() {
  const { data, isLoading } = useGetSubjectsQuery({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });

  const options = useMemo(() => {
    return (
      data?.data?.map((subject) => ({
        value: subject._id,
        label: `${subject.code} - ${subject.title}`,
      })) ?? []
    );
  }, [data]);

  return {
    options,
    isLoading,
  };
}
