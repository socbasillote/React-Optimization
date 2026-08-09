import DataTable from "@/components/common/DataTable";
import RowActions from "@/components/common/RowActions";
import StatusBadge from "@/components/common/StatusBadge";

export default function DepartmentTable({
  departments,
  loading,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      key: "college",
      header: "College",
      render: (department) => department.college?.name ?? "—",
    },

    {
      key: "name",
      header: "Department",
    },

    {
      key: "code",
      header: "Code",
    },

    {
      key: "status",
      header: "Status",
      render: (department) => <StatusBadge status={department.status} />,
    },

    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (department) => (
        <RowActions
          onEdit={() => onEdit(department)}
          onDelete={() => onDelete(department)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={departments}
      loading={loading}
      emptyMessage="No departments found."
    />
  );
}
