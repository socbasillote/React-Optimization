import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormDialog from "@/components/common/FormDialog";

import CurriculumForm from "./CurriculumForm";

import { curriculumSchema } from "../schemas/curriculumSchema";

import {
  useCreateCurriculumMutation,
  useUpdateCurriculumMutation,
} from "../api/curriculumApi";

import { getErrorMessage } from "@/lib/getErrorMessage";

const defaultValues = {
  program: "",
  name: "",
  description: "",
  status: "ACTIVE",
};

export default function CurriculumDialog({
  open,
  onOpenChange,
  curriculum = null,
}) {
  const isEdit = !!curriculum;

  const [createCurriculum, { isLoading: creating }] =
    useCreateCurriculumMutation();

  const [updateCurriculum, { isLoading: updating }] =
    useUpdateCurriculumMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(curriculumSchema),
    defaultValues,
  });

  useEffect(() => {
    if (curriculum) {
      reset({
        program: curriculum.program?._id ?? curriculum.program ?? "",

        name: curriculum.name ?? "",

        description: curriculum.description ?? "",

        status: curriculum.status ?? "ACTIVE",
      });
    } else {
      reset(defaultValues);
    }
  }, [curriculum, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateCurriculum({
          id: curriculum._id,
          ...values,
        }).unwrap();

        toast.success("Curriculum updated successfully.");
      } else {
        await createCurriculum(values).unwrap();

        toast.success("Curriculum created successfully.");
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
      title={isEdit ? "Edit Curriculum" : "New Curriculum"}
      description="Enter the curriculum information."
      submitLabel={isEdit ? "Update" : "Create"}
      loading={creating || updating}
      onSubmit={handleSubmit(onSubmit)}
    >
      <CurriculumForm register={register} control={control} errors={errors} />
    </FormDialog>
  );
}
