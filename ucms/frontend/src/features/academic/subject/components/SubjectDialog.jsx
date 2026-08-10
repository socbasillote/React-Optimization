import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormDialog from "@/components/common/FormDialog";

import SubjectForm from "./SubjectForm";

import { subjectSchema } from "../schemas/subjectSchema";

import {
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
} from "../api/subjectApi";

import { getErrorMessage } from "@/lib/getErrorMessage";

const defaultValues = {
  code: "",
  title: "",
  description: "",
  units: 1,
  lectureHours: 0,
  laboratoryHours: 0,
  status: "ACTIVE",
};

export default function SubjectDialog({ open, onOpenChange, subject = null }) {
  const isEdit = !!subject;

  const [createSubject, { isLoading: creating }] = useCreateSubjectMutation();

  const [updateSubject, { isLoading: updating }] = useUpdateSubjectMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subjectSchema),
    defaultValues,
  });

  useEffect(() => {
    if (subject) {
      reset({
        code: subject.code ?? "",
        title: subject.title ?? "",
        description: subject.description ?? "",
        units: subject.units ?? 1,
        lectureHours: subject.lectureHours ?? 0,
        laboratoryHours: subject.laboratoryHours ?? 0,
        status: subject.status ?? "ACTIVE",
      });
    } else {
      reset(defaultValues);
    }
  }, [subject, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateSubject({
          id: subject._id,
          ...values,
        }).unwrap();

        toast.success("Subject updated successfully.");
      } else {
        await createSubject(values).unwrap();

        toast.success("Subject created successfully.");
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
      title={isEdit ? "Edit Subject" : "New Subject"}
      description="Enter the subject information."
      submitLabel={isEdit ? "Update" : "Create"}
      loading={creating || updating}
      onSubmit={handleSubmit(onSubmit)}
    >
      <SubjectForm register={register} control={control} errors={errors} />
    </FormDialog>
  );
}
