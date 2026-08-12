import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";

const formatDateTime = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
};

const formatScore = (submission) => {
  if (submission?.score === null || submission?.score === undefined) {
    return "Pending";
  }

  const maxScore = submission?.quiz?.maxScore;

  if (maxScore === undefined) {
    return submission.score;
  }

  return `${submission.score} / ${maxScore}`;
};

export default function StudentQuizResultDialog({
  open,
  onOpenChange,
  submission,
}) {
  if (!submission) {
    return null;
  }

  const quiz = typeof submission.quiz === "object" ? submission.quiz : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Quiz Result</DialogTitle>

          <DialogDescription>
            View your quiz submission and result.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <p className="text-xs text-muted-foreground">Quiz</p>

            <p className="font-medium">{quiz?.title ?? "Quiz"}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Started</p>

              <p className="text-sm">{formatDateTime(submission.startedAt)}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Submitted</p>

              <p className="text-sm">
                {formatDateTime(submission.submittedAt)}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-xs text-muted-foreground">Score</p>

            <p className="text-2xl font-semibold">{formatScore(submission)}</p>

            {!submission.score && submission.score !== 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                Your quiz has not been graded yet.
              </p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium">Faculty Feedback</p>

            <div className="mt-2 min-h-[100px] whitespace-pre-wrap rounded-md border bg-muted/50 p-4 text-sm">
              {submission.feedback?.trim() || "No feedback provided yet."}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
