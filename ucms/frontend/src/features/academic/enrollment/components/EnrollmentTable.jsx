import DataTable from "@/components/common/DataTable";
import RowActions from "@/components/common/RowActions";
import StatusBadge from "@/components/common/StatusBadge";

export default function EnrollmentTable({
  enrollments,
  loading,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      key: "student",
      header: "Student",
      render: (enrollment) => {
        const student = enrollment.student;
        const user = student?.user;

        if (!student) return "—";

        if (!user) {
          return student.studentNumber ?? "—";
        }

        return `${student.studentNumber} - ${user.firstName} ${user.lastName}`;
      },
    },

    {
      key: "courseOffering",
      header: "Course",
      render: (enrollment) => {
        const offering = enrollment.courseOffering;
        const subject = offering?.curriculumSubject?.subject;

        return subject ? `${subject.code} - ${subject.title}` : "—";
      },
    },

    {
      key: "section",
      header: "Section",
      render: (enrollment) => enrollment.courseOffering?.section?.name ?? "—",
    },

    {
      key: "academicYear",
      header: "Academic Year",
      render: (enrollment) =>
        enrollment.courseOffering?.academicYear?.name ?? "—",
    },

    {
      key: "academicTerm",
      header: "Term",
      render: (enrollment) =>
        enrollment.courseOffering?.academicTerm?.name ?? "—",
    },

    {
      key: "status",
      header: "Status",
      render: (enrollment) => <StatusBadge status={enrollment.status} />,
    },

    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (enrollment) => (
        <RowActions
          onEdit={() => onEdit(enrollment)}
          onDelete={() => onDelete(enrollment)}
        />
      ),
    },
  ];

  return <DataTable columns={columns} data={enrollments} loading={loading} />;
}
