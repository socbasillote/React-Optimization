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

import GradeDialog from "../components/GradeDialog";
import GradeTable from "../components/GradeTable";

import { useDeleteGradeMutation, useGetGradesQuery } from "../api/gradeApi";

import { useGetCurrentUserQuery } from "@/features/auth/api/authApi";

const getStudentName = (grade) => {
  const user = grade?.enrollment?.student?.user;

  if (!user) {
    return "Student information unavailable";
  }

  const name = [user.firstName, user.middleName, user.lastName, user.suffix]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    name ||
    grade?.enrollment?.student?.studentNumber ||
    "Student information unavailable"
  );
};

const getStudentNumber = (grade) => {
  return grade?.enrollment?.student?.studentNumber ?? "—";
};

const getSubjectLabel = (grade) => {
  const subject = grade?.enrollment?.courseOffering?.curriculumSubject?.subject;

  if (!subject) {
    return "Subject information unavailable";
  }

  return [subject.code, subject.title].filter(Boolean).join(" • ");
};

export default function GradePage() {
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedGrade, setSelectedGrade] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [gradeToDelete, setGradeToDelete] = useState(null);

  const { data: currentUserData } = useGetCurrentUserQuery();

  const role = currentUserData?.data?.role;

  const canCreate =
    role === "SUPER_ADMIN" || role === "ADMIN" || role === "FACULTY";

  const canEdit =
    role === "SUPER_ADMIN" || role === "ADMIN" || role === "FACULTY";

  const canDelete = role === "SUPER_ADMIN" || role === "ADMIN";

  const { data, isLoading } = useGetGradesQuery({
    page,
    limit: 10,
  });

  const [deleteGrade, { isLoading: isDeleting }] = useDeleteGradeMutation();

  const grades = data?.data ?? [];

  const meta = data?.meta ?? {
    page: 1,
    totalPages: 1,
    total: 0,
  };

  const handleCreate = () => {
    if (!canCreate) {
      return;
    }

    setSelectedGrade(null);
    setDialogOpen(true);
  };

  const handleEdit = (grade) => {
    if (!canEdit) {
      return;
    }

    setSelectedGrade(grade);
    setDialogOpen(true);
  };

  const handleDelete = (grade) => {
    if (!canDelete) {
      return;
    }

    setGradeToDelete(grade);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!canDelete || !gradeToDelete) {
      return;
    }

    try {
      await deleteGrade(gradeToDelete._id).unwrap();

      setDeleteDialogOpen(false);
      setGradeToDelete(null);
    } catch (error) {
      console.error("Failed to delete grade:", error);
    }
  };

  const handleDeleteDialogChange = (open) => {
    setDeleteDialogOpen(open);

    if (!open) {
      setGradeToDelete(null);
    }
  };

  const handleDialogChange = (open) => {
    setDialogOpen(open);

    if (!open) {
      setSelectedGrade(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Grades</h1>

          <p className="text-sm text-muted-foreground">
            {canCreate || canEdit
              ? "Manage student grades and final results."
              : "View your grades and final results."}
          </p>
        </div>

        {canCreate && (
          <Button onClick={handleCreate}>
            <Plus />
            Record Grade
          </Button>
        )}
      </div>

      <GradeTable
        grades={grades}
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
        <GradeDialog
          open={dialogOpen}
          onOpenChange={handleDialogChange}
          grade={selectedGrade}
        />
      ) : null}

      {canDelete && (
        <Dialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Grade</DialogTitle>

              <DialogDescription>
                Are you sure you want to delete this grade record? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {gradeToDelete && (
              <div className="space-y-3 rounded-md border bg-muted/50 p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Student</p>

                  <p className="font-medium">{getStudentName(gradeToDelete)}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Student Number
                  </p>

                  <p className="text-sm">{getStudentNumber(gradeToDelete)}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Subject</p>

                  <p className="text-sm">{getSubjectLabel(gradeToDelete)}</p>
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
