import DataTable from "@/components/common/DataTable";
import RowActions from "@/components/common/RowActions";
import StatusBadge from "@/components/common/StatusBadge";

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString();
};

export default function AcademicTermTable({
  academicTerms,
  loading,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      key: "academicYear",
      header: "Academic Year",
      render: (academicTerm) => academicTerm.academicYear?.name ?? "—",
    },

    {
      key: "name",
      header: "Term",
    },

    {
      key: "code",
      header: "Code",
    },

    {
      key: "sequence",
      header: "Sequence",
    },

    {
      key: "startDate",
      header: "Start Date",
      render: (academicTerm) => formatDate(academicTerm.startDate),
    },

    {
      key: "endDate",
      header: "End Date",
      render: (academicTerm) => formatDate(academicTerm.endDate),
    },

    {
      key: "isCurrent",
      header: "Current",
      render: (academicTerm) => (academicTerm.isCurrent ? "Yes" : "No"),
    },

    {
      key: "status",
      header: "Status",
      render: (academicTerm) => <StatusBadge status={academicTerm.status} />,
    },

    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (academicTerm) => (
        <RowActions
          onEdit={() => onEdit(academicTerm)}
          onDelete={() => onDelete(academicTerm)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={academicTerms}
      loading={loading}
      emptyMessage="No academic terms found."
    />
  );
}
