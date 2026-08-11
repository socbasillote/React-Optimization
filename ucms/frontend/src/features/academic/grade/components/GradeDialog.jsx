import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import GradeForm from "./GradeForm";

import { gradeSchema, defaultGradeValues } from "../schemas/gradeSchema";

import {
  useCreateGradeMutation,
  useUpdateGradeMutation,
} from "../api/gradeApi";

import useGradeEnrollmentOptions from "@/hooks/lookups/useGradeEnrollmentOptions";

export default function GradeDialog({ open, onOpenChange, grade = null }) {
  const isEdit = Boolean(grade);

  const { options: enrollmentOptions, isLoading: enrollmentLoading } =
    useGradeEnrollmentOptions();

  const [createGrade, { isLoading: isCreating }] = useCreateGradeMutation();

  const [updateGrade, { isLoading: isUpdating }] = useUpdateGradeMutation();

  const form = useForm({
    resolver: zodResolver(gradeSchema),
    defaultValues: defaultGradeValues,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (grade) {
      reset({
        enrollment:
          typeof grade.enrollment === "object"
            ? grade.enrollment?._id
            : (grade.enrollment ?? ""),

        prelim: grade.prelim ?? undefined,

        midterm: grade.midterm ?? undefined,

        final: grade.final ?? undefined,

        finalGrade: grade.finalGrade ?? undefined,

        remarks: grade.remarks ?? undefined,
      });

      return;
    }

    reset(defaultGradeValues);
  }, [grade, open, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateGrade({
          id: grade._id,
          ...values,
        }).unwrap();
      } else {
        await createGrade(values).unwrap();
      }

      reset(defaultGradeValues);
      onOpenChange(false);
    } catch (error) {
      const message = error?.data?.message;

      if (message) {
        form.setError("root", {
          message,
        });
      }
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Grade" : "Record Grade"}</DialogTitle>

          <DialogDescription>
            {isEdit
              ? "Update the student's grade information."
              : "Record grades for an enrolled student."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <GradeForm
            register={register}
            control={control}
            errors={errors}
            enrollmentOptions={enrollmentOptions}
            enrollmentLoading={enrollmentLoading}
            isEdit={isEdit}
          />

          {errors.root?.message && (
            <p className="text-sm text-destructive">{errors.root.message}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Update Grade"
                  : "Record Grade"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
