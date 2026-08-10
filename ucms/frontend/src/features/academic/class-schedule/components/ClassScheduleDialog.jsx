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

import ClassScheduleForm from "./ClassScheduleForm";

import {
  useCreateClassScheduleMutation,
  useUpdateClassScheduleMutation,
} from "../api/classScheduleApi";

import useCourseOfferingOptions from "@/hooks/useCourseOfferingOptions";

import { classScheduleSchema } from "../schemas/classScheduleSchema";

const defaultValues = {
  courseOffering: "",
  day: "",
  startTime: "",
  endTime: "",
  room: "",
};

export default function ClassScheduleDialog({
  open,
  onOpenChange,
  schedule = null,
}) {
  const isEdit = Boolean(schedule);

  const [createClassSchedule, { isLoading: isCreating }] =
    useCreateClassScheduleMutation();

  const [updateClassSchedule, { isLoading: isUpdating }] =
    useUpdateClassScheduleMutation();

  const { options: courseOfferings, isLoading: courseOfferingLoading } =
    useCourseOfferingOptions();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(classScheduleSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(
        schedule
          ? {
              courseOffering: schedule.courseOffering?._id ?? "",
              day: schedule.day ?? "",
              startTime: schedule.startTime ?? "",
              endTime: schedule.endTime ?? "",
              room: schedule.room ?? "",
            }
          : defaultValues,
      );
    }
  }, [open, schedule, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateClassSchedule({
          id: schedule._id,
          ...values,
        }).unwrap();
      } else {
        await createClassSchedule(values).unwrap();
      }

      onOpenChange(false);
      reset(defaultValues);
    } catch (error) {
      // API errors are handled by the existing application error handling.
      console.error(error);
    }
  };

  const loading = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Class Schedule" : "Create Class Schedule"}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? "Update the class schedule details."
              : "Add a schedule for a course offering."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="class-schedule-form"
          onSubmit={handleSubmit(onSubmit)}
          className="w-full min-w-0 space-y-5"
        >
          <ClassScheduleForm
            register={register}
            control={control}
            errors={errors}
            courseOfferings={courseOfferings}
            courseOfferingLoading={courseOfferingLoading}
          />
        </form>

        <DialogFooter className="w-full">
          <Button type="submit" form="class-schedule-form" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
