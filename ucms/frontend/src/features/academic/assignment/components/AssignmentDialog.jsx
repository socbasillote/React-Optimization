import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import AssignmentForm from "./AssignmentForm";

import {
  assignmentSchema,
  defaultAssignmentValues,
} from "../schemas/assignmentSchema";

import {
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
} from "../api/assignmentApi";

import useCourseOfferingOptions from "@/hooks/lookups/useCourseOfferingOptions";

import { toDateTimeLocal, toISOString } from "../utils/assignmentDate";

export default function AssignmentDialog({
  open,
  onOpenChange,
  assignment = null,
}) {
  const isEdit = Boolean(assignment);

  const { options: courseOfferingOptions, isLoading: courseOfferingLoading } =
    useCourseOfferingOptions();

  const [createAssignment, { isLoading: isCreating }] =
    useCreateAssignmentMutation();

  const [updateAssignment, { isLoading: isUpdating }] =
    useUpdateAssignmentMutation();

  const form = useForm({
    resolver: zodResolver(assignmentSchema),
    defaultValues: defaultAssignmentValues,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (assignment) {
      reset({
        courseOffering:
          typeof assignment.courseOffering === "object"
            ? assignment.courseOffering?._id
            : (assignment.courseOffering ?? ""),

        title: assignment.title ?? "",

        description: assignment.description ?? "",

        availableFrom: toDateTimeLocal(assignment.availableFrom),

        dueDate: toDateTimeLocal(assignment.dueDate),

        maxScore: assignment.maxScore ?? undefined,
      });

      return;
    }

    reset(defaultAssignmentValues);
  }, [assignment, open, reset]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,

        availableFrom: toISOString(values.availableFrom),

        dueDate: toISOString(values.dueDate),
      };

      if (isEdit) {
        await updateAssignment({
          id: assignment._id,
          ...payload,
        }).unwrap();
      } else {
        await createAssignment(payload).unwrap();
      }

      reset(defaultAssignmentValues);

      onOpenChange(false);
    } catch (error) {
      setError("root", {
        message: error?.data?.message ?? "Failed to save assignment.",
      });
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Assignment" : "Create Assignment"}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? "Update the assignment information."
              : "Create an assignment for a course offering."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AssignmentForm
            register={register}
            control={control}
            errors={errors}
            courseOfferingOptions={courseOfferingOptions}
            courseOfferingLoading={courseOfferingLoading}
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
                  ? "Update Assignment"
                  : "Create Assignment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
