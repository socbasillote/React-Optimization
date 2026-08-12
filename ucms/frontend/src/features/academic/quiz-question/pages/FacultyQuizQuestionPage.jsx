import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { useGetQuizByIdQuery } from "@/features/academic/quiz/api/quizApi";

import {
  useGetQuizQuestionsQuery,
  useDeleteQuizQuestionMutation,
} from "../api/quizQuestionApi";

import QuizQuestionTable from "../components/QuizQuestionTable";
import QuizQuestionDialog from "../components/QuizQuestionDialog";

export default function FacultyQuizQuestionPage() {
  const navigate = useNavigate();
  const { quizId } = useParams();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const { data: quizData, isLoading: quizLoading } = useGetQuizByIdQuery(
    quizId,
    {
      skip: !quizId,
    },
  );

  const { data: questionData, isLoading: questionsLoading } =
    useGetQuizQuestionsQuery(
      {
        quiz: quizId,
        page: 1,
        limit: 100,
      },
      {
        skip: !quizId,
      },
    );

  const [deleteQuizQuestion, { isLoading: isDeleting }] =
    useDeleteQuizQuestionMutation();

  const quiz = quizData?.data ?? null;
  const questions = questionData?.data ?? [];

  const handleCreate = () => {
    setSelectedQuestion(null);
    setDialogOpen(true);
  };

  const handleEdit = (question) => {
    setSelectedQuestion(question);
    setDialogOpen(true);
  };

  const handleDelete = async (question) => {
    const confirmed = window.confirm(`Delete question "${question.question}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteQuizQuestion(question._id).unwrap();
    } catch (error) {
      console.error("Failed to delete quiz question:", error);
    }
  };

  const handleDialogChange = (open) => {
    setDialogOpen(open);

    if (!open) {
      setSelectedQuestion(null);
    }
  };

  const isLoading = quizLoading || questionsLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate("/app/quizzes")}
          >
            <ArrowLeft />
            Back to Quizzes
          </Button>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Quiz Questions
            </h1>

            <p className="text-sm text-muted-foreground">
              {quiz?.title
                ? `Manage questions for ${quiz.title}.`
                : "Manage questions for this quiz."}
            </p>
          </div>
        </div>

        <Button type="button" onClick={handleCreate} disabled={!quiz}>
          <Plus />
          Add Question
        </Button>
      </div>

      <QuizQuestionTable
        questions={questions}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <QuizQuestionDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        quizId={quizId}
        question={selectedQuestion}
      />
    </div>
  );
}
