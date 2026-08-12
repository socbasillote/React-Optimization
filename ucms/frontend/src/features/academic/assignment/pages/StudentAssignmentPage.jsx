import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useGetAssignmentsQuery } from "../api/assignmentApi";

import { useGetMyAssignmentSubmissionsQuery } from "@/features/academic/assignment-submission/api/assignmentSubmissionApi";

import { useGetEnrollmentsQuery } from "@/features/academic/enrollment/api/enrollmentApi";

import StudentAssignmentTable from "../components/StudentAssignmentTable";
import StudentAssignmentSubmissionDialog from "../components/StudentAssignmentSubmissionDialog";
import StudentAssignmentViewDialog from "../components/StudentAssignmentViewDialog";

export default function StudentAssignmentPage() {
  const [page, setPage] = useState(1);

  // =========================
  // SUBMIT ASSIGNMENT
  // =========================

  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // =========================
  // VIEW SUBMISSION
  // =========================

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // =========================
  // ASSIGNMENTS
  // =========================

  const { data: assignmentData, isLoading: assignmentsLoading } =
    useGetAssignmentsQuery({
      page,
      limit: 10,
    });

  // =========================
  // MY SUBMISSIONS
  // =========================

  const { data: submissionData, isLoading: submissionsLoading } =
    useGetMyAssignmentSubmissionsQuery({
      page: 1,
      limit: 100,
    });

  // =========================
  // ENROLLMENTS
  // =========================

  const { data: enrollmentData, isLoading: enrollmentsLoading } =
    useGetEnrollmentsQuery({
      page: 1,
      limit: 100,
    });

  const assignments = assignmentData?.data ?? [];
  const submissions = submissionData?.data ?? [];
  const enrollments = enrollmentData?.data ?? [];

  const meta = assignmentData?.meta ?? {
    page: 1,
    totalPages: 1,
  };

  // =========================
  // FIND STUDENT ENROLLMENT
  // =========================

  const getEnrollmentForAssignment = (assignment) => {
    const courseOfferingId =
      typeof assignment?.courseOffering === "object"
        ? assignment.courseOffering?._id
        : assignment?.courseOffering;

    return enrollments.find((enrollment) => {
      const enrollmentCourseOfferingId =
        typeof enrollment?.courseOffering === "object"
          ? enrollment.courseOffering?._id
          : enrollment.courseOffering;

      return enrollmentCourseOfferingId === courseOfferingId;
    });
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = (assignment) => {
    setSelectedAssignment(assignment);

    setSubmitDialogOpen(true);
  };

  // =========================
  // VIEW SUBMISSION
  // =========================

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);

    setViewDialogOpen(true);
  };

  const selectedEnrollment = selectedAssignment
    ? getEnrollmentForAssignment(selectedAssignment)
    : null;

  const isLoading =
    assignmentsLoading || submissionsLoading || enrollmentsLoading;

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Assignments</h1>

        <p className="text-sm text-muted-foreground">
          View your assignments and submit your work.
        </p>
      </div>

      {/* TABLE */}

      <StudentAssignmentTable
        assignments={assignments}
        submissions={submissions}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onViewSubmission={handleViewSubmission}
      />

      {/* =========================
          STUDENT SUBMIT DIALOG
          ========================= */}

      <StudentAssignmentSubmissionDialog
        open={submitDialogOpen}
        onOpenChange={(open) => {
          setSubmitDialogOpen(open);

          if (!open) {
            setSelectedAssignment(null);
          }
        }}
        assignment={selectedAssignment}
        enrollmentId={selectedEnrollment?._id}
      />

      {/* =========================
          STUDENT VIEW SUBMISSION
          ========================= */}

      <StudentAssignmentViewDialog
        open={viewDialogOpen}
        onOpenChange={(open) => {
          setViewDialogOpen(open);

          if (!open) {
            setSelectedSubmission(null);
          }
        }}
        submission={selectedSubmission}
      />

      {/* =========================
          PAGINATION
          ========================= */}

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
