import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import AttendanceForm from "./AttendanceForm";

import {
  useCreateAttendanceMutation,
  useUpdateAttendanceMutation,
} from "../api/attendanceApi";

import { attendanceSchema } from "../schemas/attendanceSchema";

const defaultValues = {
  enrollment: "",
  classSchedule: "",
  date: "",
  status: "PRESENT",
  remarks: "",
};

const getDefaultValues = (attendance) => {
  if (!attendance) {
    return defaultValues;
  }

  return {
    enrollment: attendance.enrollment?._id ?? attendance.enrollment ?? "",

    classSchedule:
      attendance.classSchedule?._id ?? attendance.classSchedule ?? "",

    date: attendance.date
      ? new Date(attendance.date).toISOString().slice(0, 10)
      : "",

    status: attendance.status ?? "PRESENT",

    remarks: attendance.remarks ?? "",
  };
};

export default function AttendanceDialog({
  open,
  onOpenChange,
  attendance = null,

  enrollmentOptions = [],
  classScheduleOptions = [],

  enrollmentLoading = false,
  classScheduleLoading = false,
}) {
  const isEdit = Boolean(attendance);

  const [createAttendance, { isLoading: isCreating }] =
    useCreateAttendanceMutation();

  const [updateAttendance, { isLoading: isUpdating }] =
    useUpdateAttendanceMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(attendanceSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(getDefaultValues(attendance));
  }, [open, attendance, reset]);

  const isLoading = isCreating || isUpdating;

  const handleSubmitForm = async (values) => {
    clearErrors("root");

    try {
      if (isEdit) {
        await updateAttendance({
          id: attendance._id,
          ...values,
        }).unwrap();
      } else {
        await createAttendance(values).unwrap();
      }

      onOpenChange(false);
      reset(defaultValues);
    } catch (error) {
      const message =
        error?.data?.message ?? "Unable to save attendance record.";

      setError("root", {
        type: "server",
        message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Attendance" : "Record Attendance"}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? "Update the attendance record."
              : "Record attendance for a student and class schedule."}
          </DialogDescription>
        </DialogHeader>

        {errors.root?.message && (
          <div
            role="alert"
            className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {errors.root.message}
          </div>
        )}

        <form
          id="attendance-form"
          onSubmit={handleSubmit(handleSubmitForm)}
          className="min-w-0 space-y-5"
        >
          <AttendanceForm
            register={register}
            control={control}
            errors={errors}
            enrollmentOptions={enrollmentOptions}
            classScheduleOptions={classScheduleOptions}
            enrollmentLoading={enrollmentLoading}
            classScheduleLoading={classScheduleLoading}
          />
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button type="submit" form="attendance-form" disabled={isLoading}>
            {isLoading ? "Saving..." : isEdit ? "Update" : "Record Attendance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
