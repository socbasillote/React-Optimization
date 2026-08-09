import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormDialog from "@/components/common/FormDialog";

import AcademicTermForm from "./AcademicTermForm";

import { academicTermSchema } from "../schemas/academicTermSchema";

import {
  useCreateAcademicTermMutation,
  useUpdateAcademicTermMutation,
} from "../api/academicTermApi";

import { getErrorMessage } from "@/lib/getErrorMessage";

const defaultValues = {
  academicYear: "",
  name: "",
  code: "",
  sequence: 1,
  startDate: "",
  endDate: "",
  isCurrent: false,
  status: "ACTIVE",
};

const formatDateForInput = (date) => {
  if (!date) return "";

  return new Date(date).toISOString().split("T")[0];
};

export default function AcademicTermDialog({
  open,
  onOpenChange,
  academicTerm = null,
}) {
  const isEdit = !!academicTerm;

  const [createAcademicTerm, { isLoading: creating }] =
    useCreateAcademicTermMutation();

  const [updateAcademicTerm, { isLoading: updating }] =
    useUpdateAcademicTermMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(academicTermSchema),
    defaultValues,
  });

  useEffect(() => {
    if (academicTerm) {
      reset({
        academicYear:
          academicTerm.academicYear?._id ?? academicTerm.academicYear ?? "",

        name: academicTerm.name ?? "",
        code: academicTerm.code ?? "",

        sequence: academicTerm.sequence ?? 1,

        startDate: formatDateForInput(academicTerm.startDate),

        endDate: formatDateForInput(academicTerm.endDate),

        isCurrent: academicTerm.isCurrent ?? false,

        status: academicTerm.status ?? "ACTIVE",
      });
    } else {
      reset(defaultValues);
    }
  }, [academicTerm, reset]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,

        startDate: new Date(values.startDate).toISOString(),

        endDate: new Date(values.endDate).toISOString(),
      };

      if (isEdit) {
        await updateAcademicTerm({
          id: academicTerm._id,
          ...payload,
        }).unwrap();

        toast.success("Academic term updated successfully.");
      } else {
        await createAcademicTerm(payload).unwrap();

        toast.success("Academic term created successfully.");
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
      title={isEdit ? "Edit Academic Term" : "New Academic Term"}
      description="Enter the academic term information."
      submitLabel={isEdit ? "Update" : "Create"}
      loading={creating || updating}
      onSubmit={handleSubmit(onSubmit)}
    >
      <AcademicTermForm register={register} control={control} errors={errors} />
    </FormDialog>
  );
}
