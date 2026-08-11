import { Controller } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AnnouncementForm({
  register,
  control,
  errors,
  courseOfferingOptions = [],
  courseOfferingLoading = false,
}) {
  return (
    <div className="grid min-w-0 gap-4">
      <Field>
        <FieldLabel>Course Offering</FieldLabel>

        <Controller
          control={control}
          name="courseOffering"
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={field.onChange}
              items={courseOfferingOptions}
              disabled={courseOfferingLoading}
            >
              <SelectTrigger
                className="w-full min-w-0"
                aria-invalid={!!errors.courseOffering}
              >
                <SelectValue placeholder="Select course offering" />
              </SelectTrigger>

              <SelectContent>
                {courseOfferingLoading ? (
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    Loading course offerings...
                  </div>
                ) : courseOfferingOptions.length === 0 ? (
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    No course offerings available.
                  </div>
                ) : (
                  courseOfferingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />

        <FieldError>{errors.courseOffering?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Title</FieldLabel>

        <Input
          placeholder="Important Announcement"
          {...register("title")}
          aria-invalid={!!errors.title}
        />

        <FieldError>{errors.title?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Content</FieldLabel>

        <Textarea
          placeholder="Write your announcement..."
          rows={6}
          {...register("content")}
          aria-invalid={!!errors.content}
        />

        <FieldError>{errors.content?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Published At</FieldLabel>

        <Input
          type="datetime-local"
          {...register("publishedAt")}
          aria-invalid={!!errors.publishedAt}
        />

        <FieldError>{errors.publishedAt?.message}</FieldError>
      </Field>
    </div>
  );
}
