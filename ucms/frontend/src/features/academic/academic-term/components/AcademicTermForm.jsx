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

import useAcademicYearOptions from "@/hooks/lookups/useAcademicYearOptions";

export default function AcademicTermForm({ register, control, errors }) {
  const { options: academicYears, isLoading } = useAcademicYearOptions();

  return (
    <div className="space-y-5">
      <Field>
        <FieldLabel>Academic Year</FieldLabel>

        <Controller
          control={control}
          name="academicYear"
          render={({ field }) => (
            <Select
              items={academicYears}
              value={field.value}
              onValueChange={field.onChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select academic year" />
              </SelectTrigger>

              <SelectContent>
                {academicYears.map((academicYear) => (
                  <SelectItem
                    key={academicYear.value}
                    value={academicYear.value}
                  >
                    {academicYear.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.academicYear && (
          <FieldError>{errors.academicYear.message}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel>Name</FieldLabel>

        <Input {...register("name")} aria-invalid={!!errors.name} />

        <FieldError>{errors.name?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Code</FieldLabel>

        <Input {...register("code")} aria-invalid={!!errors.code} />

        <FieldError>{errors.code?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Sequence</FieldLabel>

        <Input
          type="number"
          min="1"
          {...register("sequence", {
            valueAsNumber: true,
          })}
          aria-invalid={!!errors.sequence}
        />

        <FieldError>{errors.sequence?.message}</FieldError>
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
        <FieldLabel>Current Term</FieldLabel>

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

        {errors.isCurrent && (
          <FieldError>{errors.isCurrent.message}</FieldError>
        )}
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
