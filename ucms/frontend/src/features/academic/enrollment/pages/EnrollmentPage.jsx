import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import SearchToolbar from "@/components/common/SearchToolbar";
import AppPagination from "@/components/common/AppPagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import {
  useDeleteEnrollmentMutation,
  useGetEnrollmentsQuery,
} from "../api/enrollmentApi";

import EnrollmentTable from "../components/EnrollmentTable";
import EnrollmentDialog from "../components/EnrollmentDialog";

import { getErrorMessage } from "@/lib/getErrorMessage";

export default function EnrollmentPage() {
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const { data, isLoading } = useGetEnrollmentsQuery({
    page,
  });

  const [deleteEnrollment, { isLoading: deleting }] =
    useDeleteEnrollmentMutation();

  const enrollments = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleCreate = () => {
    setSelectedEnrollment(null);
    setDialogOpen(true);
  };

  const handleEdit = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setDialogOpen(true);
  };

  const handleDeleteRequest = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedEnrollment) return;

    try {
      await deleteEnrollment(selectedEnrollment._id).unwrap();

      toast.success("Enrollment deleted successfully.");

      setDeleteOpen(false);
      setSelectedEnrollment(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-5">
      <SearchToolbar
        value=""
        onChange={() => {}}
        placeholder="Search enrollments..."
      >
        <Button onClick={handleCreate}>New Enrollment</Button>
      </SearchToolbar>

      <EnrollmentTable
        enrollments={enrollments}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <AppPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <EnrollmentDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedEnrollment(null);
          }
        }}
        enrollment={selectedEnrollment}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Enrollment"
        description="Are you sure you want to delete this enrollment? This action cannot be undone."
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
