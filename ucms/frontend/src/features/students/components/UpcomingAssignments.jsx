import { FileText } from "lucide-react";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function UpcomingAssignments({ assignments = [], isLoading }) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center gap-2 border-b p-5">
        <FileText className="size-5 text-muted-foreground" />

        <div>
          <h2 className="font-semibold">Upcoming Assignments</h2>

          <p className="text-sm text-muted-foreground">
            Your upcoming deadlines
          </p>
        </div>
      </div>

      <div className="divide-y">
        {isLoading ? (
          <div className="p-5 text-sm text-muted-foreground">
            Loading assignments...
          </div>
        ) : assignments.length === 0 ? (
          <div className="p-5 text-sm text-muted-foreground">
            No upcoming assignments.
          </div>
        ) : (
          assignments.slice(0, 5).map((assignment) => (
            <div
              key={assignment._id}
              className="flex items-center justify-between gap-4 p-5"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{assignment.title}</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Due {formatDate(assignment.dueDate)}
                </p>
              </div>

              <span className="shrink-0 text-sm text-muted-foreground">
                {assignment.maxScore} pts
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
