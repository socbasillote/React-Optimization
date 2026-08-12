import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";

import { useUpdateAssignmentSubmissionMutation } from "../api/assignmentSubmissionApi";

import { getErrorMessage } from "@/lib/getErrorMessage";

const getStudentName = (submission) => {
  const user = submission?.enrollment?.student?.user;

  if (!user) {
    return "Student information unavailable";
  }

  const name = [user.firstName, user.middleName, user.lastName, user.suffix]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || "Student information unavailable";
};

const getStudentNumber = (submission) => {
  return submission?.enrollment?.student?.studentNumber ?? "—";
};

const getSubject = (submission) => {
  return (
    submission?.assignment?.courseOffering?.curriculumSubject?.subject ?? null
  );
};

const getSectionName = (submission) => {
  return submission?.assignment?.courseOffering?.section?.name ?? "—";
};

export default function AssignmentSubmissionGradeDialog({
  open,
  onOpenChange,
  submission,
}) {
  const [updateAssignmentSubmission, { isLoading }] =
    useUpdateAssignmentSubmissionMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      score: "",
      feedback: "",
    },
  });

  const score = watch("score");

  useEffect(() => {
    if (!submission) {
      reset({
        score: "",
        feedback: "",
      });

      return;
    }

    reset({
      score:
        submission.score === null || submission.score === undefined
          ? ""
          : String(submission.score),
      feedback: submission.feedback ?? "",
    });
  }, [submission, reset]);

  const handleDialogChange = (value) => {
    onOpenChange(value);

    if (!value) {
      reset({
        score: "",
        feedback: "",
      });
    }
  };

  const onSubmit = async (values) => {
    if (!submission) {
      return;
    }

    const maxScore = Number(submission?.assignment?.maxScore);

    const numericScore =
      values.score === "" || values.score === null
        ? null
        : Number(values.score);

    if (numericScore !== null && Number.isNaN(numericScore)) {
      toast.error("Please enter a valid score.");
      return;
    }

    if (numericScore !== null && numericScore < 0) {
      toast.error("Score cannot be less than 0.");
      return;
    }

    if (numericScore !== null && numericScore > maxScore) {
      toast.error(`Score cannot exceed ${maxScore}.`);
      return;
    }

    try {
      await updateAssignmentSubmission({
        id: submission._id,
        score: numericScore,
        feedback: values.feedback?.trim() ?? "",
      }).unwrap();

      toast.success("Assignment submission graded successfully.");

      handleDialogChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const subject = getSubject(submission);
  const maxScore = submission?.assignment?.maxScore ?? "—";

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Grade Assignment Submission</DialogTitle>

          <DialogDescription>
            Review the student's submission and record a score and feedback.
          </DialogDescription>
        </DialogHeader>

        {submission && (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Student</p>
                  <p className="font-medium">{getStudentName(submission)}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Student Number
                  </p>
                  <p className="text-sm">{getStudentNumber(submission)}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Assignment</p>
                  <p className="text-sm">
                    {submission.assignment?.title ?? "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Course</p>
                  <p className="text-sm">
                    {[subject?.code, subject?.title]
                      .filter(Boolean)
                      .join(" • ") || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Section</p>
                  <p className="text-sm">{getSectionName(submission)}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Maximum Score</p>
                  <p className="text-sm">{maxScore}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="score" className="text-sm font-medium">
                Score
              </label>

              <Input
                id="score"
                type="number"
                min="0"
                max={maxScore}
                step="0.01"
                placeholder={`Enter score out of ${maxScore}`}
                {...register("score")}
              />

              {errors.score && (
                <p className="text-sm text-destructive">
                  {errors.score.message}
                </p>
              )}

              {score !== "" && (
                <p className="text-xs text-muted-foreground">
                  Maximum score: {maxScore}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="feedback" className="text-sm font-medium">
                Feedback
              </label>

              <Textarea
                id="feedback"
                rows={5}
                placeholder="Provide feedback to the student..."
                {...register("feedback")}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => handleDialogChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={isLoading || !submission}
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading ? "Saving..." : "Save Grade"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
