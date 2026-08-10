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

import useProgramOptions from "@/hooks/lookups/useProgramOptions";

export default function CurriculumForm({ register, control, errors }) {
  const { options: programs, isLoading } = useProgramOptions();

  return (
    <div className="space-y-5">
      <Field>
        <FieldLabel>Program</FieldLabel>

        <Controller
          control={control}
          name="program"
          render={({ field }) => (
            <Select
              items={programs}
              value={field.value}
              onValueChange={field.onChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select program" />
              </SelectTrigger>

              <SelectContent>
                {programs.map((program) => (
                  <SelectItem key={program.value} value={program.value}>
                    {program.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.program && <FieldError>{errors.program.message}</FieldError>}
      </Field>

      <Field>
        <FieldLabel>Name</FieldLabel>

        <Input {...register("name")} aria-invalid={!!errors.name} />

        <FieldError>{errors.name?.message}</FieldError>
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
