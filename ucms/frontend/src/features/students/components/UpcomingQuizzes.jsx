import { ClipboardPen } from "lucide-react";

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

export default function UpcomingQuizzes({ quizzes = [], isLoading }) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center gap-2 border-b p-5">
        <ClipboardPen className="size-5 text-muted-foreground" />

        <div>
          <h2 className="font-semibold">Upcoming Quizzes</h2>

          <p className="text-sm text-muted-foreground">
            Upcoming quiz deadlines
          </p>
        </div>
      </div>

      <div className="divide-y">
        {isLoading ? (
          <div className="p-5 text-sm text-muted-foreground">
            Loading quizzes...
          </div>
        ) : quizzes.length === 0 ? (
          <div className="p-5 text-sm text-muted-foreground">
            No upcoming quizzes.
          </div>
        ) : (
          quizzes.slice(0, 5).map((quiz) => (
            <div
              key={quiz._id}
              className="flex items-center justify-between gap-4 p-5"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{quiz.title}</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Due {formatDate(quiz.dueDate)}
                </p>
              </div>

              <span className="shrink-0 text-sm text-muted-foreground">
                {quiz.timeLimit} min
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
