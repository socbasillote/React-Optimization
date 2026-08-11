import { useMemo } from "react";

import { useGetEnrollmentsQuery } from "@/features/academic/enrollment/api/enrollmentApi";

export default function useEnrollmentOptions() {
  const { data, isLoading } = useGetEnrollmentsQuery({
    page: 1,
    limit: 100,
    status: "ENROLLED",
  });

  const options = useMemo(() => {
    return (
      data?.data?.map((enrollment) => {
        const student = enrollment.student?.user;
        const courseOffering = enrollment.courseOffering;

        const studentName = student
          ? `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim()
          : "";

        const subject = courseOffering?.curriculumSubject?.subject;
        const section = courseOffering?.section;

        return {
          value: enrollment._id,
          label: [studentName, subject?.code, section?.name]
            .filter(Boolean)
            .join(" • "),
        };
      }) ?? []
    );
  }, [data]);

  return {
    options,
    isLoading,
  };
}
