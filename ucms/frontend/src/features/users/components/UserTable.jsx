import DataTable from "@/components/common/DataTable";
import RowActions from "@/components/common/RowActions";
import StatusBadge from "@/components/common/StatusBadge";

export default function UserTable({
  users,
  loading,
  onEditRole,
  onEditStatus,
  onDelete,
}) {
  const columns = [
    {
      key: "name",
      header: "Name",
      render: (user) =>
        `${user.firstName ?? ""} ${
          user.middleName ?? ""
        } ${user.lastName ?? ""}`
          .replace(/\s+/g, " ")
          .trim(),
    },

    {
      key: "email",
      header: "Email",
    },

    {
      key: "role",
      header: "Role",
      render: (user) => user.role,
    },

    {
      key: "status",
      header: "Status",
      render: (user) => <StatusBadge status={user.status} />,
    },

    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (user) => (
        <RowActions
          onEdit={() => onEditRole(user)}
          onDelete={() => onDelete(user)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      loading={loading}
      emptyMessage="No users found."
    />
  );
}
