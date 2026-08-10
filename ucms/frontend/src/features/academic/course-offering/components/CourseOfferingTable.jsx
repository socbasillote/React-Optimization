import DataTable from "@/components/common/DataTable";
import RowActions from "@/components/common/RowActions";
import StatusBadge from "@/components/common/StatusBadge";

export default function CourseOfferingTable({
  courseOfferings,
  loading,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      key: "curriculumSubject",
      header: "Subject",
      render: (offering) => {
        const subject = offering.curriculumSubject?.subject;

        if (!subject) return "—";

        return `${subject.code} - ${subject.title}`;
      },
    },

    {
      key: "faculty",
      header: "Faculty",
      render: (offering) => {
        const user = offering.faculty?.user;

        if (!user) return "—";

        return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
      },
    },

    {
      key: "section",
      header: "Section",
      render: (offering) => offering.section?.name ?? "—",
    },

    {
      key: "academicYear",
      header: "Academic Year",
      render: (offering) => offering.academicYear?.name ?? "—",
    },

    {
      key: "academicTerm",
      header: "Term",
      render: (offering) => offering.academicTerm?.name ?? "—",
    },

    {
      key: "status",
      header: "Status",
      render: (offering) => <StatusBadge status={offering.status} />,
    },

    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (offering) => (
        <RowActions
          onEdit={() => onEdit(offering)}
          onDelete={() => onDelete(offering)}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={courseOfferings}
      loading={loading}
      emptyMessage="No course offerings found."
    />
  );
}
