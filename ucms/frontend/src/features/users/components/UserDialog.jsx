import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormDialog from "@/components/common/FormDialog";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { userRoleSchema } from "../schemas/userSchema";

import { useUpdateUserRoleMutation } from "../api/userApi";

import { getErrorMessage } from "@/lib/getErrorMessage";

const defaultValues = {
  role: "STUDENT",
};

export default function UserDialog({ open, onOpenChange, user = null }) {
  const [updateUserRole, { isLoading }] = useUpdateUserRoleMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userRoleSchema),
    defaultValues,
  });

  useEffect(() => {
    if (user) {
      reset({
        role: user.role ?? "STUDENT",
      });
    } else {
      reset(defaultValues);
    }
  }, [user, reset]);

  const onSubmit = async (values) => {
    if (!user) return;

    try {
      await updateUserRole({
        id: user._id,
        role: values.role,
      }).unwrap();

      toast.success("User role updated successfully.");

      onOpenChange(false);
      reset(defaultValues);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit User Role"
      description="Update the role assigned to this user."
      submitLabel="Update"
      loading={isLoading}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Field>
        <FieldLabel>User</FieldLabel>

        <div className="rounded-md border px-3 py-2 text-sm">
          {user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "—"}
        </div>
      </Field>

      <Field>
        <FieldLabel>Role</FieldLabel>

        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>

                <SelectItem value="FACULTY">Faculty</SelectItem>

                <SelectItem value="STUDENT">Student</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <FieldError>{errors.role?.message}</FieldError>
      </Field>
    </FormDialog>
  );
}
