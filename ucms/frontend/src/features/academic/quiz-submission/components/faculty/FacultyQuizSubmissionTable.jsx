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

const getStudent = (submission) => {
  return submission?.enrollment?.student?.user;
};

const getStudentName = (submission) => {
  const user = getStudent(submission);

  if (!user) {
    return "—";
  }

  return [user.firstName, user.middleName, user.lastName, user.suffix]
    .filter(Boolean)
    .join(" ")
    .trim();
};

const getStudentEmail = (submission) => {
  return getStudent(submission)?.email ?? "—";
};

const getQuizTitle = (submission) => {
  return submission?.quiz?.title ?? "—";
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

const getStatus = (submission) => {
  if (!submission?.submittedAt) {
    return "In progress";
  }

  if (submission.score === null || submission.score === undefined) {
    return "Pending";
  }

  return "Graded";
};

const getScore = (submission) => {
  if (submission?.score === null || submission?.score === undefined) {
    return "Pending";
  }

  return `${submission.score} / ${submission.quiz?.maxScore ?? "—"}`;
};

export default function FacultyQuizSubmissionTable({
  submissions = [],
  isLoading,
  onReview,
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Quiz</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px]">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading submissions...
                </TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No quiz submissions found.
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => {
                const status = getStatus(submission);

                return (
                  <TableRow key={submission._id}>
                    <TableCell>
                      <div className="font-medium">
                        {getStudentName(submission)}
                      </div>
                    </TableCell>

                    <TableCell>{getStudentEmail(submission)}</TableCell>

                    <TableCell>
                      <div className="font-medium">
                        {getQuizTitle(submission)}
                      </div>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(submission.submittedAt)}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {getScore(submission)}
                    </TableCell>

                    <TableCell>
                      <span
                        className={
                          status === "Graded"
                            ? "font-medium"
                            : status === "Pending"
                              ? "font-medium"
                              : "text-muted-foreground"
                        }
                      >
                        {status}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Button
                        type="button"
                        variant={status === "Graded" ? "ghost" : "default"}
                        size="sm"
                        onClick={() => onReview(submission)}
                      >
                        {status === "Graded" ? <Eye /> : <Pencil />}

                        {status === "Graded" ? "Review" : "Grade"}
                      </Button>
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
