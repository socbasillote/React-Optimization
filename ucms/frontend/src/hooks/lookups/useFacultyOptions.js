import { useMemo } from "react";

import { useGetFacultiesQuery } from "@/features/faculty/api/facultyApi";

export default function useFacultyOptions() {
  const { data, isLoading } = useGetFacultiesQuery({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });

  const options = useMemo(() => {
    return (
      data?.data?.map((faculty) => ({
        value: faculty._id,
        label: `${faculty.user?.firstName ?? ""} ${
          faculty.user?.lastName ?? ""
        }`.trim(),
      })) ?? []
    );
  }, [data]);

  return {
    options,
    isLoading,
  };
}
