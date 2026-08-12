import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formatQuestionType = (type) => {
  switch (type) {
    case "MULTIPLE_CHOICE":
      return "Multiple Choice";

    case "TRUE_FALSE":
      return "True / False";

    case "SHORT_ANSWER":
      return "Short Answer";

    default:
      return type ?? "—";
  }
};

export default function QuizQuestionTable({
  questions = [],
  isLoading,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">#</TableHead>

              <TableHead>Question</TableHead>

              <TableHead>Type</TableHead>

              <TableHead>Points</TableHead>

              <TableHead className="w-[150px]">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading questions...
                </TableCell>
              </TableRow>
            ) : questions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No questions found.
                </TableCell>
              </TableRow>
            ) : (
              questions.map((question) => (
                <TableRow key={question._id}>
                  <TableCell className="font-medium">
                    {question.order}
                  </TableCell>

                  <TableCell>
                    <div className="max-w-[500px]">
                      <div className="font-medium">{question.question}</div>

                      {question.type === "MULTIPLE_CHOICE" &&
                        question.options?.length > 0 && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            {question.options.join(" • ")}
                          </div>
                        )}
                    </div>
                  </TableCell>

                  <TableCell>{formatQuestionType(question.type)}</TableCell>

                  <TableCell>{question.points}</TableCell>

                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(question)}
                      >
                        <Pencil />
                        Edit
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(question)}
                      >
                        <Trash2 />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
