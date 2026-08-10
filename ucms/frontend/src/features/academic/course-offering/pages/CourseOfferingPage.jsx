import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import PageHeader from "@/components/common/PageHeader";
import SearchToolbar from "@/components/common/SearchToolbar";
import AppPagination from "@/components/common/AppPagination";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import {
  useDeleteCourseOfferingMutation,
  useGetCourseOfferingsQuery,
} from "../api/courseOfferingApi";

import CourseOfferingTable from "../components/CourseOfferingTable";
import CourseOfferingDialog from "../components/CourseOfferingDialog";

import { getErrorMessage } from "@/lib/getErrorMessage";

export default function CourseOfferingPage() {
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedCourseOffering, setSelectedCourseOffering] = useState(null);

  const { data, isLoading } = useGetCourseOfferingsQuery({
    page,
  });

  const [deleteCourseOffering, { isLoading: deleting }] =
    useDeleteCourseOfferingMutation();

  const courseOfferings = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleCreate = () => {
    setSelectedCourseOffering(null);
    setDialogOpen(true);
  };

  const handleEdit = (courseOffering) => {
    setSelectedCourseOffering(courseOffering);
    setDialogOpen(true);
  };

  const handleDeleteRequest = (courseOffering) => {
    setSelectedCourseOffering(courseOffering);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCourseOffering) return;

    try {
      await deleteCourseOffering(selectedCourseOffering._id).unwrap();

      toast.success("Course offering deleted successfully.");

      setDeleteOpen(false);
      setSelectedCourseOffering(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Offerings"
        description="Manage course offerings."
      />

      <SearchToolbar
        value=""
        onChange={() => {}}
        placeholder="Search is not available..."
      >
        <Button onClick={handleCreate}>New Course Offering</Button>
      </SearchToolbar>

      <CourseOfferingTable
        courseOfferings={courseOfferings}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <AppPagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <CourseOfferingDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setSelectedCourseOffering(null);
          }
        }}
        courseOffering={selectedCourseOffering}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Course Offering"
        description="Are you sure you want to delete this course offering? This action cannot be undone."
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
