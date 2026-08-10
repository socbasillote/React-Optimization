import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import PageHeader from "@/components/common/PageHeader";
import SearchToolbar from "@/components/common/SearchToolbar";
import AppPagination from "@/components/common/AppPagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import {
  useDeleteClassScheduleMutation,
  useGetClassSchedulesQuery,
} from "../api/classScheduleApi";

import ClassScheduleTable from "../components/ClassScheduleTable";
import ClassScheduleDialog from "../components/ClassScheduleDialog";

import { getErrorMessage } from "@/lib/getErrorMessage";

export default function ClassSchedulePage() {
  const [page, setPage] = useState(1);
  const [room, setRoom] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedClassSchedule, setSelectedClassSchedule] = useState(null);

  const { data, isLoading } = useGetClassSchedulesQuery({
    page,
    ...(room.trim() && {
      room: room.trim(),
    }),
  });

  const [deleteClassSchedule, { isLoading: deleting }] =
    useDeleteClassScheduleMutation();

  const classSchedules = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleSearch = (value) => {
    setRoom(value);
    setPage(1);
  };

  const handleCreate = () => {
    setSelectedClassSchedule(null);
    setDialogOpen(true);
  };

  const handleEdit = (classSchedule) => {
    setSelectedClassSchedule(classSchedule);
    setDialogOpen(true);
  };

  const handleDeleteRequest = (classSchedule) => {
    setSelectedClassSchedule(classSchedule);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedClassSchedule) return;

    try {
      await deleteClassSchedule(selectedClassSchedule._id).unwrap();

      toast.success("Class schedule deleted successfully.");

      setDeleteOpen(false);
      setSelectedClassSchedule(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Schedules"
        description="Manage class schedules and room assignments."
      />

      <SearchToolbar
        value={room}
        onChange={handleSearch}
        placeholder="Search by room..."
      >
        <Button onClick={handleCreate}>New Class Schedule</Button>
      </SearchToolbar>

      <ClassScheduleTable
        classSchedules={classSchedules}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <AppPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ClassScheduleDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedClassSchedule(null);
          }
        }}
        classSchedule={selectedClassSchedule}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Class Schedule"
        description={`Are you sure you want to delete the ${selectedClassSchedule?.day ?? ""} schedule for "${selectedClassSchedule?.courseOffering?.curriculumSubject?.subject?.code ?? "this course"}"? This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
