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

const getStudentName = (attendance) => {
  const user = attendance?.enrollment?.student?.user;

  if (!user) {
    return "—";
  }

  return [user.firstName, user.middleName, user.lastName, user.suffix]
    .filter(Boolean)
    .join(" ")
    .trim();
};

const getSubject = (attendance) => {
  return (
    attendance?.classSchedule?.courseOffering?.curriculumSubject?.subject ??
    null
  );
};

const getSectionName = (attendance) => {
  return attendance?.classSchedule?.courseOffering?.section?.name ?? "—";
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString();
};

export default function AttendanceTable({
  attendances = [],
  isLoading,
  isDeleting,
  onEdit,
  onDelete,
}) {
  const canEdit = typeof onEdit === "function";

  const canDelete = typeof onDelete === "function";

  const showActions = canEdit || canDelete;

  const columnCount = showActions ? 7 : 6;

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>

              <TableHead>Subject</TableHead>

              <TableHead>Section</TableHead>

              <TableHead>Date</TableHead>

              <TableHead>Status</TableHead>

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
                  Loading attendance...
                </TableCell>
              </TableRow>
            ) : attendances.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className="h-24 text-center text-muted-foreground"
                >
                  No attendance records found.
                </TableCell>
              </TableRow>
            ) : (
              attendances.map((attendance) => {
                const subject = getSubject(attendance);

                return (
                  <TableRow key={attendance._id}>
                    <TableCell>
                      <div className="font-medium">
                        {getStudentName(attendance)}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {attendance?.enrollment?.student?.studentNumber ?? "—"}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium">{subject?.code ?? "—"}</div>

                      <div className="max-w-[240px] truncate text-xs text-muted-foreground">
                        {subject?.title ?? "—"}
                      </div>
                    </TableCell>

                    <TableCell>{getSectionName(attendance)}</TableCell>

                    <TableCell>{formatDate(attendance.date)}</TableCell>

                    <TableCell>{attendance.status ?? "—"}</TableCell>

                    <TableCell className="max-w-[240px] truncate">
                      {attendance.remarks || "—"}
                    </TableCell>

                    {showActions && (
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {canEdit && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              disabled={isDeleting}
                              onClick={() => onEdit(attendance)}
                            >
                              <Pencil />

                              <span className="sr-only">Edit attendance</span>
                            </Button>
                          )}

                          {canDelete && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              disabled={isDeleting}
                              onClick={() => onDelete(attendance)}
                            >
                              <Trash2 />

                              <span className="sr-only">Delete attendance</span>
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
