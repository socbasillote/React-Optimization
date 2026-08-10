import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormDialog from "@/components/common/FormDialog";

import SectionForm from "./SectionForm";

import { sectionSchema } from "../schemas/sectionSchema";

import {
  useCreateSectionMutation,
  useUpdateSectionMutation,
} from "../api/sectionApi";

import { getErrorMessage } from "@/lib/getErrorMessage";

const defaultValues = {
  program: "",
  academicYear: "",
  academicTerm: "",
  name: "",
  yearLevel: 1,
  adviser: null,
  status: "ACTIVE",
};

export default function SectionDialog({ open, onOpenChange, section = null }) {
  const isEdit = !!section;

  const [createSection, { isLoading: creating }] = useCreateSectionMutation();

  const [updateSection, { isLoading: updating }] = useUpdateSectionMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sectionSchema),
    defaultValues,
  });

  useEffect(() => {
    if (section) {
      reset({
        program: section.program?._id ?? section.program ?? "",

        academicYear: section.academicYear?._id ?? section.academicYear ?? "",

        academicTerm: section.academicTerm?._id ?? section.academicTerm ?? "",

        name: section.name ?? "",

        yearLevel: section.yearLevel ?? 1,

        adviser: section.adviser?._id ?? section.adviser ?? null,

        status: section.status ?? "ACTIVE",
      });
    } else {
      reset(defaultValues);
    }
  }, [section, reset]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        adviser: values.adviser || undefined,
      };

      if (isEdit) {
        await updateSection({
          id: section._id,
          ...payload,
        }).unwrap();

        toast.success("Section updated successfully.");
      } else {
        await createSection(payload).unwrap();

        toast.success("Section created successfully.");
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
      title={isEdit ? "Edit Section" : "New Section"}
      description="Enter the section information."
      submitLabel={isEdit ? "Update" : "Create"}
      loading={creating || updating}
      onSubmit={handleSubmit(onSubmit)}
    >
      <SectionForm
        register={register}
        control={control}
        errors={errors}
        setValue={setValue}
      />
    </FormDialog>
  );
}
