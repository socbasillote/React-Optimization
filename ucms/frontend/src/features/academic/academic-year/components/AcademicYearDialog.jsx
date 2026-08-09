import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormDialog from "@/components/common/FormDialog";

import AcademicYearForm from "./AcademicYearForm";

import { academicYearSchema } from "../schemas/academicYearSchema";

import {
  useCreateAcademicYearMutation,
  useUpdateAcademicYearMutation,
} from "../api/academicYearApi";

import { getErrorMessage } from "@/lib/getErrorMessage";

const defaultValues = {
  name: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  status: "ACTIVE",
};

const formatDateForInput = (date) => {
  if (!date) return "";

  return new Date(date).toISOString().split("T")[0];
};

export default function AcademicYearDialog({
  open,
  onOpenChange,
  academicYear = null,
}) {
  const isEdit = !!academicYear;

  const [createAcademicYear, { isLoading: creating }] =
    useCreateAcademicYearMutation();

  const [updateAcademicYear, { isLoading: updating }] =
    useUpdateAcademicYearMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(academicYearSchema),
    defaultValues,
  });

  useEffect(() => {
    if (academicYear) {
      reset({
        name: academicYear.name ?? "",
        startDate: formatDateForInput(academicYear.startDate),
        endDate: formatDateForInput(academicYear.endDate),
        isCurrent: academicYear.isCurrent ?? false,
        status: academicYear.status ?? "ACTIVE",
      });
    } else {
      reset(defaultValues);
    }
  }, [academicYear, reset]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        startDate: new Date(values.startDate).toISOString(),

        endDate: new Date(values.endDate).toISOString(),
      };

      if (isEdit) {
        await updateAcademicYear({
          id: academicYear._id,
          ...payload,
        }).unwrap();

        toast.success("Academic year updated successfully.");
      } else {
        await createAcademicYear(payload).unwrap();

        toast.success("Academic year created successfully.");
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
      title={isEdit ? "Edit Academic Year" : "New Academic Year"}
      description="Enter the academic year information."
      submitLabel={isEdit ? "Update" : "Create"}
      loading={creating || updating}
      onSubmit={handleSubmit(onSubmit)}
    >
      <AcademicYearForm register={register} control={control} errors={errors} />
    </FormDialog>
  );
}
