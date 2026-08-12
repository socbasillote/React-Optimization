import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useGetQuizSubmissionsQuery } from "../api/quizSubmissionApi";

import QuizSubmissionTable from "../components/QuizSubmissionTable";

import QuizSubmissionGradingDialog from "../components/QuizSubmissionGradingDialog";

export default function QuizSubmissionPage() {
  const [page, setPage] = useState(1);

  const [gradingDialogOpen, setGradingDialogOpen] = useState(false);

  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const { data, isLoading } = useGetQuizSubmissionsQuery({
    page,
    limit: 10,
  });

  const submissions = data?.data ?? [];

  const meta = data?.meta ?? {
    page: 1,
    total: 0,
    totalPages: 1,
  };

  const handleView = (submission) => {
    setSelectedSubmission(submission);
    setGradingDialogOpen(true);
  };

  const handleDialogChange = (open) => {
    setGradingDialogOpen(open);

    if (!open) {
      setSelectedSubmission(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Quiz Submissions
        </h1>

        <p className="text-sm text-muted-foreground">
          Review and grade quiz submissions from your students.
        </p>
      </div>

      <QuizSubmissionTable
        submissions={submissions}
        isLoading={isLoading}
        onView={handleView}
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

      <QuizSubmissionGradingDialog
        open={gradingDialogOpen}
        onOpenChange={handleDialogChange}
        submission={selectedSubmission}
      />
    </div>
  );
}
