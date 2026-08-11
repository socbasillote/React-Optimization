import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const getStudentName = (grade) => {
  const user = grade?.enrollment?.student?.user;

  if (!user) {
    return "—";
  }

  return [user.firstName, user.middleName, user.lastName, user.suffix]
    .filter(Boolean)
    .join(" ")
    .trim();
};

const getSubject = (grade) => {
  return grade?.enrollment?.courseOffering?.curriculumSubject?.subject;
};

const getSection = (grade) => {
  return grade?.enrollment?.courseOffering?.section?.name ?? "—";
};

const formatScore = (score) => {
  if (score === null || score === undefined) {
    return "—";
  }

  return Number(score).toFixed(2);
};

const formatRemarks = (remarks) => {
  if (!remarks) {
    return "—";
  }

  return remarks.charAt(0) + remarks.slice(1).toLowerCase();
};

export default function GradeTable({
  grades = [],
  isLoading,
  isDeleting,
  onEdit,
  onDelete,
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
              <TableHead>Student</TableHead>

              <TableHead>Subject</TableHead>

              <TableHead>Section</TableHead>

              <TableHead>Prelim</TableHead>

              <TableHead>Midterm</TableHead>

              <TableHead>Final</TableHead>

              <TableHead>Final Grade</TableHead>

              <TableHead>Remarks</TableHead>

              {showActions && (
                <TableHead className="w-[100px]">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columnCount} className="h-24 text-center">
                  Loading grades...
                </TableCell>
              </TableRow>
            ) : grades.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className="h-24 text-center text-muted-foreground"
                >
                  No grades found.
                </TableCell>
              </TableRow>
            ) : (
              grades.map((grade) => {
                const subject = getSubject(grade);

                return (
                  <TableRow key={grade._id}>
                    <TableCell>
                      <div className="font-medium">{getStudentName(grade)}</div>

                      <div className="text-xs text-muted-foreground">
                        {grade?.enrollment?.student?.studentNumber ?? "—"}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">{subject?.code ?? "—"}</div>

                      <div className="max-w-[220px] truncate text-xs text-muted-foreground">
                        {subject?.title ?? "—"}
                      </div>
                    </TableCell>

                    <TableCell>{getSection(grade)}</TableCell>

                    <TableCell>{formatScore(grade.prelim)}</TableCell>

                    <TableCell>{formatScore(grade.midterm)}</TableCell>

                    <TableCell>{formatScore(grade.final)}</TableCell>

                    <TableCell className="font-medium">
                      {formatScore(grade.finalGrade)}
                    </TableCell>

                    <TableCell>{formatRemarks(grade.remarks)}</TableCell>

                    {showActions && (
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {canEdit && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              disabled={isDeleting}
                              onClick={() => onEdit(grade)}
                            >
                              <Pencil />

                              <span className="sr-only">Edit grade</span>
                            </Button>
                          )}

                          {canDelete && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              disabled={isDeleting}
                              onClick={() => onDelete(grade)}
                            >
                              <Trash2 />

                              <span className="sr-only">Delete grade</span>
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
