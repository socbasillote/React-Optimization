import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useUpdateAssignmentSubmissionMutation } from "../api/assignmentSubmissionApi";

const getStudentName = (submission) => {
  const user = submission?.enrollment?.student?.user;

  if (!user) {
    return "Student";
  }

  return [user.firstName, user.middleName, user.lastName, user.suffix]
    .filter(Boolean)
    .join(" ")
    .trim();
};

export default function AssignmentSubmissionGradeDialog({
  open,
  onOpenChange,
  submission,
}) {
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");

  const [updateSubmission, { isLoading }] =
    useUpdateAssignmentSubmissionMutation();

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!submission) {
      return;
    }

    const maxScore = submission.assignment?.maxScore;

    if (score !== "") {
      const numericScore = Number(score);

      if (Number.isNaN(numericScore)) {
        toast.error("Please enter a valid score.");
        return;
      }

      if (numericScore < 0) {
        toast.error("Score cannot be negative.");
        return;
      }

      if (maxScore !== undefined && numericScore > maxScore) {
        toast.error(`Score cannot exceed ${maxScore}.`);
        return;
      }
    }

    try {
      await updateSubmission({
        id: submission._id,
        score: score === "" ? null : Number(score),
        feedback: feedback.trim(),
      }).unwrap();

      toast.success("Submission graded successfully.");

      onOpenChange(false);
    } catch (error) {
      toast.error(error?.data?.message ?? "Failed to update submission.");
    }
  };

  const studentName = getStudentName(submission);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Grade Assignment</DialogTitle>

          <DialogDescription>
            Review the student's answer and provide a score and feedback.
          </DialogDescription>
        </DialogHeader>

        {submission && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Student</p>

                <p className="font-medium">{studentName}</p>
              </div>

              <div className="mt-3 space-y-1">
                <p className="text-xs text-muted-foreground">Assignment</p>

                <p className="font-medium">
                  {submission.assignment?.title ?? "—"}
                </p>
              </div>

              <div className="mt-3 space-y-1">
                <p className="text-xs text-muted-foreground">Submitted</p>

                <p className="text-sm">
                  {submission.submittedAt
                    ? new Date(submission.submittedAt).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Student Answer</Label>

              <div className="max-h-60 overflow-y-auto rounded-md border bg-background p-4 text-sm whitespace-pre-wrap">
                {submission.content?.trim() || (
                  <span className="text-muted-foreground">
                    No answer content provided.
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
              <div className="space-y-2">
                <Label htmlFor="score">Score</Label>

                <Input
                  id="score"
                  type="number"
                  min="0"
                  max={submission.assignment?.maxScore}
                  step="0.01"
                  value={score}
                  onChange={(event) => setScore(event.target.value)}
                  placeholder="Score"
                />

                <p className="text-xs text-muted-foreground">
                  Max: {submission.assignment?.maxScore ?? "—"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback</Label>

                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(event) => setFeedback(event.target.value)}
                  placeholder="Enter feedback for the student..."
                  rows={4}
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

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Grade"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
