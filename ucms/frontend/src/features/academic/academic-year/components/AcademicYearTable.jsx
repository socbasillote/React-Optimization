import DataTable from "@/components/common/DataTable";
import RowActions from "@/components/common/RowActions";
import StatusBadge from "@/components/common/StatusBadge";

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString();
};

export default function AcademicYearTable({
  academicYears,
  loading,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      key: "name",
      header: "Academic Year",
    },

    {
      key: "startDate",
      header: "Start Date",
      render: (academicYear) => formatDate(academicYear.startDate),
    },

    {
      key: "endDate",
      header: "End Date",
      render: (academicYear) => formatDate(academicYear.endDate),
    },

    {
      key: "isCurrent",
      header: "Current",
      render: (academicYear) => (academicYear.isCurrent ? "Yes" : "No"),
    },

    {
      key: "status",
      header: "Status",
      render: (academicYear) => <StatusBadge status={academicYear.status} />,
    },

    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (academicYear) => (
        <RowActions
          onEdit={() => onEdit(academicYear)}
          onDelete={() => onDelete(academicYear)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={academicYears}
      loading={loading}
      emptyMessage="No academic years found."
    />
  );
}
