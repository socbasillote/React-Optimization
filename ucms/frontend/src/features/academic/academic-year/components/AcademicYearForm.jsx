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

export default function AcademicYearForm({ register, control, errors }) {
  return (
    <div className="space-y-5">
      <Field>
        <FieldLabel>Academic Year</FieldLabel>

        <Input
          placeholder="2026-2027"
          {...register("name")}
          aria-invalid={!!errors.name}
        />

        <FieldError>{errors.name?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Start Date</FieldLabel>

        <Input
          type="date"
          {...register("startDate")}
          aria-invalid={!!errors.startDate}
        />

        <FieldError>{errors.startDate?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>End Date</FieldLabel>

        <Input
          type="date"
          {...register("endDate")}
          aria-invalid={!!errors.endDate}
        />

        <FieldError>{errors.endDate?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Current Academic Year</FieldLabel>

        <Controller
          control={control}
          name="isCurrent"
          render={({ field }) => (
            <Select
              value={field.value ? "true" : "false"}
              onValueChange={(value) => field.onChange(value === "true")}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>

                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <FieldError>{errors.isCurrent?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Status</FieldLabel>

        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>

                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {errors.status && <FieldError>{errors.status.message}</FieldError>}
      </Field>
    </div>
  );
}
