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

const remarksOptions = [
  {
    value: "PASSED",
    label: "Passed",
  },
  {
    value: "FAILED",
    label: "Failed",
  },
  {
    value: "INCOMPLETE",
    label: "Incomplete",
  },
];

export default function GradeForm({
  register,
  control,
  errors,
  enrollmentOptions = [],
  enrollmentLoading = false,
  isEdit = false,
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
              disabled={isEdit || enrollmentLoading}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field>
          <FieldLabel>Prelim</FieldLabel>

          <Input
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="0 - 100"
            {...register("prelim", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
            aria-invalid={!!errors.prelim}
          />

          <FieldError>{errors.prelim?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Midterm</FieldLabel>

          <Input
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="0 - 100"
            {...register("midterm", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
            aria-invalid={!!errors.midterm}
          />

          <FieldError>{errors.midterm?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Final</FieldLabel>

          <Input
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="0 - 100"
            {...register("final", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
            aria-invalid={!!errors.final}
          />

          <FieldError>{errors.final?.message}</FieldError>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>Final Grade</FieldLabel>

          <Input
            type="number"
            min="0"
            max="100"
            step="0.01"
            placeholder="0 - 100"
            {...register("finalGrade", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
            aria-invalid={!!errors.finalGrade}
          />

          <FieldError>{errors.finalGrade?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Remarks</FieldLabel>

          <Controller
            control={control}
            name="remarks"
            render={({ field }) => (
              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
                items={remarksOptions}
              >
                <SelectTrigger
                  className="w-full"
                  aria-invalid={!!errors.remarks}
                >
                  <SelectValue placeholder="Select remarks" />
                </SelectTrigger>

                <SelectContent>
                  {remarksOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <FieldError>{errors.remarks?.message}</FieldError>
        </Field>
      </div>
    </div>
  );
}
