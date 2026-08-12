import { useMemo, useState } from "react";

import { useGetAssignmentsQuery } from "../api/assignmentApi";

import { useGetAssignmentSubmissionsQuery } from "@/features/academic/assignment-submission/api/assignmentSubmissionApi";

import { useGetEnrollmentsQuery } from "@/features/academic/enrollment/api/enrollmentApi";

import StudentAssignmentTable from "../components/StudentAssignmentTable";

import AssignmentSubmissionDialog from "@/features/academic/assignment-submission/components/AssignmentSubmissionDialog";

export default function StudentAssignmentPage() {
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const { data: assignmentData, isLoading: assignmentsLoading } =
    useGetAssignmentsQuery({
      page,
      limit: 10,
    });

  const { data: submissionData, isLoading: submissionsLoading } =
    useGetAssignmentSubmissionsQuery({
      page: 1,
      limit: 100,
    });

  const { data: enrollmentData, isLoading: enrollmentsLoading } =
    useGetEnrollmentsQuery({
      page: 1,
      limit: 100,
    });

  const assignments = assignmentData?.data ?? [];

  const submissions = submissionData?.data ?? [];

  const enrollments = enrollmentData?.data ?? [];

  const getEnrollmentForAssignment = (assignment) => {
    return enrollments.find((enrollment) => {
      const courseOfferingId =
        typeof enrollment.courseOffering === "object"
          ? enrollment.courseOffering?._id
          : enrollment.courseOffering;

      return courseOfferingId === assignment?.courseOffering?._id;
    });
  };

  const handleSubmit = (assignment) => {
    setSelectedAssignment(assignment);
    setSelectedSubmission(null);
    setDialogOpen(true);
  };

  const handleViewSubmission = (submission) => {
    const assignment =
      typeof submission.assignment === "object"
        ? submission.assignment
        : assignments.find((item) => item._id === submission.assignment);

    setSelectedAssignment(assignment);
    setSelectedSubmission(submission);
    setDialogOpen(true);
  };

  const selectedEnrollment = useMemo(() => {
    if (!selectedAssignment) {
      return null;
    }

    return getEnrollmentForAssignment(selectedAssignment);
  }, [selectedAssignment, enrollments]);

  const isLoading =
    assignmentsLoading || submissionsLoading || enrollmentsLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Assignments</h1>

        <p className="text-sm text-muted-foreground">
          View your assignments and submit your work.
        </p>
      </div>

      <StudentAssignmentTable
        assignments={assignments}
        submissions={submissions}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onViewSubmission={handleViewSubmission}
      />

      <AssignmentSubmissionDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedAssignment(null);
            setSelectedSubmission(null);
          }
        }}
        assignment={selectedAssignment}
        enrollmentId={selectedEnrollment?._id}
        submission={selectedSubmission}
      />
    </div>
  );
}
