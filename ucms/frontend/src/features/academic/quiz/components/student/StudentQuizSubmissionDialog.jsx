import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { useCreateQuizSubmissionMutation } from "../../api/quizSubmissionApi";

export default function StudentQuizSubmissionDialog({
  open,
  onOpenChange,
  quiz,
  enrollmentId,
}) {
  const [createQuizSubmission, { isLoading }] =
    useCreateQuizSubmissionMutation();

  const handleSubmit = async () => {
    if (!quiz?._id || !enrollmentId) {
      return;
    }

    try {
      await createQuizSubmission({
        quiz: quiz._id,
        enrollment: enrollmentId,
      }).unwrap();

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }
  };

  if (!quiz) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start Quiz</DialogTitle>

          <DialogDescription>
            Start this quiz and submit your attempt.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-md border bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground">Quiz</p>

            <p className="font-medium">{quiz.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Time Limit</p>

              <p className="text-sm">
                {quiz.timeLimit ? `${quiz.timeLimit} minutes` : "No limit"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Max Score</p>

              <p className="text-sm">{quiz.maxScore ?? "—"}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Quiz questions and answers will be added to the quiz system later.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={isLoading || !enrollmentId}
            onClick={handleSubmit}
          >
            {isLoading ? "Submitting..." : "Start Quiz"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
