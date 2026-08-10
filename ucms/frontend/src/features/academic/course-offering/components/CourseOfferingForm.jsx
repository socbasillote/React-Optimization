import { Controller } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useCurriculumSubjectOptions from "@/hooks/lookups/useCurriculumSubjectOptions";
import useFacultyOptions from "@/hooks/lookups/useFacultyOptions";
import useSectionOptions from "@/hooks/lookups/useSectionOptions";
import useAcademicYearOptions from "@/hooks/lookups/useAcademicYearOptions";
import useAcademicTermOptions from "@/hooks/lookups/useAcademicTermOptions";

export default function CourseOfferingForm({ register, control, errors }) {
  const { options: curriculumSubjects, isLoading: curriculumSubjectsLoading } =
    useCurriculumSubjectOptions();

  const { options: faculties, isLoading: facultiesLoading } =
    useFacultyOptions();

  const { options: sections, isLoading: sectionsLoading } = useSectionOptions();

  const { options: academicYears, isLoading: academicYearsLoading } =
    useAcademicYearOptions();

  const { options: academicTerms, isLoading: academicTermsLoading } =
    useAcademicTermOptions();

  return (
    <div className="space-y-5">
      <Field>
        <FieldLabel>Curriculum Subject</FieldLabel>

        <Controller
          control={control}
          name="curriculumSubject"
          render={({ field }) => (
            <Select
              items={curriculumSubjects}
              value={field.value}
              onValueChange={field.onChange}
              disabled={curriculumSubjectsLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select curriculum subject" />
              </SelectTrigger>

              <SelectContent>
                {curriculumSubjects.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <FieldError>{errors.curriculumSubject?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Faculty</FieldLabel>

        <Controller
          control={control}
          name="faculty"
          render={({ field }) => (
            <Select
              items={faculties}
              value={field.value}
              onValueChange={field.onChange}
              disabled={facultiesLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>

              <SelectContent>
                {faculties.map((faculty) => (
                  <SelectItem key={faculty.value} value={faculty.value}>
                    {faculty.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <FieldError>{errors.faculty?.message}</FieldError>
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
                {academicYears.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <FieldError>{errors.academicYear?.message}</FieldError>
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
              disabled={academicTermsLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select academic term" />
              </SelectTrigger>

              <SelectContent>
                {academicTerms.map((term) => (
                  <SelectItem key={term.value} value={term.value}>
                    {term.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <FieldError>{errors.academicTerm?.message}</FieldError>
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
