import { Pencil, Trash2, ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getCourseOffering = (quiz) => {
  return quiz?.courseOffering;
};

const getSubject = (quiz) => {
  return getCourseOffering(quiz)?.curriculumSubject?.subject;
};

const getFaculty = (quiz) => {
  return getCourseOffering(quiz)?.faculty?.user;
};

const getSection = (quiz) => {
  return getCourseOffering(quiz)?.section;
};

const formatFacultyName = (quiz) => {
  const faculty = getFaculty(quiz);

  if (!faculty) {
    return "—";
  }

  return [faculty.firstName, faculty.lastName].filter(Boolean).join(" ").trim();
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

export default function QuizTable({
  quizzes = [],
  isLoading,
  isDeleting,
  onEdit,
  onDelete,
  onManageQuestions,
}) {
  const canEdit = typeof onEdit === "function";

  const canDelete = typeof onDelete === "function";

  const showActions = canEdit || canDelete;

  const columnCount = showActions ? 9 : 8;

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quiz</TableHead>

              <TableHead>Course</TableHead>

              <TableHead>Section</TableHead>

              <TableHead>Faculty</TableHead>

              <TableHead>Available</TableHead>

              <TableHead>Due</TableHead>

              <TableHead>Time Limit</TableHead>

              <TableHead>Max Score</TableHead>

              {showActions && (
                <TableHead className="w-[100px]">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-24 text-center">
                  Loading quizzes...
                </TableCell>
              </TableRow>
            ) : quizzes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className="h-24 text-center text-muted-foreground"
                >
                  No quizzes found.
                </TableCell>
              </TableRow>
            ) : (
              quizzes.map((quiz) => {
                const subject = getSubject(quiz);

                const section = getSection(quiz);

                return (
                  <TableRow key={quiz._id}>
                    <TableCell>
                      <div className="font-medium">{quiz.title}</div>

                      {quiz.description && (
                        <div className="max-w-[240px] truncate text-xs text-muted-foreground">
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

                    <TableCell>{formatFacultyName(quiz)}</TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(quiz.availableFrom)}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(quiz.dueDate)}
                    </TableCell>

                    <TableCell>{quiz.timeLimit} min</TableCell>

                    <TableCell>{quiz.maxScore}</TableCell>

                    {showActions && (
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {canEdit && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              disabled={isDeleting}
                              onClick={() => onEdit(quiz)}
                            >
                              <Pencil />

                              <span className="sr-only">Edit quiz</span>
                            </Button>
                          )}

                          {onManageQuestions && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => onManageQuestions(quiz)}
                            >
                              <ClipboardList />
                              Questions
                            </Button>
                          )}

                          {canDelete && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              disabled={isDeleting}
                              onClick={() => onDelete(quiz)}
                            >
                              <Trash2 />

                              <span className="sr-only">Delete quiz</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
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
