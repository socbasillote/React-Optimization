import { Controller } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AssignmentForm({
  register,
  control,
  errors,
  courseOfferingOptions = [],
  courseOfferingLoading = false,
}) {
  return (
    <div className="grid gap-4">
      <Field>
        <FieldLabel>Course Offering</FieldLabel>

        <Controller
          control={control}
          name="courseOffering"
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={field.onChange}
              items={courseOfferingOptions}
              disabled={courseOfferingLoading}
            >
              <SelectTrigger
                className="w-full min-w-0"
                aria-invalid={!!errors.courseOffering}
              >
                <SelectValue placeholder="Select course offering" />
              </SelectTrigger>

              <SelectContent>
                {courseOfferingLoading ? (
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    Loading course offerings...
                  </div>
                ) : courseOfferingOptions.length === 0 ? (
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    No course offerings available.
                  </div>
                ) : (
                  courseOfferingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />

        <FieldError>{errors.courseOffering?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Title</FieldLabel>

        <Input
          placeholder="Assignment 1"
          {...register("title")}
          aria-invalid={!!errors.title}
        />

        <FieldError>{errors.title?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Description</FieldLabel>

        <Textarea
          placeholder="Describe the assignment..."
          rows={4}
          {...register("description")}
          aria-invalid={!!errors.description}
        />

        <FieldError>{errors.description?.message}</FieldError>
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>Available From</FieldLabel>

          <Input
            type="datetime-local"
            {...register("availableFrom")}
            aria-invalid={!!errors.availableFrom}
          />

          <FieldError>{errors.availableFrom?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Due Date</FieldLabel>

          <Input
            type="datetime-local"
            {...register("dueDate")}
            aria-invalid={!!errors.dueDate}
          />

          <FieldError>{errors.dueDate?.message}</FieldError>
        </Field>
      </div>

      <Field>
        <FieldLabel>Maximum Score</FieldLabel>

        <Input
          type="number"
          min="1"
          step="0.01"
          placeholder="100"
          {...register("maxScore", {
            setValueAs: (value) => (value === "" ? undefined : Number(value)),
          })}
          aria-invalid={!!errors.maxScore}
        />

        <FieldError>{errors.maxScore?.message}</FieldError>
      </Field>
    </div>
  );
}
