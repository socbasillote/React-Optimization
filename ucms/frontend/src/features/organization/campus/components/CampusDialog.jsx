import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormDialog from "@/components/common/FormDialog";

import CampusForm from "./CampusForm";

import { campusSchema } from "../schemas/campusSchema";

import {
  useCreateCampusMutation,
  useUpdateCampusMutation,
} from "../api/campusApi";

import { getErrorMessage } from "@/lib/getErrorMessage";

const defaultValues = {
  name: "",
  code: "",
  address: "",
  status: "ACTIVE",
};

export default function CampusDialog({ open, onOpenChange, campus = null }) {
  const isEdit = !!campus;

  const [createCampus, { isLoading: creating }] = useCreateCampusMutation();

  const [updateCampus, { isLoading: updating }] = useUpdateCampusMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(campusSchema),
    defaultValues,
  });

  useEffect(() => {
    if (campus) {
      reset({
        name: campus.name,
        code: campus.code,
        address: campus.address ?? "",
        status: campus.status,
      });
    } else {
      reset(defaultValues);
    }
  }, [campus, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await updateCampus({
          id: campus._id,
          ...values,
        }).unwrap();

        toast.success("Campus updated successfully.");
      } else {
        await createCampus(values).unwrap();

        toast.success("Campus created successfully.");
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
      title={isEdit ? "Edit Campus" : "New Campus"}
      description="Enter the campus information."
      submitLabel={isEdit ? "Update" : "Create"}
      loading={creating || updating}
      onSubmit={handleSubmit(onSubmit)}
    >
      <CampusForm register={register} control={control} errors={errors} />
    </FormDialog>
  );
}
