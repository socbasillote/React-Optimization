import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AttendanceDialog from "../components/AttendanceDialog";
import AttendanceTable from "../components/AttendanceTable";

import {
  useDeleteAttendanceMutation,
  useGetAttendancesQuery,
} from "../api/attendanceApi";

import {
  useGetEnrollmentsQuery,
  useLazyGetEnrollmentByIdQuery,
} from "@/features/academic/enrollment/api/enrollmentApi";

import { useGetClassSchedulesQuery } from "@/features/academic/class-schedule/api/classScheduleApi";

import { useGetCurrentUserQuery } from "@/features/auth/api/authApi";

const getEnrollmentLabel = (enrollment) => {
  const student = enrollment?.student;
  const user = student?.user;

  const studentName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "";

  const studentNumber = student?.studentNumber ?? "";

  const courseOffering = enrollment?.courseOffering;

  const subject = courseOffering?.curriculumSubject?.subject;

  const section = courseOffering?.section?.name;

  return [studentNumber, studentName, subject?.code, subject?.title, section]
    .filter(Boolean)
    .join(" • ");
};

const getClassScheduleLabel = (schedule) => {
  const courseOffering = schedule?.courseOffering;

  const subject = courseOffering?.curriculumSubject?.subject;

  const section = courseOffering?.section;

  const faculty = courseOffering?.faculty?.user;

  const facultyName = faculty
    ? `${faculty.firstName ?? ""} ${faculty.lastName ?? ""}`.trim()
    : "";

  return [
    subject?.code,
    subject?.title,
    section?.name,
    schedule?.day,
    schedule?.startTime && schedule?.endTime
      ? `${schedule.startTime} - ${schedule.endTime}`
      : "",
    facultyName,
  ]
    .filter(Boolean)
    .join(" • ");
};

const formatAttendanceDate = (date) => {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString();
};

