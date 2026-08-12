import { Eye } from "lucide-react";

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

const getQuiz = (submission) => {
  return submission?.quiz;
};

const getCourseOffering = (submission) => {
  return getQuiz(submission)?.courseOffering;
};

const getSubject = (submission) => {
  return getCourseOffering(submission)?.curriculumSubject?.subject;
};

const getSection = (submission) => {
  return getCourseOffering(submission)?.section;
};

const formatStudentName = (submission) => {
  const student = getStudent(submission);

  if (!student) {
    return "—";
  }

  return [student.firstName, student.middleName, student.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
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
  if (submission?.score === null || submission?.score === undefined) {
    return "Pending";
  }

  return "Graded";
};

export default function QuizSubmissionTable({
  submissions = [],
  isLoading,
  onView,
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Quiz</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Feedback</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  Loading quiz submissions...
                </TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="h-24 text-center text-muted-foreground"
                >
                  No quiz submissions found.
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => {
                const quiz = getQuiz(submission);
                const subject = getSubject(submission);
                const section = getSection(submission);

                const status = getStatus(submission);

                return (
                  <TableRow key={submission._id}>
                    <TableCell>
                      <div className="font-medium">
                        {formatStudentName(submission)}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {getStudent(submission)?.email ?? "—"}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">{quiz?.title ?? "—"}</div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">{subject?.code ?? "—"}</div>

                      <div className="max-w-[180px] truncate text-xs text-muted-foreground">
                        {subject?.title ?? "—"}
                      </div>
                    </TableCell>

                    <TableCell>{section?.name ?? "—"}</TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(submission.startedAt)}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(submission.submittedAt)}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {submission.score === null ||
                      submission.score === undefined
                        ? "—"
                        : `${submission.score} / ${quiz?.maxScore ?? "—"}`}
                    </TableCell>

                    <TableCell>
                      <span
                        className={
                          status === "Graded"
                            ? "font-medium"
                            : "text-muted-foreground"
                        }
                      >
                        {status}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div
                        className="max-w-[240px] truncate"
                        title={submission.feedback || ""}
                      >
                        {submission.feedback?.trim() || "—"}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(submission)}
                      >
                        <Eye />
                        View
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
