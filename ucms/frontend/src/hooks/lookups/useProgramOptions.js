import { useMemo } from "react";

import { useGetProgramsQuery } from "@/features/organization/program/api/programApi";

export default function useProgramOptions() {
  const { data, isLoading } = useGetProgramsQuery({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });

  const options = useMemo(() => {
    return (
      data?.data?.map((program) => ({
        value: program._id,
        label: `${program.name} (${program.code})`,
      })) ?? []
    );
  }, [data]);

  return {
    options,
    isLoading,
  };
}
