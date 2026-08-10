import DataTable from "@/components/common/DataTable";
import RowActions from "@/components/common/RowActions";
import StatusBadge from "@/components/common/StatusBadge";

export default function CurriculumTable({
  curricula,
  loading,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      key: "program",
      header: "Program",
      render: (curriculum) => curriculum.program?.name ?? "—",
    },

    {
      key: "name",
      header: "Curriculum",
    },

    {
      key: "description",
      header: "Description",
      render: (curriculum) => curriculum.description || "—",
    },

    {
      key: "status",
      header: "Status",
      render: (curriculum) => <StatusBadge status={curriculum.status} />,
    },

    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (curriculum) => (
        <RowActions
          onEdit={() => onEdit(curriculum)}
          onDelete={() => onDelete(curriculum)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={curricula}
      loading={loading}
      emptyMessage="No curricula found."
    />
  );
}
