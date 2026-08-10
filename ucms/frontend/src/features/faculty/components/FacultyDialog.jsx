import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormDialog from "@/components/common/FormDialog";

import FacultyForm from "./FacultyForm";

import { facultySchema } from "../schemas/facultySchema";

import {
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
} from "../api/facultyApi";

import { getErrorMessage } from "@/lib/getErrorMessage";

const defaultValues = {
  user: "",
  employeeId: "",
  department: "",
  position: "",
  status: "ACTIVE",
};

export default function FacultyDialog({ open, onOpenChange, faculty = null }) {
  const isEdit = !!faculty;

  const [createFaculty, { isLoading: creating }] = useCreateFacultyMutation();

  const [updateFaculty, { isLoading: updating }] = useUpdateFacultyMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(facultySchema),
    defaultValues,
  });

  useEffect(() => {
    if (faculty) {
      reset({
        user: faculty.user?._id ?? faculty.user ?? "",
        employeeId: faculty.employeeId ?? "",
        department: faculty.department?._id ?? faculty.department ?? "",
        position: faculty.position ?? "",
        status: faculty.status ?? "ACTIVE",
      });
    } else {
      reset(defaultValues);
    }
  }, [faculty, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateFaculty({
          id: faculty._id,
          ...values,
        }).unwrap();

        toast.success("Faculty updated successfully.");
      } else {
        await createFaculty(values).unwrap();

        toast.success("Faculty created successfully.");
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
      title={isEdit ? "Edit Faculty" : "New Faculty"}
      description="Enter the faculty information."
      submitLabel={isEdit ? "Update" : "Create"}
      loading={creating || updating}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FacultyForm register={register} control={control} errors={errors} />
    </FormDialog>
  );
}
