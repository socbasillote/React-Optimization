import { GraduationCap } from "lucide-react";

export default function StudentWelcome({ student }) {
  const user = student?.user;

  const fullName = [user?.firstName, user?.middleName, user?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <GraduationCap className="size-6 text-primary" />
        </div>

        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">Welcome back</p>

          <h1 className="text-2xl font-semibold tracking-tight">
            {fullName || "Student"}
          </h1>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {student?.studentNumber && (
              <span>Student No. {student.studentNumber}</span>
            )}

            {student?.program?.name && <span>{student.program.name}</span>}

            {student?.section?.name && (
              <span>Section {student.section.name}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
