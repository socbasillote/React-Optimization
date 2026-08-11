import { Controller } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const attendanceStatuses = [
  {
    value: "PRESENT",
    label: "Present",
  },
  {
    value: "ABSENT",
    label: "Absent",
  },
  {
    value: "LATE",
    label: "Late",
  },
  {
    value: "EXCUSED",
    label: "Excused",
  },
];

export default function AttendanceForm({
  register,
  control,
  errors,
  enrollmentOptions = [],
  classScheduleOptions = [],
  enrollmentLoading = false,
  classScheduleLoading = false,
}) {
  return (
    <div className="grid gap-4">
      <Field>
        <FieldLabel>Enrollment</FieldLabel>

        <Controller
          control={control}
          name="enrollment"
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={field.onChange}
              items={enrollmentOptions}
            >
              <SelectTrigger
                className="w-full min-w-0"
                aria-invalid={!!errors.enrollment}
              >
                <SelectValue placeholder="Select enrollment" />
              </SelectTrigger>

              <SelectContent>
                {enrollmentLoading ? (
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    Loading enrollments...
                  </div>
                ) : enrollmentOptions.length === 0 ? (
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    No enrollments available.
                  </div>
                ) : (
                  enrollmentOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />

        <FieldError>{errors.enrollment?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Class Schedule</FieldLabel>

        <Controller
          control={control}
          name="classSchedule"
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={field.onChange}
              items={classScheduleOptions}
            >
              <SelectTrigger
                className="w-full min-w-0"
                aria-invalid={!!errors.classSchedule}
              >
                <SelectValue placeholder="Select class schedule" />
              </SelectTrigger>

              <SelectContent>
                {classScheduleLoading ? (
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    Loading class schedules...
                  </div>
                ) : classScheduleOptions.length === 0 ? (
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    No class schedules available.
                  </div>
                ) : (
                  classScheduleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />

        <FieldError>{errors.classSchedule?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Date</FieldLabel>

        <Input type="date" {...register("date")} aria-invalid={!!errors.date} />

        <FieldError>{errors.date?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Status</FieldLabel>

        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={field.onChange}
              items={attendanceStatuses}
            >
              <SelectTrigger className="w-full" aria-invalid={!!errors.status}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                {attendanceStatuses.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <FieldError>{errors.status?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Remarks</FieldLabel>

        <Input
          placeholder="Optional remarks"
          {...register("remarks")}
          aria-invalid={!!errors.remarks}
        />

        <FieldError>{errors.remarks?.message}</FieldError>
      </Field>
    </div>
  );
}
