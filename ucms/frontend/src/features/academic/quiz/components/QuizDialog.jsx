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

import QuizForm from "./QuizForm";

import { quizSchema, defaultQuizValues } from "../schemas/quizSchema";

import { useCreateQuizMutation, useUpdateQuizMutation } from "../api/quizApi";

import useCourseOfferingOptions from "@/hooks/lookups/useCourseOfferingOptions";

import { toDateTimeLocal, toISOString } from "../utils/quizDate";

export default function QuizDialog({ open, onOpenChange, quiz = null }) {
  const isEdit = Boolean(quiz);

  const { options: courseOfferingOptions, isLoading: courseOfferingLoading } =
    useCourseOfferingOptions();

  const [createQuiz, { isLoading: isCreating }] = useCreateQuizMutation();

  const [updateQuiz, { isLoading: isUpdating }] = useUpdateQuizMutation();

  const form = useForm({
    resolver: zodResolver(quizSchema),
    defaultValues: defaultQuizValues,
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

    if (quiz) {
      reset({
        courseOffering:
          typeof quiz.courseOffering === "object"
            ? quiz.courseOffering?._id
            : (quiz.courseOffering ?? ""),

        title: quiz.title ?? "",

        description: quiz.description ?? "",

        availableFrom: toDateTimeLocal(quiz.availableFrom),

        dueDate: toDateTimeLocal(quiz.dueDate),

        timeLimit: quiz.timeLimit ?? undefined,

        maxScore: quiz.maxScore ?? undefined,
      });

      return;
    }

    reset(defaultQuizValues);
  }, [quiz, open, reset]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,

        availableFrom: toISOString(values.availableFrom),

        dueDate: toISOString(values.dueDate),
      };

      if (isEdit) {
        await updateQuiz({
          id: quiz._id,
          ...payload,
        }).unwrap();
      } else {
        await createQuiz(payload).unwrap();
      }

      reset(defaultQuizValues);

      onOpenChange(false);
    } catch (error) {
      setError("root", {
        message: error?.data?.message ?? "Failed to save quiz.",
      });
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Quiz" : "Create Quiz"}</DialogTitle>

          <DialogDescription>
            {isEdit
              ? "Update the quiz information."
              : "Create a quiz for a course offering."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="min-w-0 space-y-6">
          <QuizForm
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
                  ? "Update Quiz"
                  : "Create Quiz"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
