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

import useStudentUserOptions from "@/hooks/lookups/useStudentUserOptions";
import useProgramOptions from "@/hooks/lookups/useProgramOptions";
import useCurriculumOptions from "@/hooks/lookups/useCurriculumOptions";
import useSectionOptions from "@/hooks/lookups/useSectionOptions";

export default function StudentForm({ register, control, errors }) {
  const { options: users, isLoading: usersLoading } = useStudentUserOptions();

  const { options: programs, isLoading: programsLoading } = useProgramOptions();

  const { options: curricula, isLoading: curriculaLoading } =
    useCurriculumOptions();

  const { options: sections, isLoading: sectionsLoading } = useSectionOptions();

  return (
    <div className="grid gap-5">
      <Field>
        <FieldLabel>User</FieldLabel>

        <Controller
          control={control}
          name="user"
          render={({ field }) => (
            <Select
              items={users}
              value={field.value}
              onValueChange={field.onChange}
              disabled={usersLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select student user" />
              </SelectTrigger>

              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.value} value={user.value}>
                    {user.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <FieldError>{errors.user?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Student Number</FieldLabel>

        <Input
          {...register("studentNumber")}
          aria-invalid={!!errors.studentNumber}
        />

        <FieldError>{errors.studentNumber?.message}</FieldError>
      </Field>

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
              disabled={programsLoading}
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

        <FieldError>{errors.program?.message}</FieldError>
      </Field>

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

        <FieldError>{errors.curriculum?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Section</FieldLabel>

        <Controller
          control={control}
          name="section"
          render={({ field }) => (
            <Select
              items={sections}
              value={field.value}
              onValueChange={field.onChange}
              disabled={sectionsLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select section" />
              </SelectTrigger>

              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.value} value={section.value}>
                    {section.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <FieldError>{errors.section?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Year Level</FieldLabel>

        <Input
          type="number"
          {...register("yearLevel", { valueAsNumber: true })}
          aria-invalid={!!errors.yearLevel}
        />

        <FieldError>{errors.yearLevel?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Admission Date</FieldLabel>

        <Input
          type="date"
          {...register("admissionDate")}
          aria-invalid={!!errors.admissionDate}
        />

        <FieldError>{errors.admissionDate?.message}</FieldError>
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

        <FieldError>{errors.status?.message}</FieldError>
      </Field>
    </div>
  );
}
