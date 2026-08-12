import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { useUpdateQuizSubmissionMutation } from "../api/quizSubmissionApi";

const getStudentName = (submission) => {
  const user = submission?.enrollment?.student?.user;

  if (!user) {
    return "—";
  }

  return [user.firstName, user.middleName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
};

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

export default function QuizSubmissionGradingDialog({
  open,
  onOpenChange,
  submission,
}) {
  const [updateQuizSubmission, { isLoading }] =
    useUpdateQuizSubmissionMutation();

  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!submission) {
      setScore("");
      setFeedback("");
      return;
    }

    setScore(
      submission.score === null || submission.score === undefined
        ? ""
        : String(submission.score),
    );

    setFeedback(submission.feedback ?? "");
  }, [submission]);

  if (!submission) {
    return null;
  }

  const quiz = typeof submission.quiz === "object" ? submission.quiz : null;

  const maxScore = quiz?.maxScore ?? 0;

  const handleSave = async () => {
    const numericScore = Number(score);

    if (score === "" || Number.isNaN(numericScore)) {
      return;
    }

    if (numericScore < 0 || numericScore > maxScore) {
      return;
    }

    try {
      await updateQuizSubmission({
        id: submission._id,
        score: numericScore,
        feedback: feedback.trim(),
      }).unwrap();

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to grade quiz submission:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Grade Quiz Submission</DialogTitle>

          <DialogDescription>
            Review the student's quiz submission and provide a score and
            feedback.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-md border bg-muted/50 p-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Student</p>

                <p className="font-medium">{getStudentName(submission)}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Quiz</p>

                <p className="font-medium">{quiz?.title ?? "—"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Started</p>

                  <p className="text-sm">
                    {formatDateTime(submission.startedAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Submitted</p>

                  <p className="text-sm">
                    {formatDateTime(submission.submittedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quiz-score">Score</Label>

            <div className="flex items-center gap-2">
              <Input
                id="quiz-score"
                type="number"
                min="0"
                max={maxScore}
                step="0.01"
                value={score}
                onChange={(event) => setScore(event.target.value)}
                placeholder="Enter score"
              />

              <span className="text-sm text-muted-foreground">
                / {maxScore}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quiz-feedback">Feedback</Label>

            <Textarea
              id="quiz-feedback"
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              placeholder="Provide feedback to the student..."
              rows={5}
            />
          </div>
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
            disabled={isLoading || score === ""}
            onClick={handleSave}
          >
            {isLoading ? "Saving..." : "Save Grade"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
