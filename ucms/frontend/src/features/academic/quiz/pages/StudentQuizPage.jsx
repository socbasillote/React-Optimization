import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useGetQuizzesQuery } from "../api/quizApi";

import { useGetMyQuizSubmissionsQuery } from "../api/quizSubmissionApi";

import { useGetEnrollmentsQuery } from "@/features/academic/enrollment/api/enrollmentApi";

import StudentQuizTable from "../components/student/StudentQuizTable";
import StudentQuizSubmissionDialog from "../components/student/StudentQuizSubmissionDialog";
import StudentQuizResultDialog from "../components/student/StudentQuizResultDialog";
import { useNavigate } from "react-router-dom";

export default function StudentQuizPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const [resultDialogOpen, setResultDialogOpen] = useState(false);

  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const { data: quizData, isLoading: quizzesLoading } = useGetQuizzesQuery({
    page,
    limit: 10,
  });

  const { data: submissionData, isLoading: submissionsLoading } =
    useGetMyQuizSubmissionsQuery({
      page: 1,
      limit: 100,
    });

  const { data: enrollmentData, isLoading: enrollmentsLoading } =
    useGetEnrollmentsQuery({
      page: 1,
      limit: 100,
    });

  const quizzes = quizData?.data ?? [];
  const submissions = submissionData?.data ?? [];
  const enrollments = enrollmentData?.data ?? [];

  const meta = quizData?.meta ?? {
    page: 1,
    totalPages: 1,
  };

  const getEnrollmentForQuiz = (quiz) => {
    const courseOfferingId =
      typeof quiz?.courseOffering === "object"
        ? quiz.courseOffering?._id
        : quiz?.courseOffering;

    return enrollments.find((enrollment) => {
      const enrollmentCourseOfferingId =
        typeof enrollment?.courseOffering === "object"
          ? enrollment.courseOffering?._id
          : enrollment.courseOffering;

      return enrollmentCourseOfferingId === courseOfferingId;
    });
  };

  const handleSubmit = (quiz) => {
    setSelectedQuiz(quiz);
    setSubmitDialogOpen(true);
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setResultDialogOpen(true);
  };

  const selectedEnrollment = selectedQuiz
    ? getEnrollmentForQuiz(selectedQuiz)
    : null;

  const isLoading = quizzesLoading || submissionsLoading || enrollmentsLoading;

  const handleStartQuiz = (quiz) => {
    navigate(`/app/quiz-taking/${quiz._id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Quizzes</h1>

        <p className="text-sm text-muted-foreground">
          View your quizzes and submit your attempts.
        </p>
      </div>

      <StudentQuizTable
        quizzes={quizzes}
        submissions={submissions}
        isLoading={isLoading}
        onStartQuiz={handleStartQuiz}
        onViewSubmission={handleViewSubmission}
      />

      <StudentQuizSubmissionDialog
        open={submitDialogOpen}
        onOpenChange={(open) => {
          setSubmitDialogOpen(open);

          if (!open) {
            setSelectedQuiz(null);
          }
        }}
        quiz={selectedQuiz}
        enrollmentId={selectedEnrollment?._id}
      />

      <StudentQuizResultDialog
        open={resultDialogOpen}
        onOpenChange={(open) => {
          setResultDialogOpen(open);

          if (!open) {
            setSelectedSubmission(null);
          }
        }}
        submission={selectedSubmission}
      />

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
