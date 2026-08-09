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

import useCollegeOptions from "@/hooks/lookups/useCollegeOptions";

export default function DepartmentForm({ register, control, errors }) {
  const { options: colleges, isLoading } = useCollegeOptions();

  return (
    <div className="space-y-5">
      <Field>
        <FieldLabel>College</FieldLabel>

        <Controller
          control={control}
          name="college"
          render={({ field }) => (
            <Select
              items={colleges}
              value={field.value}
              onValueChange={field.onChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select college" />
              </SelectTrigger>

              <SelectContent>
                {colleges.map((college) => (
                  <SelectItem key={college.value} value={college.value}>
                    {college.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.college && <FieldError>{errors.college.message}</FieldError>}
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
