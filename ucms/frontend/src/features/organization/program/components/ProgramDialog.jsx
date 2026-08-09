import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormDialog from "@/components/common/FormDialog";

import ProgramForm from "./ProgramForm";

import { programSchema } from "../schemas/programSchema";

import {
  useCreateProgramMutation,
  useUpdateProgramMutation,
} from "../api/programApi";

import { getErrorMessage } from "@/lib/getErrorMessage";

const defaultValues = {
  department: "",
  name: "",
  code: "",
  description: "",
  degreeType: "BACHELOR",
  durationYears: 4,
  status: "ACTIVE",
};

export default function ProgramDialog({ open, onOpenChange, program = null }) {
  const isEdit = !!program;

  const [createProgram, { isLoading: creating }] = useCreateProgramMutation();

  const [updateProgram, { isLoading: updating }] = useUpdateProgramMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(programSchema),
    defaultValues,
  });

  useEffect(() => {
    if (program) {
      reset({
        department: program.department?._id ?? program.department ?? "",
        name: program.name ?? "",
        code: program.code ?? "",
        description: program.description ?? "",
        degreeType: program.degreeType ?? "BACHELOR",
        durationYears: program.durationYears ?? 4,
        status: program.status ?? "ACTIVE",
      });
    } else {
      reset(defaultValues);
    }
  }, [program, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateProgram({
          id: program._id,
          ...values,
        }).unwrap();

        toast.success("Program updated successfully.");
      } else {
        await createProgram(values).unwrap();

        toast.success("Program created successfully.");
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
      title={isEdit ? "Edit Program" : "New Program"}
      description="Enter the program information."
      submitLabel={isEdit ? "Update" : "Create"}
      loading={creating || updating}
      onSubmit={handleSubmit(onSubmit)}
    >
      <ProgramForm register={register} control={control} errors={errors} />
    </FormDialog>
  );
}
