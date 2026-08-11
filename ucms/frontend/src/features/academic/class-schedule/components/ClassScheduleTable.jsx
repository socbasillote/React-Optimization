import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function getSubject(schedule) {
  const subject = schedule?.courseOffering?.curriculumSubject?.subject;

  if (!subject) {
    return {
      code: "—",
      title: "Course information unavailable",
    };
  }

  return {
    code: subject.code ?? "—",
    title: subject.title ?? "—",
  };
}

function getFaculty(schedule) {
  const faculty = schedule?.courseOffering?.faculty?.user;

  if (!faculty) {
    return "—";
  }

  return [faculty.firstName, faculty.lastName].filter(Boolean).join(" ");
}

export default function ClassScheduleTable({
  classSchedules = [],
  loading,
  onEdit,
  onDelete,
}) {
  const canManage =
    typeof onEdit === "function" || typeof onDelete === "function";

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Faculty</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Room</TableHead>

              {canManage && (
                <TableHead className="w-16 text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={canManage ? 7 : 6}
                  className="h-24 text-center"
                >
                  Loading class schedules...
                </TableCell>
              </TableRow>
            ) : classSchedules.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={canManage ? 7 : 6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No class schedules found.
                </TableCell>
              </TableRow>
            ) : (
              classSchedules.map((schedule) => {
                const subject = getSubject(schedule);

                return (
                  <TableRow key={schedule._id}>
                    <TableCell>
                      <div className="min-w-0">
                        <p className="font-medium">{subject.code}</p>

                        <p className="max-w-[280px] truncate text-sm text-muted-foreground">
                          {subject.title}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      {schedule?.courseOffering?.section?.name ?? "—"}
                    </TableCell>

                    <TableCell>{getFaculty(schedule)}</TableCell>

                    <TableCell>{schedule.day}</TableCell>

                    <TableCell className="whitespace-nowrap">
                      {schedule.startTime} – {schedule.endTime}
                    </TableCell>

                    <TableCell>{schedule.room}</TableCell>

                    {canManage && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={<Button variant="ghost" size="icon" />}
                          >
                            <MoreHorizontal className="size-4" />

                            <span className="sr-only">Open actions</span>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            {onEdit && (
                              <DropdownMenuItem
                                onClick={() => onEdit(schedule)}
                              >
                                <Pencil className="mr-2 size-4" />
                                Edit
                              </DropdownMenuItem>
                            )}

                            {onEdit && onDelete && <DropdownMenuSeparator />}

                            {onDelete && (
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => onDelete(schedule)}
                              >
                                <Trash2 className="mr-2 size-4" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
