import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormDialog from "@/components/common/FormDialog";

import EnrollmentForm from "./EnrollmentForm";

import { enrollmentSchema } from "../schemas/enrollmentSchema";

import {
  useCreateEnrollmentMutation,
  useUpdateEnrollmentMutation,
} from "../api/enrollmentApi";

import { getErrorMessage } from "@/lib/getErrorMessage";

const defaultValues = {
  student: "",
  courseOffering: "",
  status: "ENROLLED",
};

export default function EnrollmentDialog({
  open,
  onOpenChange,
  enrollment = null,
}) {
  const isEdit = !!enrollment;

  const [createEnrollment, { isLoading: creating }] =
    useCreateEnrollmentMutation();

  const [updateEnrollment, { isLoading: updating }] =
    useUpdateEnrollmentMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(enrollmentSchema),
    defaultValues,
  });

  useEffect(() => {
    if (enrollment) {
      reset({
        student: enrollment.student?._id ?? enrollment.student ?? "",

        courseOffering:
          enrollment.courseOffering?._id ?? enrollment.courseOffering ?? "",

        status: enrollment.status ?? "ENROLLED",
      });
    } else {
      reset(defaultValues);
    }
  }, [enrollment, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateEnrollment({
          id: enrollment._id,
          ...values,
        }).unwrap();

        toast.success("Enrollment updated successfully.");
      } else {
        await createEnrollment(values).unwrap();

        toast.success("Enrollment created successfully.");
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
      title={isEdit ? "Edit Enrollment" : "New Enrollment"}
      description="Enter the enrollment information."
      submitLabel={isEdit ? "Update" : "Create"}
      loading={creating || updating}
      onSubmit={handleSubmit(onSubmit)}
    >
      <EnrollmentForm control={control} errors={errors} />
    </FormDialog>
  );
}
