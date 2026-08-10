import { useMemo } from "react";

import { useGetStudentsQuery } from "@/features/students/api/studentApi";

export default function useStudentOptions() {
  const { data, isLoading } = useGetStudentsQuery({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });

  const options = useMemo(() => {
    return (
      data?.data?.map((student) => ({
        value: student._id,
        label: `${student.studentNumber} - ${
          student.user
            ? `${student.user.firstName} ${student.user.lastName}`
            : "Unknown Student"
        }`,
      })) ?? []
    );
  }, [data]);

  return {
    options,
    isLoading,
  };
}
