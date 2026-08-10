import { Controller } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useStudentOptions from "@/hooks/lookups/useStudentOptions";
import useCourseOfferingOptions from "@/hooks/lookups/useCourseOfferingOptions";

export default function EnrollmentForm({ control, errors }) {
  const { options: students, isLoading: studentsLoading } = useStudentOptions();

  const { options: courseOfferings, isLoading: courseOfferingsLoading } =
    useCourseOfferingOptions();

  return (
    <div className="grid gap-5">
      <Field>
        <FieldLabel>Student</FieldLabel>

        <Controller
          control={control}
          name="student"
          render={({ field }) => (
            <Select
              items={students}
              value={field.value}
              onValueChange={field.onChange}
              disabled={studentsLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select student" />
              </SelectTrigger>

              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.value} value={student.value}>
                    {student.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <FieldError>{errors.student?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Course Offering</FieldLabel>

        <Controller
          control={control}
          name="courseOffering"
          render={({ field }) => (
            <Select
              items={courseOfferings}
              value={field.value}
              onValueChange={field.onChange}
              disabled={courseOfferingsLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select course offering" />
              </SelectTrigger>

              <SelectContent>
                {courseOfferings.map((offering) => (
                  <SelectItem key={offering.value} value={offering.value}>
                    {offering.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <FieldError>{errors.courseOffering?.message}</FieldError>
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
                <SelectItem value="ENROLLED">Enrolled</SelectItem>

                <SelectItem value="DROPPED">Dropped</SelectItem>

                <SelectItem value="COMPLETED">Completed</SelectItem>

                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <FieldError>{errors.status?.message}</FieldError>
      </Field>
    </div>
  );
}
