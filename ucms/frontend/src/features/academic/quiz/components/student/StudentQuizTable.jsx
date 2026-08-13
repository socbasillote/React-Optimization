import { Eye, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getSubject = (quiz) => {
  return quiz?.courseOffering?.curriculumSubject?.subject;
};

const getSection = (quiz) => {
  return quiz?.courseOffering?.section;
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

const getSubmission = (quiz, submissions) => {
  return submissions.find((submission) => {
    const quizId =
      typeof submission.quiz === "object"
        ? submission.quiz?._id
        : submission.quiz;

    return quizId === quiz._id;
  });
};

const getStatus = (submission) => {
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

export default function StudentQuizTable({
  quizzes = [],
  submissions = [],
  isLoading,
  onStartQuiz,
  onViewSubmission,
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quiz</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Time Limit</TableHead>
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
                <TableCell colSpan={11} className="h-24 text-center">
                  Loading quizzes...
                </TableCell>
              </TableRow>
            ) : quizzes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="h-24 text-center text-muted-foreground"
                >
                  No quizzes found.
                </TableCell>
              </TableRow>
            ) : (
              quizzes.map((quiz) => {
                const subject = getSubject(quiz);
                const section = getSection(quiz);

                const submission = getSubmission(quiz, submissions);

                const status = getStatus(submission);

                return (
                  <TableRow key={quiz._id}>
                    <TableCell>
                      <div className="font-medium">{quiz.title}</div>

                      {quiz.description && (
                        <div className="max-w-[280px] truncate text-xs text-muted-foreground">
                          {quiz.description}
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
                      {formatDateTime(quiz.availableFrom)}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(quiz.dueDate)}
                    </TableCell>

                    <TableCell>
                      {quiz.timeLimit ? `${quiz.timeLimit} min` : "—"}
                    </TableCell>

                    <TableCell>{quiz.maxScore ?? "—"}</TableCell>

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

                    <TableCell className="whitespace-nowrap">
                      {formatScore(submission, quiz.maxScore)}
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
                          onClick={() => onStartQuiz(quiz)}
                        >
                          <Play />
                          Start
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
