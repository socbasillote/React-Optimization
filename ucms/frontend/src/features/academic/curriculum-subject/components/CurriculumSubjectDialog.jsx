import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormDialog from "@/components/common/FormDialog";

import CurriculumSubjectForm from "./CurriculumSubjectForm";

import { curriculumSubjectSchema } from "../schemas/curriculumSubjectSchema";

import {
  useCreateCurriculumSubjectMutation,
  useUpdateCurriculumSubjectMutation,
} from "../api/curriculumSubjectApi";

import { getErrorMessage } from "@/lib/getErrorMessage";

const defaultValues = {
  curriculum: "",
  subject: "",
  yearLevel: 1,
  term: 1,
  prerequisite: null,
  status: "ACTIVE",
};

export default function CurriculumSubjectDialog({
  open,
  onOpenChange,
  curriculumSubject = null,
}) {
  const isEdit = !!curriculumSubject;

  const [createCurriculumSubject, { isLoading: creating }] =
    useCreateCurriculumSubjectMutation();

  const [updateCurriculumSubject, { isLoading: updating }] =
    useUpdateCurriculumSubjectMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(curriculumSubjectSchema),
    defaultValues,
  });

  useEffect(() => {
    if (curriculumSubject) {
      reset({
        curriculum:
          curriculumSubject.curriculum?._id ??
          curriculumSubject.curriculum ??
          "",

        subject:
          curriculumSubject.subject?._id ?? curriculumSubject.subject ?? "",

        yearLevel: curriculumSubject.yearLevel ?? 1,

        term: curriculumSubject.term ?? 1,

        prerequisite:
          curriculumSubject.prerequisite?._id ??
          curriculumSubject.prerequisite ??
          null,

        status: curriculumSubject.status ?? "ACTIVE",
      });
    } else {
      reset(defaultValues);
    }
  }, [curriculumSubject, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateCurriculumSubject({
          id: curriculumSubject._id,
          ...values,
        }).unwrap();

        toast.success("Curriculum subject updated successfully.");
      } else {
        await createCurriculumSubject(values).unwrap();

        toast.success("Curriculum subject created successfully.");
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
      title={isEdit ? "Edit Curriculum Subject" : "New Curriculum Subject"}
      description="Assign a subject to a curriculum."
      submitLabel={isEdit ? "Update" : "Create"}
      loading={creating || updating}
      onSubmit={handleSubmit(onSubmit)}
    >
      <CurriculumSubjectForm
        register={register}
        control={control}
        errors={errors}
      />
    </FormDialog>
  );
}
