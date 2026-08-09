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

import useDepartmentOptions from "@/hooks/lookups/useDepartmentOptions";

const degreeTypes = [
  {
    value: "CERTIFICATE",
    label: "Certificate",
  },
  {
    value: "DIPLOMA",
    label: "Diploma",
  },
  {
    value: "ASSOCIATE",
    label: "Associate",
  },
  {
    value: "BACHELOR",
    label: "Bachelor",
  },
  {
    value: "MASTER",
    label: "Master",
  },
  {
    value: "DOCTORATE",
    label: "Doctorate",
  },
];

export default function ProgramForm({ register, control, errors }) {
  const { options: departments, isLoading } = useDepartmentOptions();

  return (
    <div className="space-y-5">
      <Field>
        <FieldLabel>Department</FieldLabel>

        <Controller
          control={control}
          name="department"
          render={({ field }) => (
            <Select
              items={departments}
              value={field.value}
              onValueChange={field.onChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>

              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department.value} value={department.value}>
                    {department.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.department && (
          <FieldError>{errors.department.message}</FieldError>
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
        <FieldLabel>Description</FieldLabel>

        <Input {...register("description")} />

        <FieldError>{errors.description?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Degree Type</FieldLabel>

        <Controller
          control={control}
          name="degreeType"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select degree type" />
              </SelectTrigger>

              <SelectContent>
                {degreeTypes.map((degree) => (
                  <SelectItem key={degree.value} value={degree.value}>
                    {degree.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.degreeType && (
          <FieldError>{errors.degreeType.message}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel>Duration (Years)</FieldLabel>

        <Input
          type="number"
          min="1"
          max="10"
          {...register("durationYears", {
            valueAsNumber: true,
          })}
          aria-invalid={!!errors.durationYears}
        />

        <FieldError>{errors.durationYears?.message}</FieldError>
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
