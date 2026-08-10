import { useEffect } from "react";
import { Controller, useWatch } from "react-hook-form";

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
import useAcademicYearOptions from "@/hooks/lookups/useAcademicYearOptions";
import useAcademicTermOptions from "@/hooks/lookups/useAcademicTermOptions";

export default function SectionForm({ register, control, errors, setValue }) {
  const { options: programs, isLoading: programsLoading } = useProgramOptions();

  const { options: academicYears, isLoading: academicYearsLoading } =
    useAcademicYearOptions();

  const academicYear = useWatch({
    control,
    name: "academicYear",
  });

  const { options: academicTerms, isLoading: academicTermsLoading } =
    useAcademicTermOptions({
      academicYear,
    });

  useEffect(() => {
    if (!academicYear) {
      setValue("academicTerm", "");
    }
  }, [academicYear, setValue]);

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

        {errors.program && <FieldError>{errors.program.message}</FieldError>}
      </Field>

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
              disabled={academicYearsLoading}
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
        <FieldLabel>Academic Term</FieldLabel>

        <Controller
          control={control}
          name="academicTerm"
          render={({ field }) => (
            <Select
              items={academicTerms}
              value={field.value}
              onValueChange={field.onChange}
              disabled={!academicYear || academicTermsLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select academic term" />
              </SelectTrigger>

              <SelectContent>
                {academicTerms.map((academicTerm) => (
                  <SelectItem
                    key={academicTerm.value}
                    value={academicTerm.value}
                  >
                    {academicTerm.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.academicTerm && (
          <FieldError>{errors.academicTerm.message}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel>Section Name</FieldLabel>

        <Input
          {...register("name")}
          placeholder="BSCS 1-A"
          aria-invalid={!!errors.name}
        />

        <FieldError>{errors.name?.message}</FieldError>
      </Field>

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
        <FieldLabel>Adviser</FieldLabel>

        <Input
          disabled
          placeholder="Faculty adviser selection will be connected here"
        />

        <FieldError>{errors.adviser?.message}</FieldError>
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
