import DataTable from "@/components/common/DataTable";
import RowActions from "@/components/common/RowActions";
import StatusBadge from "@/components/common/StatusBadge";

export default function SubjectTable({ subjects, loading, onEdit, onDelete }) {
  const columns = [
    {
      key: "code",
      header: "Code",
    },

    {
      key: "title",
      header: "Subject",
    },

    {
      key: "units",
      header: "Units",
    },

    {
      key: "lectureHours",
      header: "Lecture",
      render: (subject) => `${subject.lectureHours ?? 0} hrs`,
    },

    {
      key: "laboratoryHours",
      header: "Laboratory",
      render: (subject) => `${subject.laboratoryHours ?? 0} hrs`,
    },

    {
      key: "status",
      header: "Status",
      render: (subject) => <StatusBadge status={subject.status} />,
    },

    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (subject) => (
        <RowActions
          onEdit={() => onEdit(subject)}
          onDelete={() => onDelete(subject)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={subjects}
      loading={loading}
      emptyMessage="No subjects found."
    />
  );
}
