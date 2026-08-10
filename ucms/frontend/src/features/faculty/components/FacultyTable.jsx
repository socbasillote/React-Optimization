import DataTable from "@/components/common/DataTable";
import RowActions from "@/components/common/RowActions";
import StatusBadge from "@/components/common/StatusBadge";

export default function FacultyTable({ faculties, loading, onEdit, onDelete }) {
  const columns = [
    {
      key: "employeeId",
      header: "Employee ID",
    },

    {
      key: "user",
      header: "Faculty",
      render: (faculty) => {
        const user = faculty.user;

        if (!user) return "—";

        return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
      },
    },

    {
      key: "department",
      header: "Department",
      render: (faculty) => faculty.department?.name ?? "—",
    },

    {
      key: "position",
      header: "Position",
    },

    {
      key: "status",
      header: "Status",
      render: (faculty) => <StatusBadge status={faculty.status} />,
    },

    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (faculty) => (
        <RowActions
          onEdit={() => onEdit(faculty)}
          onDelete={() => onDelete(faculty)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={faculties}
      loading={loading}
      emptyMessage="No faculty found."
    />
  );
}
