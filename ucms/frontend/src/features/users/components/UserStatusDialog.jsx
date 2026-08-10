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

import { userStatusSchema } from "../schemas/userSchema";

import { useUpdateUserStatusMutation } from "../api/userApi";

import { getErrorMessage } from "@/lib/getErrorMessage";

const defaultValues = {
  status: "ACTIVE",
};

export default function UserStatusDialog({ open, onOpenChange, user = null }) {
  const [updateUserStatus, { isLoading }] = useUpdateUserStatusMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userStatusSchema),
    defaultValues,
  });

  useEffect(() => {
    if (user) {
      reset({
        status: user.status ?? "ACTIVE",
      });
    } else {
      reset(defaultValues);
    }
  }, [user, reset]);

  const onSubmit = async (values) => {
    if (!user) return;

    try {
      await updateUserStatus({
        id: user._id,
        status: values.status,
      }).unwrap();

      toast.success("User status updated successfully.");

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
      title="Update User Status"
      description="Update the status of this user."
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
        <FieldLabel>Status</FieldLabel>

        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>

                <SelectItem value="INACTIVE">Inactive</SelectItem>

                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <FieldError>{errors.status?.message}</FieldError>
      </Field>
    </FormDialog>
  );
}
