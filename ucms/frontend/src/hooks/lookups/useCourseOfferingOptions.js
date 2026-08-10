import { useMemo } from "react";

import { useGetCourseOfferingsQuery } from "@/features/academic/course-offering/api/courseOfferingApi";

export default function useCourseOfferingOptions() {
  const { data, isLoading } = useGetCourseOfferingsQuery({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });

  const options = useMemo(() => {
    return (
      data?.data?.map((offering) => {
        const subject = offering.curriculumSubject?.subject;
        const section = offering.section;
        const academicYear = offering.academicYear;
        const academicTerm = offering.academicTerm;

        return {
          value: offering._id,
          label: [
            subject?.code,
            subject?.title,
            section?.name,
            academicYear?.name,
            academicTerm?.name,
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
