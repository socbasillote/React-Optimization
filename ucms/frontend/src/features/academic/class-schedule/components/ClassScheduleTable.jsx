import DataTable from "@/components/common/DataTable";
import RowActions from "@/components/common/RowActions";

export default function ClassScheduleTable({
  classSchedules,
  loading,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      key: "courseOffering",
      header: "Subject",
      render: (schedule) =>
        schedule.courseOffering?.curriculumSubject?.subject?.code ?? "—",
    },

    {
      key: "title",
      header: "Course",
      render: (schedule) =>
        schedule.courseOffering?.curriculumSubject?.subject?.title ?? "—",
    },

    {
      key: "section",
      header: "Section",
      render: (schedule) => schedule.courseOffering?.section?.name ?? "—",
    },

    {
      key: "faculty",
      header: "Faculty",
      render: (schedule) => {
        const user = schedule.courseOffering?.faculty?.user;

        if (!user) return "—";

        return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
      },
    },

    {
      key: "day",
      header: "Day",
      render: (schedule) => {
        const day = schedule.day ?? "";

        return day.charAt(0) + day.slice(1).toLowerCase();
      },
    },

    {
      key: "time",
      header: "Time",
      render: (schedule) => `${schedule.startTime} - ${schedule.endTime}`,
    },

    {
      key: "room",
      header: "Room",
    },

    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (schedule) => (
        <RowActions
          onEdit={() => onEdit(schedule)}
          onDelete={() => onDelete(schedule)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={classSchedules}
      loading={loading}
      emptyMessage="No class schedules found."
    />
  );
}
