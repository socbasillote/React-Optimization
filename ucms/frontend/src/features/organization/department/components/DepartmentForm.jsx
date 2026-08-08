import { Controller } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import LookupSelect from "@/components/common/LookupSelect";

import useCollegeOptions from "@/hooks/lookups/useCollegeOptions";

export default function DepartmentForm({ register, control, errors }) {
  const { options: colleges, isLoading: collegesLoading } = useCollegeOptions();

  return (
    <div className="space-y-5">
      <Field>
        <FieldLabel>College</FieldLabel>

        <Controller
          control={control}
          name="college"
          render={({ field }) => (
            <LookupSelect
              value={field.value}
              onChange={field.onChange}
              options={colleges}
              loading={collegesLoading}
              placeholder="Select college"
            />
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
            <LookupSelect
              value={field.value}
              onChange={field.onChange}
              options={[
                {
                  value: "ACTIVE",
                  label: "Active",
                },
                {
                  value: "INACTIVE",
                  label: "Inactive",
                },
              ]}
            />
          )}
        />

        <FieldError>{errors.status?.message}</FieldError>
      </Field>
    </div>
  );
}
