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
  useDeleteAssignmentMutation,
  useGetAssignmentsQuery,
} from "../api/assignmentApi";

import AssignmentDialog from "../components/AssignmentDialog";
import AssignmentTable from "../components/AssignmentTable";

import { useGetCurrentUserQuery } from "@/features/auth/api/authApi";

const getSubjectLabel = (assignment) => {
  const subject = assignment?.courseOffering?.curriculumSubject?.subject;

  if (!subject) {
    return "Subject information unavailable";
  }

  return [subject.code, subject.title].filter(Boolean).join(" • ");
};

const getSectionName = (assignment) => {
  return assignment?.courseOffering?.section?.name ?? "—";
};

const getFacultyName = (assignment) => {
  const faculty = assignment?.courseOffering?.faculty?.user;

  if (!faculty) {
    return "—";
  }

  return [faculty.firstName, faculty.lastName].filter(Boolean).join(" ").trim();
};

export default function AssignmentPage() {
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [assignmentToDelete, setAssignmentToDelete] = useState(null);

  const { data: currentUserData } = useGetCurrentUserQuery();

  const role = currentUserData?.data?.role;

  const canCreate =
    role === "SUPER_ADMIN" || role === "ADMIN" || role === "FACULTY";

  const canEdit =
    role === "SUPER_ADMIN" || role === "ADMIN" || role === "FACULTY";

  const canDelete =
    role === "SUPER_ADMIN" || role === "ADMIN" || role === "FACULTY";

  const { data, isLoading } = useGetAssignmentsQuery({
    page,
    limit: 10,
  });

  const [deleteAssignment, { isLoading: isDeleting }] =
    useDeleteAssignmentMutation();

  const assignments = data?.data ?? [];

  const meta = data?.meta ?? {
    page: 1,
    total: 0,
    totalPages: 1,
  };

  const handleCreate = () => {
    if (!canCreate) {
      return;
    }

    setSelectedAssignment(null);
    setDialogOpen(true);
  };

  const handleEdit = (assignment) => {
    if (!canEdit) {
      return;
    }

    setSelectedAssignment(assignment);
    setDialogOpen(true);
  };

  const handleDelete = (assignment) => {
    if (!canDelete) {
      return;
    }

    setAssignmentToDelete(assignment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!canDelete || !assignmentToDelete) {
      return;
    }

    try {
      await deleteAssignment(assignmentToDelete._id).unwrap();

      setDeleteDialogOpen(false);
      setAssignmentToDelete(null);
    } catch (error) {
      console.error("Failed to delete assignment:", error);
    }
  };

  const handleDeleteDialogChange = (open) => {
    setDeleteDialogOpen(open);

    if (!open) {
      setAssignmentToDelete(null);
    }
  };

  const handleDialogChange = (open) => {
    setDialogOpen(open);

    if (!open) {
      setSelectedAssignment(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Assignments</h1>

          <p className="text-sm text-muted-foreground">
            {canCreate || canEdit
              ? "Manage assignments for your course offerings."
              : "View assignments for your courses."}
          </p>
        </div>

        {canCreate && (
          <Button onClick={handleCreate}>
            <Plus />
            Create Assignment
          </Button>
        )}
      </div>

      <AssignmentTable
        assignments={assignments}
        isLoading={isLoading}
        isDeleting={isDeleting}
        onEdit={canEdit ? handleEdit : undefined}
        onDelete={canDelete ? handleDelete : undefined}
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

      {canCreate || canEdit ? (
        <AssignmentDialog
          open={dialogOpen}
          onOpenChange={handleDialogChange}
          assignment={selectedAssignment}
        />
      ) : null}

      {canDelete && (
        <Dialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Assignment</DialogTitle>

              <DialogDescription>
                Are you sure you want to delete this assignment? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {assignmentToDelete && (
              <div className="space-y-3 rounded-md border bg-muted/50 p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Assignment</p>

                  <p className="font-medium">{assignmentToDelete.title}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Course</p>

                  <p className="text-sm">
                    {getSubjectLabel(assignmentToDelete)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Section</p>

                  <p className="text-sm">
                    {getSectionName(assignmentToDelete)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Faculty</p>

                  <p className="text-sm">
                    {getFacultyName(assignmentToDelete)}
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
      )}
    </div>
  );
}
