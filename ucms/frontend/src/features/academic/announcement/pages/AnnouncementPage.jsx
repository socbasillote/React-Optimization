import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  useDeleteAnnouncementMutation,
  useGetAnnouncementsQuery,
} from "../api/announcementApi";

import AnnouncementDialog from "../components/AnnouncementDialog";

import AnnouncementTable from "../components/AnnouncementTable";

import useCourseOfferingOptions from "@/hooks/lookups/useCourseOfferingOptions";

const getCourseOfferingId = (announcement) => {
  if (typeof announcement?.courseOffering === "object") {
    return announcement.courseOffering?._id;
  }

  return announcement?.courseOffering;
};

export default function AnnouncementPage() {
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

  const { data, isLoading } = useGetAnnouncementsQuery({
    page,
    limit: 10,
  });

  const { options: courseOfferingOptions, isLoading: courseOfferingLoading } =
    useCourseOfferingOptions();

  const [deleteAnnouncement, { isLoading: isDeleting }] =
    useDeleteAnnouncementMutation();

  const announcements = data?.data ?? [];

  const meta = data?.meta ?? {
    page: 1,
    total: 0,
    totalPages: 1,
  };

  const getCourseLabel = (announcement) => {
    const id = getCourseOfferingId(announcement);

    const option = courseOfferingOptions.find((item) => item.value === id);

    return option?.label ?? "Course information unavailable";
  };

  const handleCreate = () => {
    setSelectedAnnouncement(null);

    setDialogOpen(true);
  };

  const handleEdit = (announcement) => {
    setSelectedAnnouncement(announcement);

    setDialogOpen(true);
  };

  const handleDelete = (announcement) => {
    setAnnouncementToDelete(announcement);

    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!announcementToDelete) {
      return;
    }

    try {
      await deleteAnnouncement(announcementToDelete._id).unwrap();

      setDeleteDialogOpen(false);
      setAnnouncementToDelete(null);
    } catch (error) {
      console.error("Failed to delete announcement:", error);
    }
  };

  const handleDeleteDialogChange = (open) => {
    setDeleteDialogOpen(open);

    if (!open) {
      setAnnouncementToDelete(null);
    }
  };

  const handleDialogChange = (open) => {
    setDialogOpen(open);

    if (!open) {
      setSelectedAnnouncement(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Announcements
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage announcements for your course offerings.
          </p>
        </div>

        <Button onClick={handleCreate}>
          <Plus />
          Create Announcement
        </Button>
      </div>

      <AnnouncementTable
        announcements={announcements}
        courseOfferingOptions={courseOfferingOptions}
        isLoading={isLoading}
        isDeleting={isDeleting}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <AnnouncementDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        announcement={selectedAnnouncement}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>

            <DialogDescription>
              Are you sure you want to delete this announcement? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {announcementToDelete && (
            <div className="space-y-3 rounded-md border bg-muted/50 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Title</p>

                <p className="font-medium">{announcementToDelete.title}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Course Offering</p>

                <p className="text-sm">
                  {getCourseLabel(announcementToDelete)}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Published</p>

                <p className="text-sm">
                  {announcementToDelete.publishedAt
                    ? new Date(
                        announcementToDelete.publishedAt,
                      ).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => handleDeleteDialogChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
