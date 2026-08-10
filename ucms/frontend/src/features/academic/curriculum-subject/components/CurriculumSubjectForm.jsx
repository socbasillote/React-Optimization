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

import useCurriculumOptions from "@/hooks/lookups/useCurriculumOptions";
import useSubjectOptions from "@/hooks/lookups/useSubjectOptions";

export default function CurriculumSubjectForm({ register, control, errors }) {
  const { options: curricula, isLoading: curriculaLoading } =
    useCurriculumOptions();

  const { options: subjects, isLoading: subjectsLoading } = useSubjectOptions();

  return (
    <div className="space-y-5">
      <Field>
        <FieldLabel>Curriculum</FieldLabel>

        <Controller
          control={control}
          name="curriculum"
          render={({ field }) => (
            <Select
              items={curricula}
              value={field.value}
              onValueChange={field.onChange}
              disabled={curriculaLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select curriculum" />
              </SelectTrigger>

              <SelectContent>
                {curricula.map((curriculum) => (
                  <SelectItem key={curriculum.value} value={curriculum.value}>
                    {curriculum.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.curriculum && (
          <FieldError>{errors.curriculum.message}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel>Subject</FieldLabel>

        <Controller
          control={control}
          name="subject"
          render={({ field }) => (
            <Select
              items={subjects}
              value={field.value}
              onValueChange={field.onChange}
              disabled={subjectsLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>

              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.subject && <FieldError>{errors.subject.message}</FieldError>}
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Year Level</FieldLabel>

          <Input
            type="number"
            min="1"
            step="1"
            {...register("yearLevel", {
              valueAsNumber: true,
            })}
            aria-invalid={!!errors.yearLevel}
          />

          <FieldError>{errors.yearLevel?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Term</FieldLabel>

          <Input
            type="number"
            min="1"
            step="1"
            {...register("term", {
              valueAsNumber: true,
            })}
            aria-invalid={!!errors.term}
          />

          <FieldError>{errors.term?.message}</FieldError>
        </Field>
      </div>

      <Field>
        <FieldLabel>Prerequisite</FieldLabel>

        <Controller
          control={control}
          name="prerequisite"
          render={({ field }) => (
            <Select
              items={subjects}
              value={field.value ?? ""}
              onValueChange={(value) => field.onChange(value || null)}
              disabled={subjectsLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="No prerequisite" />
              </SelectTrigger>

              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.prerequisite && (
          <FieldError>{errors.prerequisite.message}</FieldError>
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
