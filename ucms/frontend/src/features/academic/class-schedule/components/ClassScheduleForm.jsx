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

export default function ClassScheduleForm({
  register,
  control,
  errors,
  courseOfferings,
  courseOfferingLoading,
}) {
  return (
    <div className="w-full min-w-0 space-y-5">
      <Field className="w-full min-w-0">
        <FieldLabel>Course Offering</FieldLabel>

        <Controller
          control={control}
          name="courseOffering"
          render={({ field }) => (
            <Select
              items={courseOfferings}
              value={field.value}
              onValueChange={field.onChange}
              disabled={courseOfferingLoading}
            >
              <SelectTrigger className="w-full min-w-0 max-w-full">
                <SelectValue placeholder="Select course offering" />
              </SelectTrigger>

              <SelectContent>
                {courseOfferings.map((courseOffering) => (
                  <SelectItem
                    key={courseOffering.value}
                    value={courseOffering.value}
                  >
                    {courseOffering.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <FieldError>{errors.courseOffering?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Day</FieldLabel>

        <Controller
          control={control}
          name="day"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="MONDAY">Monday</SelectItem>
                <SelectItem value="TUESDAY">Tuesday</SelectItem>
                <SelectItem value="WEDNESDAY">Wednesday</SelectItem>
                <SelectItem value="THURSDAY">Thursday</SelectItem>
                <SelectItem value="FRIDAY">Friday</SelectItem>
                <SelectItem value="SATURDAY">Saturday</SelectItem>
                <SelectItem value="SUNDAY">Sunday</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <FieldError>{errors.day?.message}</FieldError>
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel>Start Time</FieldLabel>

          <Input
            type="time"
            {...register("startTime")}
            aria-invalid={!!errors.startTime}
          />

          <FieldError>{errors.startTime?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>End Time</FieldLabel>

          <Input
            type="time"
            {...register("endTime")}
            aria-invalid={!!errors.endTime}
          />

          <FieldError>{errors.endTime?.message}</FieldError>
        </Field>
      </div>

      <Field>
        <FieldLabel>Room</FieldLabel>

        <Input
          placeholder="e.g. Room 201"
          {...register("room")}
          aria-invalid={!!errors.room}
        />

        <FieldError>{errors.room?.message}</FieldError>
      </Field>
    </div>
  );
}
