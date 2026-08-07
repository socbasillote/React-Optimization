import DataTable from "@/components/common/DataTable";
import RowActions from "@/components/common/RowActions";
import StatusBadge from "@/components/common/StatusBadge";

export default function CollegeTable({ colleges, loading, onEdit, onDelete }) {
  const columns = [
    {
      key: "campus",
      header: "Campus",
      render: (college) => college.campus?.name,
    },
    {
      key: "name",
      header: "College",
    },
    {
      key: "code",
      header: "Code",
    },
    {
      key: "status",
      header: "Status",
      render: (college) => <StatusBadge status={college.status} />,
    },
    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (college) => (
        <RowActions
          onEdit={() => onEdit(college)}
          onDelete={() => onDelete(college)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={colleges}
      loading={loading}
      emptyMessage="No colleges found."
    />
  );
}
