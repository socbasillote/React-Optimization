import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useGetQuizSubmissionsQuery } from "../api/quizSubmissionApi";

import FacultyQuizSubmissionTable from "../components/FacultyQuizSubmissionTable";

import FacultyQuizSubmissionDialog from "../components/FacultyQuizSubmissionDialog";

export default function FacultyQuizSubmissionPage() {
  const [page, setPage] = useState(1);

  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleReview = (submission) => {
    setSelectedSubmission(submission);

    setDialogOpen(true);
  };

  const handleDialogChange = (open) => {
    setDialogOpen(open);

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
          Review student quiz submissions and provide grades and feedback.
        </p>
      </div>

      <FacultyQuizSubmissionTable
        submissions={submissions}
        isLoading={isLoading}
        onReview={handleReview}
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

      <FacultyQuizSubmissionDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        submission={selectedSubmission}
      />
    </div>
  );
}
