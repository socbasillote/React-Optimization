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

import useCampusOptions from "@/hooks/lookups/useCampusOptions";

export default function CollegeForm({ register, control, errors }) {
  const { options: campuses, isLoading } = useCampusOptions();

  return (
    <div className="space-y-5">
      <Field>
        <FieldLabel>Campus</FieldLabel>

        <Controller
          control={control}
          name="campus"
          render={({ field }) => (
            <Select
              items={campuses}
              value={field.value}
              onValueChange={field.onChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select campus" />
              </SelectTrigger>

              <SelectContent>
                {campuses.map((campus) => (
                  <SelectItem key={campus.value} value={campus.value}>
                    {campus.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.campus && <FieldError>{errors.campus.message}</FieldError>}
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
