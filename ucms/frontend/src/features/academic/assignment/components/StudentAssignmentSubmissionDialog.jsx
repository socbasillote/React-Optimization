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
import { Label } from "@/components/ui/label";

import { useCreateAssignmentSubmissionMutation } from "@/features/academic/assignment-submission/api/assignmentSubmissionApi";

import { toast } from "sonner";
import { getErrorMessage } from "@/lib/getErrorMessage";

export default function StudentAssignmentSubmissionDialog({
  open,
  onOpenChange,
  assignment,
  enrollmentId,
}) {
  const [content, setContent] = useState("");

  const [createSubmission, { isLoading }] =
    useCreateAssignmentSubmissionMutation();

  useEffect(() => {
    if (!open) {
      setContent("");
    }
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!assignment?._id) {
      toast.error("Assignment information is unavailable.");
      return;
    }

    if (!enrollmentId) {
      toast.error("Enrollment information is unavailable.");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter your answer.");
      return;
    }

    try {
      await createSubmission({
        assignment: assignment._id,
        enrollment: enrollmentId,
        content: content.trim(),
      }).unwrap();

      toast.success("Assignment submitted successfully.");

      setContent("");
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (!assignment) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>

            <DialogDescription>
              Submit your answer for this assignment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="rounded-md border bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">Assignment</p>

              <p className="font-medium">{assignment.title}</p>

              {assignment.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {assignment.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignment-answer">Your Answer</Label>

              <Textarea
                id="assignment-answer"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Enter your answer here..."
                rows={10}
                disabled={isLoading}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              Maximum Score:{" "}
              <span className="font-medium text-foreground">
                {assignment.maxScore ?? "—"}
              </span>
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

            <Button type="submit" disabled={isLoading || !content.trim()}>
              {isLoading ? "Submitting..." : "Submit Assignment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
