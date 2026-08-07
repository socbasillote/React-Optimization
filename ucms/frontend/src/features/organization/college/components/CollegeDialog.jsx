import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormDialog from "@/components/common/FormDialog";

import CollegeForm from "./CollegeForm";

import { collegeSchema } from "../schemas/collegeSchema";

import {
  useCreateCollegeMutation,
  useUpdateCollegeMutation,
} from "../api/collegeApi";

import { getErrorMessage } from "@/lib/getErrorMessage";

const defaultValues = {
  campus: "",
  name: "",
  code: "",
  description: "",
  status: "ACTIVE",
};

export default function CollegeDialog({ open, onOpenChange, college = null }) {
  const isEdit = !!college;

  const [createCollege, { isLoading: creating }] = useCreateCollegeMutation();

  const [updateCollege, { isLoading: updating }] = useUpdateCollegeMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(collegeSchema),
    defaultValues,
  });

  useEffect(() => {
    if (college) {
      reset({
        campus: college.campus?._id ?? college.campus,
        name: college.name,
        code: college.code,
        description: college.description ?? "",
        status: college.status,
      });
    } else {
      reset(defaultValues);
    }
  }, [college, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateCollege({
          id: college._id,
          ...values,
        }).unwrap();

        toast.success("College updated successfully.");
      } else {
        await createCollege(values).unwrap();

        toast.success("College created successfully.");
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
      title={isEdit ? "Edit College" : "New College"}
      description="Enter the college information."
      submitLabel={isEdit ? "Update" : "Create"}
      loading={creating || updating}
      onSubmit={handleSubmit(onSubmit)}
    >
      <CollegeForm register={register} control={control} errors={errors} />
    </FormDialog>
  );
}
