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

  const maxScore = submission?.assignment?.maxScore;

  if (maxScore === null || maxScore === undefined) {
    return submission.score;
  }

  return `${submission.score} / ${maxScore}`;
};

export default function StudentAssignmentViewDialog({
  open,
  onOpenChange,
  submission,
}) {
  if (!submission) {
    return null;
  }

  const assignment =
    typeof submission.assignment === "object" ? submission.assignment : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assignment Submission</DialogTitle>

          <DialogDescription>
            View your submitted answer, score, and faculty feedback.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Assignment */}

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Assignment</p>

            <p className="font-medium">{assignment?.title ?? "Assignment"}</p>
          </div>

          {/* Submitted At */}

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Submitted</p>

            <p className="text-sm">{formatDateTime(submission.submittedAt)}</p>
          </div>

          <Separator />

          {/* Student Answer */}

          <div className="space-y-2">
            <p className="text-sm font-medium">Your Answer</p>

            <div className="min-h-[120px] whitespace-pre-wrap rounded-md border bg-muted/50 p-4 text-sm">
              {submission.content?.trim() || "No answer provided."}
            </div>
          </div>

          <Separator />

          {/* Grade */}

          <div className="space-y-2">
            <p className="text-sm font-medium">Grade</p>

            <div className="rounded-md border bg-muted/50 p-4">
              <p className="text-2xl font-semibold">
                {formatScore(submission)}
              </p>

              {submission.score === null || submission.score === undefined ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  Your submission has not been graded yet.
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  Your faculty has graded this submission.
                </p>
              )}
            </div>
          </div>

          {/* Feedback */}

          <div className="space-y-2">
            <p className="text-sm font-medium">Faculty Feedback</p>

            <div className="min-h-[100px] whitespace-pre-wrap rounded-md border bg-muted/50 p-4 text-sm">
              {submission.feedback?.trim() || "No feedback provided yet."}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
