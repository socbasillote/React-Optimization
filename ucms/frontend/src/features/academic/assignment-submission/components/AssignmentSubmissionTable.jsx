import { Eye, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const getStudentNumber = (submission) => {
  return submission?.enrollment?.student?.studentNumber ?? "—";
};

const getAssignment = (submission) => {
  return submission?.assignment;
};

const getSubject = (submission) => {
  return getAssignment(submission)?.courseOffering?.curriculumSubject?.subject;
};

const getSection = (submission) => {
  return getAssignment(submission)?.courseOffering?.section?.name ?? "—";
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

const getScoreLabel = (submission) => {
  if (submission?.score === null || submission?.score === undefined) {
    return "Pending";
  }

  return `${submission.score} / ${submission?.assignment?.maxScore ?? "—"}`;
};

export default function AssignmentSubmissionTable({
  submissions = [],
  isLoading,
  isUpdating,
  onView,
  onGrade,
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Assignment</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead className="w-[130px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Loading submissions...
                </TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  No assignment submissions found.
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => {
                const subject = getSubject(submission);

                return (
                  <TableRow key={submission._id}>
                    <TableCell>
                      <div className="font-medium">
                        {getStudentName(submission)}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {getStudentNumber(submission)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">
                        {getAssignment(submission)?.title ?? "—"}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">{subject?.code ?? "—"}</div>

                      <div className="max-w-[200px] truncate text-xs text-muted-foreground">
                        {subject?.title ?? "—"}
                      </div>
                    </TableCell>

                    <TableCell>{getSection(submission)}</TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(submission.submittedAt)}
                    </TableCell>

                    <TableCell>{getScoreLabel(submission)}</TableCell>

                    <TableCell className="max-w-[240px]">
                      {submission.feedback ? (
                        <span
                          className="block truncate"
                          title={submission.feedback}
                        >
                          {submission.feedback}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onView(submission)}
                        >
                          <Eye />

                          <span className="sr-only">View submission</span>
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          disabled={isUpdating}
                          onClick={() => onGrade(submission)}
                        >
                          <Pencil />

                          <span className="sr-only">Grade submission</span>
                        </Button>
                      </div>
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
