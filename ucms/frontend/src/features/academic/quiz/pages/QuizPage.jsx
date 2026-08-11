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

import { useDeleteQuizMutation, useGetQuizzesQuery } from "../api/quizApi";

import QuizDialog from "../components/QuizDialog";
import QuizTable from "../components/QuizTable";

const getSubjectLabel = (quiz) => {
  const subject = quiz?.courseOffering?.curriculumSubject?.subject;

  if (!subject) {
    return "Subject information unavailable";
  }

  return [subject.code, subject.title].filter(Boolean).join(" • ");
};

const getSectionName = (quiz) => quiz?.courseOffering?.section?.name ?? "—";

const getFacultyName = (quiz) => {
  const faculty = quiz?.courseOffering?.faculty?.user;

  if (!faculty) {
    return "—";
  }

  return [faculty.firstName, faculty.lastName].filter(Boolean).join(" ").trim();
};

export default function QuizPage() {
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [quizToDelete, setQuizToDelete] = useState(null);

  const { data, isLoading } = useGetQuizzesQuery({
    page,
    limit: 10,
  });

  const [deleteQuiz, { isLoading: isDeleting }] = useDeleteQuizMutation();

  const quizzes = data?.data ?? [];

  const meta = data?.meta ?? {
    page: 1,
    total: 0,
    totalPages: 1,
  };

  const handleCreate = () => {
    setSelectedQuiz(null);
    setDialogOpen(true);
  };

  const handleEdit = (quiz) => {
    setSelectedQuiz(quiz);
    setDialogOpen(true);
  };

  const handleDelete = (quiz) => {
    setQuizToDelete(quiz);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!quizToDelete) {
      return;
    }

    try {
      await deleteQuiz(quizToDelete._id).unwrap();

      setDeleteDialogOpen(false);
      setQuizToDelete(null);
    } catch (error) {
      console.error("Failed to delete quiz:", error);
    }
  };

  const handleDeleteDialogChange = (open) => {
    setDeleteDialogOpen(open);

    if (!open) {
      setQuizToDelete(null);
    }
  };

  const handleDialogChange = (open) => {
    setDialogOpen(open);

    if (!open) {
      setSelectedQuiz(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Quizzes</h1>

          <p className="text-sm text-muted-foreground">
            Manage quizzes for your course offerings.
          </p>
        </div>

        <Button onClick={handleCreate}>
          <Plus />
          Create Quiz
        </Button>
      </div>

      <QuizTable
        quizzes={quizzes}
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

      <QuizDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        quiz={selectedQuiz}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Quiz</DialogTitle>

            <DialogDescription>
              Are you sure you want to delete this quiz? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {quizToDelete && (
            <div className="space-y-3 rounded-md border bg-muted/50 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Quiz</p>

                <p className="font-medium">{quizToDelete.title}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Course</p>

                <p className="text-sm">{getSubjectLabel(quizToDelete)}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Section</p>

                <p className="text-sm">{getSectionName(quizToDelete)}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Faculty</p>

                <p className="text-sm">{getFacultyName(quizToDelete)}</p>
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
