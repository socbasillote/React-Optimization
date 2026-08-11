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

const getCourseOffering = (assignment) => {
  return assignment?.courseOffering;
};

const getSubject = (assignment) => {
  return getCourseOffering(assignment)?.curriculumSubject?.subject;
};

const getFaculty = (assignment) => {
  return getCourseOffering(assignment)?.faculty?.user;
};

const getSection = (assignment) => {
  return getCourseOffering(assignment)?.section;
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

const formatFacultyName = (assignment) => {
  const faculty = getFaculty(assignment);

  if (!faculty) {
    return "—";
  }

  return [faculty.firstName, faculty.lastName].filter(Boolean).join(" ").trim();
};

export default function AssignmentTable({
  assignments = [],
  isLoading,
  isDeleting,
  onEdit,
  onDelete,
}) {
  const canEdit = typeof onEdit === "function";

  const canDelete = typeof onDelete === "function";

  const showActions = canEdit || canDelete;

  const columnCount = showActions ? 8 : 7;

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Assignment</TableHead>

              <TableHead>Course</TableHead>

              <TableHead>Section</TableHead>

              <TableHead>Faculty</TableHead>

              <TableHead>Available</TableHead>

              <TableHead>Due</TableHead>

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
                  Loading assignments...
                </TableCell>
              </TableRow>
            ) : assignments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className="h-24 text-center text-muted-foreground"
                >
                  No assignments found.
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((assignment) => {
                const subject = getSubject(assignment);

                const section = getSection(assignment);

                return (
                  <TableRow key={assignment._id}>
                    <TableCell>
                      <div className="font-medium">{assignment.title}</div>

                      {assignment.description && (
                        <div className="max-w-[240px] truncate text-xs text-muted-foreground">
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

                    <TableCell>{formatFacultyName(assignment)}</TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(assignment.availableFrom)}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(assignment.dueDate)}
                    </TableCell>

                    <TableCell>{assignment.maxScore}</TableCell>

                    {showActions && (
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {canEdit && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              disabled={isDeleting}
                              onClick={() => onEdit(assignment)}
                            >
                              <Pencil />

                              <span className="sr-only">Edit assignment</span>
                            </Button>
                          )}

                          {canDelete && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              disabled={isDeleting}
                              onClick={() => onDelete(assignment)}
                            >
                              <Trash2 />

                              <span className="sr-only">Delete assignment</span>
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
