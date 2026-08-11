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

import AnnouncementForm from "./AnnouncementForm";

import {
  announcementSchema,
  defaultAnnouncementValues,
} from "../schemas/announcementSchema";

import {
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
} from "../api/announcementApi";

import useCourseOfferingOptions from "@/hooks/useCourseOfferingOptions";

import { toDateTimeLocal, toISOString } from "../utils/announcementDate";

export default function AnnouncementDialog({
  open,
  onOpenChange,
  announcement = null,
}) {
  const isEdit = Boolean(announcement);

  const { options: courseOfferingOptions, isLoading: courseOfferingLoading } =
    useCourseOfferingOptions();

  const [createAnnouncement, { isLoading: isCreating }] =
    useCreateAnnouncementMutation();

  const [updateAnnouncement, { isLoading: isUpdating }] =
    useUpdateAnnouncementMutation();

  const form = useForm({
    resolver: zodResolver(announcementSchema),
    defaultValues: defaultAnnouncementValues,
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

    if (announcement) {
      reset({
        courseOffering:
          typeof announcement.courseOffering === "object"
            ? announcement.courseOffering?._id
            : (announcement.courseOffering ?? ""),

        title: announcement.title ?? "",

        content: announcement.content ?? "",

        publishedAt: toDateTimeLocal(announcement.publishedAt),
      });

      return;
    }

    reset(defaultAnnouncementValues);
  }, [announcement, open, reset]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        publishedAt: toISOString(values.publishedAt),
      };

      if (isEdit) {
        await updateAnnouncement({
          id: announcement._id,
          ...payload,
        }).unwrap();
      } else {
        await createAnnouncement(payload).unwrap();
      }

      reset(defaultAnnouncementValues);

      onOpenChange(false);
    } catch (error) {
      setError("root", {
        message: error?.data?.message ?? "Failed to save announcement.",
      });
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Announcement" : "Create Announcement"}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? "Update the announcement information."
              : "Create an announcement for a course offering."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="min-w-0 space-y-6">
          <AnnouncementForm
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
                  ? "Update Announcement"
                  : "Create Announcement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
