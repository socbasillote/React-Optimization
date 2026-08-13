import { useEffect, useMemo, useState } from "react";

import { CheckCircle2, XCircle } from "lucide-react";

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

import {
  useGetQuizSubmissionByIdQuery,
  useUpdateQuizSubmissionMutation,
} from "../../api/quizSubmissionApi";

const getStudentName = (submission) => {
  const user = submission?.enrollment?.student?.user;

  if (!user) {
    return "—";
  }

  return [user.firstName, user.middleName, user.lastName, user.suffix]
    .filter(Boolean)
    .join(" ")
    .trim();
};

const normalizeAnswer = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim().toLowerCase();
};

export default function FacultyQuizSubmissionDialog({
  open,
  onOpenChange,
  submission,
}) {
  const submissionId = submission?._id ?? null;

  const { data, isLoading, error } = useGetQuizSubmissionByIdQuery(
    submissionId,
    {
      skip: !open || !submissionId,
    },
  );

  const [updateQuizSubmission, { isLoading: isSaving, error: saveError }] =
    useUpdateQuizSubmissionMutation();

  const details = data?.data ?? submission ?? null;

  const [score, setScore] = useState("");

  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!details) {
      return;
    }

    setScore(
      details.score === null || details.score === undefined
        ? ""
        : String(details.score),
    );

    setFeedback(details.feedback ?? "");
  }, [details]);

  const questions = useMemo(() => {
    return [...(details?.answers ?? [])].sort(
      (a, b) => (a.question?.order ?? 0) - (b.question?.order ?? 0),
    );
  }, [details]);

  const maxScore = details?.quiz?.maxScore ?? 0;

  const numericScore = score === "" ? null : Number(score);

  const scoreIsValid =
    numericScore !== null &&
    Number.isFinite(numericScore) &&
    numericScore >= 0 &&
    numericScore <= maxScore;

  const handleSave = async () => {
    if (!details || !scoreIsValid) {
      return;
    }

    try {
      await updateQuizSubmission({
        id: details._id,
        score: numericScore,
        feedback,
      }).unwrap();

      onOpenChange(false);
    } catch (saveError) {
      console.error("Failed to grade quiz submission:", saveError);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {details?.score !== null && details?.score !== undefined
              ? "Review Quiz Submission"
              : "Grade Quiz Submission"}
          </DialogTitle>

          <DialogDescription>
            Review the student's answers and provide a final score and feedback.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Loading submission...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-md border border-destructive/50 p-4 text-sm text-destructive">
            {error?.data?.message ?? "Unable to load the quiz submission."}
          </div>
        ) : details ? (
          <div className="space-y-6">
            <div className="grid gap-4 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Student</p>

                <p className="font-medium">{getStudentName(details)}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Email</p>

                <p className="text-sm">
                  {details.enrollment?.student?.user?.email ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Quiz</p>

                <p className="font-medium">{details.quiz?.title ?? "—"}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Max Score</p>

                <p className="font-medium">{maxScore}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Answers</h3>

                <p className="text-sm text-muted-foreground">
                  Review each answer before assigning the final score.
                </p>
              </div>

              {questions.length === 0 ? (
                <div className="rounded-md border p-4 text-sm text-muted-foreground">
                  No answers were submitted.
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((item, index) => {
                    const question = item.question;

                    const studentAnswer = item.answer ?? "";

                    const correctAnswer = question?.correctAnswer;

                    const isObjective =
                      question?.type === "TRUE_FALSE" ||
                      question?.type === "MULTIPLE_CHOICE";

                    const isCorrect =
                      isObjective &&
                      normalizeAnswer(studentAnswer) ===
                        normalizeAnswer(correctAnswer);

                    return (
                      <div
                        key={question?._id ?? index}
                        className="space-y-4 rounded-lg border p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Question {index + 1}
                            </p>

                            <p className="font-medium">
                              {question?.question ?? "Question unavailable"}
                            </p>
                          </div>

                          <span className="whitespace-nowrap text-xs text-muted-foreground">
                            {question?.points ?? 0}{" "}
                            {question?.points === 1 ? "point" : "points"}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Student answer
                            </p>

                            <div className="mt-1 rounded-md border bg-muted/30 p-3">
                              {studentAnswer || "No answer"}
                            </div>
                          </div>

                          {isObjective && (
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Correct answer
                              </p>

                              <div className="mt-1 flex items-center gap-2 rounded-md border bg-muted/30 p-3">
                                {isCorrect ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                  <XCircle className="h-4 w-4" />
                                )}

                                <span>{correctAnswer ?? "—"}</span>
                              </div>
                            </div>
                          )}

                          {!isObjective && (
                            <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
                              This question requires manual grading.
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-4 border-t pt-6">
              <div className="grid gap-2">
                <Label htmlFor="quiz-score">Final Score</Label>

                <Input
                  id="quiz-score"
                  type="number"
                  min={0}
                  max={maxScore}
                  step="0.01"
                  value={score}
                  onChange={(event) => setScore(event.target.value)}
                  placeholder={`0 - ${maxScore}`}
                />

                <p className="text-xs text-muted-foreground">
                  Maximum score: {maxScore}
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quiz-feedback">Feedback</Label>

                <Textarea
                  id="quiz-feedback"
                  value={feedback}
                  onChange={(event) => setFeedback(event.target.value)}
                  placeholder="Provide feedback to the student..."
                  rows={5}
                />
              </div>

              {saveError && (
                <div className="rounded-md border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
                  {saveError?.data?.message ?? "Failed to save the grade."}
                </div>
              )}
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={isSaving || !details || !scoreIsValid}
            onClick={handleSave}
          >
            {isSaving ? "Saving..." : "Save Grade"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
