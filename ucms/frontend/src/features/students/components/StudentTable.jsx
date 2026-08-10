import DataTable from "@/components/common/DataTable";
import RowActions from "@/components/common/RowActions";
import StatusBadge from "@/components/common/StatusBadge";

export default function StudentTable({ students, loading, onEdit, onDelete }) {
  const columns = [
    {
      key: "studentNumber",
      header: "Student Number",
    },

    {
      key: "user",
      header: "Student",
      render: (student) => {
        const user = student.user;

        if (!user) return "—";

        return `${user.firstName} ${user.lastName}`;
      },
    },

    {
      key: "program",
      header: "Program",
      render: (student) => student.program?.code ?? "—",
    },

    {
      key: "curriculum",
      header: "Curriculum",
      render: (student) => student.curriculum?.name ?? "—",
    },

    {
      key: "section",
      header: "Section",
      render: (student) => student.section?.name ?? "—",
    },

    {
      key: "yearLevel",
      header: "Year",
    },

    {
      key: "status",
      header: "Status",
      render: (student) => <StatusBadge status={student.status} />,
    },

    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (student) => (
        <RowActions
          onEdit={() => onEdit(student)}
          onDelete={() => onDelete(student)}
        />
      ),
    },
  ];

  return <DataTable columns={columns} data={students} loading={loading} />;
}
