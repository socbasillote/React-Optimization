import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  useCreateQuizQuestionMutation,
  useUpdateQuizQuestionMutation,
} from "../api/quizQuestionApi";

const EMPTY_FORM = {
  question: "",
  type: "MULTIPLE_CHOICE",
  options: ["", ""],
  correctAnswer: "",
  points: 1,
  order: 1,
};

export default function QuizQuestionDialog({
  open,
  onOpenChange,
  quizId,
  question,
}) {
  const isEditing = Boolean(question);

  const [form, setForm] = useState(EMPTY_FORM);

  const [createQuizQuestion, { isLoading: isCreating }] =
    useCreateQuizQuestionMutation();

  const [updateQuizQuestion, { isLoading: isUpdating }] =
    useUpdateQuizQuestionMutation();

  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (question) {
      setForm({
        question: question.question ?? "",
        type: question.type ?? "MULTIPLE_CHOICE",
        options: question.options?.length ? question.options : ["", ""],
        correctAnswer: question.correctAnswer ?? "",
        points: question.points ?? 1,
        order: question.order ?? 1,
      });

      return;
    }

    setForm({
      ...EMPTY_FORM,
    });
  }, [open, question]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateOption = (index, value) => {
    setForm((current) => {
      const options = [...current.options];

      options[index] = value;

      return {
        ...current,
        options,
      };
    });
  };

  const addOption = () => {
    setForm((current) => ({
      ...current,
      options: [...current.options, ""],
    }));
  };

  const removeOption = (index) => {
    setForm((current) => ({
      ...current,
      options: current.options.filter(
        (_, optionIndex) => optionIndex !== index,
      ),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const options =
      form.type === "MULTIPLE_CHOICE"
        ? form.options.map((option) => option.trim()).filter(Boolean)
        : [];

    const payload = {
      question: form.question.trim(),
      type: form.type,
      options,
      correctAnswer: form.correctAnswer.trim(),
      points: Number(form.points),
      order: Number(form.order),
    };

    try {
      if (isEditing) {
        await updateQuizQuestion({
          id: question._id,
          ...payload,
        }).unwrap();
      } else {
        await createQuizQuestion({
          quiz: quizId,
          ...payload,
        }).unwrap();
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save quiz question:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Question" : "Create Question"}
          </DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Update this quiz question."
              : "Add a question to this quiz."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Question</Label>

            <Textarea
              value={form.question}
              onChange={(event) => updateField("question", event.target.value)}
              placeholder="Enter the question..."
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Type</Label>

              <select
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={form.type}
                onChange={(event) => updateField("type", event.target.value)}
              >
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>

                <option value="TRUE_FALSE">True / False</option>

                <option value="SHORT_ANSWER">Short Answer</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Points</Label>

              <Input
                type="number"
                min="0"
                value={form.points}
                onChange={(event) => updateField("points", event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Order</Label>

              <Input
                type="number"
                min="1"
                value={form.order}
                onChange={(event) => updateField("order", event.target.value)}
                required
              />
            </div>
          </div>

          {form.type === "MULTIPLE_CHOICE" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Options</Label>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                >
                  Add Option
                </Button>
              </div>

              <RadioGroup
                value={form.correctAnswer}
                onValueChange={(value) => updateField("correctAnswer", value)}
              >
                {form.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <RadioGroupItem value={option} disabled={!option.trim()} />

                    <Input
                      value={option}
                      onChange={(event) =>
                        updateOption(index, event.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                      required
                    />

                    {form.options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {form.type === "TRUE_FALSE" && (
            <div className="space-y-2">
              <Label>Correct Answer</Label>

              <select
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                value={form.correctAnswer}
                onChange={(event) =>
                  updateField("correctAnswer", event.target.value)
                }
                required
              >
                <option value="">Select answer</option>

                <option value="true">True</option>

                <option value="false">False</option>
              </select>
            </div>
          )}

          {form.type === "SHORT_ANSWER" && (
            <div className="space-y-2">
              <Label>Correct Answer</Label>

              <Input
                value={form.correctAnswer}
                onChange={(event) =>
                  updateField("correctAnswer", event.target.value)
                }
                placeholder="Enter the expected answer..."
                required
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : isEditing
                  ? "Update Question"
                  : "Create Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
