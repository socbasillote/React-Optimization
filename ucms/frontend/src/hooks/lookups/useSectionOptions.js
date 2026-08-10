import { useMemo } from "react";

import { useGetSectionsQuery } from "@/features/academic/section/api/sectionApi";

export default function useSectionOptions({
  program,
  academicYear,
  academicTerm,
} = {}) {
  const { data, isLoading } = useGetSectionsQuery({
    page: 1,
    limit: 100,
    status: "ACTIVE",
    ...(program && { program }),
    ...(academicYear && { academicYear }),
    ...(academicTerm && { academicTerm }),
  });

  const options = useMemo(() => {
    return (
      data?.data?.map((section) => ({
        value: section._id,
        label: `${section.name} - Year ${section.yearLevel}`,
      })) ?? []
    );
  }, [data]);

  return {
    options,
    isLoading,
  };
}
