import DataTable from "@/components/common/DataTable";
import RowActions from "@/components/common/RowActions";
import StatusBadge from "@/components/common/StatusBadge";

export default function SectionTable({ sections, loading, onEdit, onDelete }) {
  const columns = [
    {
      key: "program",
      header: "Program",
      render: (section) =>
        section.program
          ? `${section.program.code} - ${section.program.name}`
          : "—",
    },

    {
      key: "academicYear",
      header: "Academic Year",
      render: (section) => section.academicYear?.name ?? "—",
    },

    {
      key: "academicTerm",
      header: "Term",
      render: (section) => section.academicTerm?.name ?? "—",
    },

    {
      key: "name",
      header: "Section",
    },

    {
      key: "yearLevel",
      header: "Year",
      render: (section) => `Year ${section.yearLevel}`,
    },

    {
      key: "adviser",
      header: "Adviser",
      render: (section) =>
        section.adviser
          ? `${section.adviser.firstName} ${section.adviser.lastName}`
          : "None",
    },

    {
      key: "status",
      header: "Status",
      render: (section) => <StatusBadge status={section.status} />,
    },

    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (section) => (
        <RowActions
          onEdit={() => onEdit(section)}
          onDelete={() => onDelete(section)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={sections}
      loading={loading}
      emptyMessage="No sections found."
    />
  );
}
