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
  return submissions.find((submission) => {
    const assignmentId =
      typeof submission.assignment === "object"
        ? submission.assignment?._id
        : submission.assignment;

    return assignmentId === assignment._id;
  });
};

const getSubmissionStatus = (submission) => {
  if (!submission) {
    return "Not submitted";
  }

  if (submission.score === null || submission.score === undefined) {
    return "Pending";
  }

  return "Graded";
};

const formatScore = (submission, maxScore) => {
  if (!submission) {
    return "—";
  }

  if (submission.score === null || submission.score === undefined) {
    return "Pending";
  }

  return `${submission.score} / ${maxScore}`;
};

const getFeedback = (submission) => {
  if (!submission) {
    return "—";
  }

  if (!submission.feedback?.trim()) {
    return "Pending";
  }

  return submission.feedback;
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

                const status = getSubmissionStatus(submission);

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
                      {!submission ? (
                        <span className="text-muted-foreground">{status}</span>
                      ) : status === "Pending" ? (
                        <span className="font-medium">Pending</span>
                      ) : (
                        <span className="font-medium">Graded</span>
                      )}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatScore(submission, assignment.maxScore)}
                    </TableCell>

                    <TableCell>
                      <div
                        className="max-w-[240px] truncate"
                        title={getFeedback(submission)}
                      >
                        {getFeedback(submission)}
                      </div>
                    </TableCell>

                    <TableCell>
                      {submission ? (
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
