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

import useFacultyUserOptions from "@/hooks/lookups/useFacultyUserOptions";
import useDepartmentOptions from "@/hooks/lookups/useDepartmentOptions";

export default function FacultyForm({ register, control, errors }) {
  const { options: facultyUsers, isLoading: usersLoading } =
    useFacultyUserOptions();

  const { options: departments, isLoading: departmentsLoading } =
    useDepartmentOptions();

  return (
    <div className="space-y-5">
      <Field>
        <FieldLabel>Faculty User</FieldLabel>

        <Controller
          control={control}
          name="user"
          render={({ field }) => (
            <Select
              items={facultyUsers}
              value={field.value}
              onValueChange={field.onChange}
              disabled={usersLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select faculty user" />
              </SelectTrigger>

              <SelectContent>
                {facultyUsers.map((user) => (
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
        <FieldLabel>Employee ID</FieldLabel>

        <Input {...register("employeeId")} aria-invalid={!!errors.employeeId} />

        <FieldError>{errors.employeeId?.message}</FieldError>
      </Field>

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
              disabled={departmentsLoading}
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

        <FieldError>{errors.department?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Position</FieldLabel>

        <Input {...register("position")} aria-invalid={!!errors.position} />

        <FieldError>{errors.position?.message}</FieldError>
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
