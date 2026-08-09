import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormDialog from "@/components/common/FormDialog";

import DepartmentForm from "./DepartmentForm";

import { departmentSchema } from "../schemas/departmentSchema";

import {
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} from "../api/departmentApi";

import { getErrorMessage } from "@/lib/getErrorMessage";

const defaultValues = {
  college: "",
  name: "",
  code: "",
  description: "",
  status: "ACTIVE",
};

export default function DepartmentDialog({
  open,
  onOpenChange,
  department = null,
}) {
  const isEdit = !!department;

  const [createDepartment, { isLoading: creating }] =
    useCreateDepartmentMutation();

  const [updateDepartment, { isLoading: updating }] =
    useUpdateDepartmentMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(departmentSchema),
    defaultValues,
  });

  useEffect(() => {
    if (department) {
      reset({
        college: department.college?._id ?? department.college ?? "",
        name: department.name ?? "",
        code: department.code ?? "",
        description: department.description ?? "",
        status: department.status ?? "ACTIVE",
      });
    } else {
      reset(defaultValues);
    }
  }, [department, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateDepartment({
          id: department._id,
          ...values,
        }).unwrap();

        toast.success("Department updated successfully.");
      } else {
        await createDepartment(values).unwrap();

        toast.success("Department created successfully.");
      }

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
      title={isEdit ? "Edit Department" : "New Department"}
      description="Enter the department information."
      submitLabel={isEdit ? "Update" : "Create"}
      loading={creating || updating}
      onSubmit={handleSubmit(onSubmit)}
    >
      <DepartmentForm register={register} control={control} errors={errors} />
    </FormDialog>
  );
}
