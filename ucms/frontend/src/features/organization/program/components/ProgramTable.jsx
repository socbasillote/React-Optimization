import DataTable from "@/components/common/DataTable";
import RowActions from "@/components/common/RowActions";
import StatusBadge from "@/components/common/StatusBadge";

const degreeTypeLabels = {
  CERTIFICATE: "Certificate",
  DIPLOMA: "Diploma",
  ASSOCIATE: "Associate",
  BACHELOR: "Bachelor",
  MASTER: "Master",
  DOCTORATE: "Doctorate",
};

export default function ProgramTable({ programs, loading, onEdit, onDelete }) {
  const columns = [
    {
      key: "department",
      header: "Department",
      render: (program) => program.department?.name ?? "—",
    },

    {
      key: "name",
      header: "Program",
    },

    {
      key: "code",
      header: "Code",
    },

    {
      key: "degreeType",
      header: "Degree",
      render: (program) =>
        degreeTypeLabels[program.degreeType] ?? program.degreeType ?? "—",
    },

    {
      key: "durationYears",
      header: "Duration",
      render: (program) =>
        `${program.durationYears} ${
          program.durationYears === 1 ? "Year" : "Years"
        }`,
    },

    {
      key: "status",
      header: "Status",
      render: (program) => <StatusBadge status={program.status} />,
    },

    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (program) => (
        <RowActions
          onEdit={() => onEdit(program)}
          onDelete={() => onDelete(program)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={programs}
      loading={loading}
      emptyMessage="No programs found."
    />
  );
}
