import DataTable from "@/components/common/DataTable";
import RowActions from "@/components/common/RowActions";
import StatusBadge from "@/components/common/StatusBadge";

export default function CurriculumSubjectTable({
  curriculumSubjects,
  loading,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      key: "curriculum",
      header: "Curriculum",
      render: (item) => item.curriculum?.name ?? "—",
    },

    {
      key: "subject",
      header: "Subject",
      render: (item) =>
        item.subject ? `${item.subject.code} - ${item.subject.title}` : "—",
    },

    {
      key: "yearLevel",
      header: "Year",
      render: (item) => `Year ${item.yearLevel}`,
    },

    {
      key: "term",
      header: "Term",
      render: (item) => `Term ${item.term}`,
    },

    {
      key: "prerequisite",
      header: "Prerequisite",
      render: (item) =>
        item.prerequisite
          ? `${item.prerequisite.code} - ${item.prerequisite.title}`
          : "None",
    },

    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },

    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (item) => (
        <RowActions
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={curriculumSubjects}
      loading={loading}
      emptyMessage="No curriculum subjects found."
    />
  );
}
