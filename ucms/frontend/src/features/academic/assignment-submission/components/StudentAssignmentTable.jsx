import { Eye, FileUp } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getSubject = (assignment) => {
  return assignment?.courseOffering?.curriculumSubject?.subject;
};

const getSection = (assignment) => {
  return assignment?.courseOffering?.section;
};

const formatDateTime = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
};

const getSubmission = (assignment, submissions) => {
  if (!assignment?._id) {
    return null;
  }

  return (
    submissions.find((submission) => {
      const submissionAssignment = submission?.assignment;

      const assignmentId =
        typeof submissionAssignment === "object"
          ? submissionAssignment?._id
          : submissionAssignment;

      return String(assignmentId) === String(assignment._id);
    }) ?? null
  );
};

const formatScore = (submission) => {
  if (
    !submission ||
    submission.score === null ||
    submission.score === undefined
  ) {
    return "Pending";
  }

  return submission.score;
};

export default function StudentAssignmentTable({
  assignments = [],
  submissions = [],
  isLoading,
  onSubmit,
  onViewSubmission,
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Assignment</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Max Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead className="w-[130px]">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  Loading assignments...
                </TableCell>
              </TableRow>
            ) : assignments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="h-24 text-center text-muted-foreground"
                >
                  No assignments found.
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((assignment) => {
                const subject = getSubject(assignment);
                const section = getSection(assignment);

                const submission = getSubmission(assignment, submissions);

                const isSubmitted = Boolean(submission);

                return (
                  <TableRow key={assignment._id}>
                    <TableCell>
                      <div className="font-medium">{assignment.title}</div>

                      {assignment.description && (
                        <div className="max-w-[280px] truncate text-xs text-muted-foreground">
                          {assignment.description}
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">{subject?.code ?? "—"}</div>

                      <div className="max-w-[220px] truncate text-xs text-muted-foreground">
                        {subject?.title ?? "—"}
                      </div>
                    </TableCell>

                    <TableCell>{section?.name ?? "—"}</TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(assignment.availableFrom)}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(assignment.dueDate)}
                    </TableCell>

                    <TableCell>{assignment.maxScore}</TableCell>

                    <TableCell>
                      {isSubmitted ? (
                        <span className="font-medium">Submitted</span>
                      ) : (
                        <span className="text-muted-foreground">
                          Not submitted
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      {isSubmitted ? formatScore(submission) : "—"}
                    </TableCell>

                    <TableCell className="max-w-[220px]">
                      {isSubmitted ? (
                        submission.feedback ? (
                          <span
                            className="block truncate"
                            title={submission.feedback}
                          >
                            {submission.feedback}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Pending</span>
                        )
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>
                      {isSubmitted ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewSubmission(submission)}
                        >
                          <Eye />
                          View
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => onSubmit(assignment)}
                        >
                          <FileUp />
                          Submit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
