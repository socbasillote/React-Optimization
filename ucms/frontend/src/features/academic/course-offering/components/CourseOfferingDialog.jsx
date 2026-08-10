import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormDialog from "@/components/common/FormDialog";

import CourseOfferingForm from "./CourseOfferingForm";

import { courseOfferingSchema } from "../schemas/courseOfferingSchema";

import {
  useCreateCourseOfferingMutation,
  useUpdateCourseOfferingMutation,
} from "../api/courseOfferingApi";

import { getErrorMessage } from "@/lib/getErrorMessage";

const defaultValues = {
  curriculumSubject: "",
  faculty: "",
  section: "",
  academicYear: "",
  academicTerm: "",
  status: "ACTIVE",
};

export default function CourseOfferingDialog({
  open,
  onOpenChange,
  courseOffering = null,
}) {
  const isEdit = !!courseOffering;

  const [createCourseOffering, { isLoading: creating }] =
    useCreateCourseOfferingMutation();

  const [updateCourseOffering, { isLoading: updating }] =
    useUpdateCourseOfferingMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(courseOfferingSchema),
    defaultValues,
  });

  useEffect(() => {
    if (courseOffering) {
      reset({
        curriculumSubject:
          courseOffering.curriculumSubject?._id ??
          courseOffering.curriculumSubject ??
          "",

        faculty: courseOffering.faculty?._id ?? courseOffering.faculty ?? "",

        section: courseOffering.section?._id ?? courseOffering.section ?? "",

        academicYear:
          courseOffering.academicYear?._id ?? courseOffering.academicYear ?? "",

        academicTerm:
          courseOffering.academicTerm?._id ?? courseOffering.academicTerm ?? "",

        status: courseOffering.status ?? "ACTIVE",
      });
    } else {
      reset(defaultValues);
    }
  }, [courseOffering, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateCourseOffering({
          id: courseOffering._id,
          ...values,
        }).unwrap();

        toast.success("Course offering updated successfully.");
      } else {
        await createCourseOffering(values).unwrap();

        toast.success("Course offering created successfully.");
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
      title={isEdit ? "Edit Course Offering" : "New Course Offering"}
      description="Enter the course offering information."
      submitLabel={isEdit ? "Update" : "Create"}
      loading={creating || updating}
      onSubmit={handleSubmit(onSubmit)}
    >
      <CourseOfferingForm
        register={register}
        control={control}
        errors={errors}
      />
    </FormDialog>
  );
}
