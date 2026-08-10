import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormDialog from "@/components/common/FormDialog";

import StudentForm from "./StudentForm";

import { studentSchema } from "../schemas/studentSchema";

import {
  useCreateStudentMutation,
  useUpdateStudentMutation,
} from "../api/studentApi";

import { getErrorMessage } from "@/lib/getErrorMessage";

const defaultValues = {
  user: "",
  studentNumber: "",
  program: "",
  curriculum: "",
  section: "",
  yearLevel: 1,
  admissionDate: "",
  status: "ACTIVE",
};

export default function StudentDialog({ open, onOpenChange, student = null }) {
  const isEdit = !!student;

  const [createStudent, { isLoading: creating }] = useCreateStudentMutation();

  const [updateStudent, { isLoading: updating }] = useUpdateStudentMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues,
  });

  useEffect(() => {
    if (student) {
      reset({
        user: student.user?._id ?? student.user ?? "",
        studentNumber: student.studentNumber ?? "",
        program: student.program?._id ?? student.program ?? "",
        curriculum: student.curriculum?._id ?? student.curriculum ?? "",
        section: student.section?._id ?? student.section ?? "",
        yearLevel: student.yearLevel ?? 1,
        admissionDate: student.admissionDate
          ? student.admissionDate.slice(0, 10)
          : "",
        status: student.status ?? "ACTIVE",
      });
    } else {
      reset(defaultValues);
    }
  }, [student, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateStudent({
          id: student._id,
          ...values,
        }).unwrap();

        toast.success("Student updated successfully.");
      } else {
        await createStudent(values).unwrap();

        toast.success("Student created successfully.");
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
      title={isEdit ? "Edit Student" : "New Student"}
      description="Enter the student information."
      submitLabel={isEdit ? "Update" : "Create"}
      loading={creating || updating}
      onSubmit={handleSubmit(onSubmit)}
    >
      <StudentForm register={register} control={control} errors={errors} />
    </FormDialog>
  );
}
