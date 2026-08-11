import { useMemo } from "react";

import { useGetClassSchedulesQuery } from "@/features/academic/class-schedule/api/classScheduleApi";

export default function useClassScheduleOptions() {
  const { data, isLoading } = useGetClassSchedulesQuery({
    page: 1,
    limit: 100,
  });

  const options = useMemo(() => {
    return (
      data?.data?.map((schedule) => {
        const courseOffering = schedule.courseOffering;

        const subject = courseOffering?.curriculumSubject?.subject;
        const section = courseOffering?.section;
        const faculty = courseOffering?.faculty?.user;

        const facultyName = faculty
          ? `${faculty.firstName ?? ""} ${faculty.lastName ?? ""}`.trim()
          : "";

        return {
          value: schedule._id,
          label: [
            subject?.code,
            subject?.title,
            section?.name,
            schedule.day,
            `${schedule.startTime}-${schedule.endTime}`,
            schedule.room,
            facultyName,
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