export default function AttendancePage() {
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedAttendance, setSelectedAttendance] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [attendanceToDelete, setAttendanceToDelete] = useState(null);

  const [deleteStudent, setDeleteStudent] = useState(null);

  const { data: currentUserData } = useGetCurrentUserQuery();

  const role = currentUserData?.data?.role;

  const canCreate =
    role === "SUPER_ADMIN" || role === "ADMIN" || role === "FACULTY";

  const canEdit =
    role === "SUPER_ADMIN" || role === "ADMIN" || role === "FACULTY";

  const canDelete = role === "SUPER_ADMIN" || role === "ADMIN";

  const canManage = canCreate || canEdit || canDelete;

  const { data, isLoading } = useGetAttendancesQuery({
    page,
    limit: 10,
  });

  const { data: enrollmentData, isLoading: enrollmentLoading } =
    useGetEnrollmentsQuery(
      {
        page: 1,
        limit: 100,
      },
      {
        skip: !canCreate && !canEdit,
      },
    );

  const { data: classScheduleData, isLoading: classScheduleLoading } =
    useGetClassSchedulesQuery(
      {
        page: 1,
        limit: 100,
      },
      {
        skip: !canCreate && !canEdit,
      },
    );

  const [getEnrollmentById, { isLoading: isLoadingDeleteStudent }] =
    useLazyGetEnrollmentByIdQuery();

  const [deleteAttendance, { isLoading: isDeleting }] =
    useDeleteAttendanceMutation();

  const attendances = data?.data ?? [];

  const meta = data?.meta ?? {
    page: 1,
    totalPages: 1,
    total: 0,
  };

  const enrollments = enrollmentData?.data ?? [];

  const classSchedules = classScheduleData?.data ?? [];

  const enrollmentOptions = enrollments.map((enrollment) => ({
    value: enrollment._id,
    label: getEnrollmentLabel(enrollment),
  }));

  const classScheduleOptions = classSchedules.map((schedule) => ({
    value: schedule._id,
    label: getClassScheduleLabel(schedule),
  }));

  const handleCreate = () => {
    if (!canCreate) {
      return;
    }

    setSelectedAttendance(null);
    setDialogOpen(true);
  };

  const handleEdit = (attendance) => {
    if (!canEdit) {
      return;
    }

    setSelectedAttendance(attendance);
    setDialogOpen(true);
  };

  const handleDelete = async (attendance) => {
    if (!canDelete) {
      return;
    }

    setAttendanceToDelete(attendance);
    setDeleteStudent(null);
    setDeleteDialogOpen(true);

    try {
      const enrollmentId =
        typeof attendance?.enrollment === "object"
          ? attendance.enrollment?._id
          : attendance?.enrollment;

      if (!enrollmentId) {
        return;
      }

      const result = await getEnrollmentById(enrollmentId).unwrap();

      setDeleteStudent(result?.data?.student ?? null);
    } catch (error) {
      console.error("Failed to load enrollment:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!canDelete || !attendanceToDelete) {
      return;
    }

    try {
      await deleteAttendance(attendanceToDelete._id).unwrap();

      setDeleteDialogOpen(false);
      setAttendanceToDelete(null);
      setDeleteStudent(null);
    } catch (error) {
      console.error("Failed to delete attendance:", error);
    }
  };

  const handleDeleteDialogChange = (open) => {
    setDeleteDialogOpen(open);

    if (!open) {
      setAttendanceToDelete(null);
      setDeleteStudent(null);
    }
  };

  const handleDialogChange = (open) => {
    setDialogOpen(open);

    if (!open) {
      setSelectedAttendance(null);
    }
  };

  const getDeleteStudentName = () => {
    if (!deleteStudent) {
      return "Student information unavailable";
    }

    const user = deleteStudent.user;

    if (!user) {
      return deleteStudent.studentNumber ?? "Student information unavailable";
    }

    const name = [user.firstName, user.middleName, user.lastName, user.suffix]
      .filter(Boolean)
      .join(" ")
      .trim();

    return (
      name || deleteStudent.studentNumber || "Student information unavailable"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Attendance</h1>

          <p className="text-sm text-muted-foreground">
            {canManage
              ? "Manage student attendance records."
              : "View your attendance records."}
          </p>
        </div>

        {canCreate && (
          <Button onClick={handleCreate}>
            <Plus />
            Record Attendance
          </Button>
        )}
      </div>

      <AttendanceTable
        attendances={attendances}
        isLoading={isLoading}
        isDeleting={isDeleting}
        onEdit={canEdit ? handleEdit : undefined}
        onDelete={canDelete ? handleDelete : undefined}
      />

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {canCreate || canEdit ? (
        <AttendanceDialog
          open={dialogOpen}
          onOpenChange={handleDialogChange}
          attendance={selectedAttendance}
          enrollmentOptions={enrollmentOptions}
          classScheduleOptions={classScheduleOptions}
          enrollmentLoading={enrollmentLoading}
          classScheduleLoading={classScheduleLoading}
        />
      ) : null}

      {canDelete && (
        <Dialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Attendance</DialogTitle>

              <DialogDescription>
                Are you sure you want to delete this attendance record? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {attendanceToDelete && (
              <div className="space-y-3 rounded-md border bg-muted/50 p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Student</p>

                  {isLoadingDeleteStudent ? (
                    <p className="text-sm text-muted-foreground">
                      Loading student...
                    </p>
                  ) : (
                    <p className="font-medium">{getDeleteStudentName()}</p>
                  )}
                </div>

                {deleteStudent?.studentNumber && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Student Number
                    </p>

                    <p className="text-sm">{deleteStudent.studentNumber}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-muted-foreground">Date</p>

                  <p className="text-sm">
                    {formatAttendanceDate(attendanceToDelete.date)}
                  </p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isDeleting}
                onClick={() => handleDeleteDialogChange(false)}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="destructive"
                disabled={isDeleting || isLoadingDeleteStudent}
                onClick={handleDeleteConfirm}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
