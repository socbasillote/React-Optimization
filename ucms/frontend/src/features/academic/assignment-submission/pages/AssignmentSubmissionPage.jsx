import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useGetAssignmentSubmissionsQuery } from "../api/assignmentSubmissionApi";

import AssignmentSubmissionTable from "../components/AssignmentSubmissionTable";
import AssignmentSubmissionGradeDialog from "../components/AssignmentSubmissionGradeDialog";

export default function AssignmentSubmissionPage() {
  const [page, setPage] = useState(1);

  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);

  const { data, isLoading } = useGetAssignmentSubmissionsQuery({
    page,
    limit: 10,
  });

  const submissions = data?.data ?? [];

  const meta = data?.meta ?? {
    page: 1,
    total: 0,
    totalPages: 1,
  };

  const handleGrade = (submission) => {
    setSelectedSubmission(submission);
    setGradeDialogOpen(true);
  };

  const handleView = (submission) => {
    setSelectedSubmission(submission);
    setGradeDialogOpen(true);
  };

  const handleDialogChange = (open) => {
    setGradeDialogOpen(open);

    if (!open) {
      setSelectedSubmission(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Assignment Submissions
        </h1>

        <p className="text-sm text-muted-foreground">
          Review and grade student assignment submissions.
        </p>
      </div>

      <AssignmentSubmissionTable
        submissions={submissions}
        isLoading={isLoading}
        isUpdating={false}
        onView={handleView}
        onGrade={handleGrade}
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

      <AssignmentSubmissionGradeDialog
        open={gradeDialogOpen}
        onOpenChange={handleDialogChange}
        submission={selectedSubmission}
      />
    </div>
  );
}
