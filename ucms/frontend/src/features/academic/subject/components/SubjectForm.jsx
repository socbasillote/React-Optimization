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

export default function SubjectForm({ register, control, errors }) {
  return (
    <div className="space-y-5">
      <Field>
        <FieldLabel>Code</FieldLabel>

        <Input
          {...register("code")}
          placeholder="CS101"
          aria-invalid={!!errors.code}
        />

        <FieldError>{errors.code?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Title</FieldLabel>

        <Input
          {...register("title")}
          placeholder="Introduction to Computing"
          aria-invalid={!!errors.title}
        />

        <FieldError>{errors.title?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Description</FieldLabel>

        <Input
          {...register("description")}
          aria-invalid={!!errors.description}
        />

        <FieldError>{errors.description?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Units</FieldLabel>

        <Input
          type="number"
          min="1"
          step="1"
          {...register("units", {
            valueAsNumber: true,
          })}
          aria-invalid={!!errors.units}
        />

        <FieldError>{errors.units?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Lecture Hours</FieldLabel>

        <Input
          type="number"
          min="0"
          step="1"
          {...register("lectureHours", {
            valueAsNumber: true,
          })}
          aria-invalid={!!errors.lectureHours}
        />

        <FieldError>{errors.lectureHours?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Laboratory Hours</FieldLabel>

        <Input
          type="number"
          min="0"
          step="1"
          {...register("laboratoryHours", {
            valueAsNumber: true,
          })}
          aria-invalid={!!errors.laboratoryHours}
        />

        <FieldError>{errors.laboratoryHours?.message}</FieldError>
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
