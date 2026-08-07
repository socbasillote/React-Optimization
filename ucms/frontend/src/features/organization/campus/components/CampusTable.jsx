import DataTable from "@/components/common/DataTable";

import RowActions from "@/components/common/RowActions";
import StatusBadge from "@/components/common/StatusBadge";

export default function CampusTable({ campuses, loading, onEdit, onDelete }) {
  const columns = [
    {
      key: "name",
      header: "Name",
    },
    {
      key: "code",
      header: "Code",
    },
    {
      key: "status",
      header: "Status",
      render: (campus) => <StatusBadge status={campus.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-20",
      render: (campus) => (
        <RowActions
          onEdit={() => onEdit(campus)}
          onDelete={() => onDelete(campus)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={campuses}
      loading={loading}
      emptyMessage="No campuses found."
    />
  );
}
