import { useMemo } from "react";

import { useGetEnrollmentsQuery } from "@/features/academic/enrollment/api/enrollmentApi";

export default function useGradeEnrollmentOptions() {
  const { data, isLoading } = useGetEnrollmentsQuery({
    page: 1,
    limit: 100,
    status: "ENROLLED",
  });

  const options = useMemo(() => {
    return (
      data?.data?.map((enrollment) => {
        const student = enrollment?.student;

        const user = student?.user;

        const studentName = user
          ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
          : "";

        const studentNumber = student?.studentNumber ?? "";

        const subject = enrollment?.courseOffering?.curriculumSubject?.subject;

        const section = enrollment?.courseOffering?.section?.name;

        return {
          value: enrollment._id,
          label: [
            studentNumber,
            studentName,
            subject?.code,
            subject?.title,
            section,
          ]
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
