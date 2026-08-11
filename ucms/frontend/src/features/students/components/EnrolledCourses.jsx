import { BookOpen } from "lucide-react";

function getCourseName(enrollment) {
  const subject = enrollment?.courseOffering?.curriculumSubject?.subject;

  if (!subject) {
    return "Course information unavailable";
  }

  return `${subject.code ?? ""} ${subject.title ?? ""}`.trim();
}

export default function EnrolledCourses({ enrollments = [], isLoading }) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center gap-2 border-b p-5">
        <BookOpen className="size-5 text-muted-foreground" />

        <div>
          <h2 className="font-semibold">My Courses</h2>

          <p className="text-sm text-muted-foreground">
            Your current enrolled courses
          </p>
        </div>
      </div>

      <div className="divide-y">
        {isLoading ? (
          <div className="p-5 text-sm text-muted-foreground">
            Loading courses...
          </div>
        ) : enrollments.length === 0 ? (
          <div className="p-5 text-sm text-muted-foreground">
            No enrolled courses found.
          </div>
        ) : (
          enrollments.map((enrollment) => {
            const courseOffering = enrollment.courseOffering;

            return (
              <div
                key={enrollment._id}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {getCourseName(enrollment)}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {courseOffering?.section?.name
                      ? `Section ${courseOffering.section.name}`
                      : "Section unavailable"}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs">
                  {enrollment.status}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
