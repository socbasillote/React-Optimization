import { Label } from "@/components/ui/label";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Textarea } from "@/components/ui/textarea";

export default function StudentQuizQuestion({
  question,
  answer,
  onAnswerChange,
}) {
  if (!question) {
    return null;
  }

  const handleMultipleChoiceChange = (value) => {
    onAnswerChange(value);
  };

  return (
    <div className="space-y-5 rounded-lg border p-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Question {question.order}
        </p>

        <h2 className="text-lg font-medium">{question.question}</h2>

        <p className="text-sm text-muted-foreground">
          {question.points} {question.points === 1 ? "point" : "points"}
        </p>
      </div>

      {question.type === "MULTIPLE_CHOICE" && (
        <RadioGroup
          value={answer ?? ""}
          onValueChange={handleMultipleChoiceChange}
          className="space-y-3"
        >
          {question.options?.map((option) => {
            const optionId = `${question._id}-${option}`;

            return (
              <div
                key={optionId}
                className="flex items-center space-x-3 rounded-md border p-3"
              >
                <RadioGroupItem value={option} id={optionId} />

                <Label htmlFor={optionId} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      )}

      {question.type === "TRUE_FALSE" && (
        <RadioGroup
          value={answer ?? ""}
          onValueChange={handleMultipleChoiceChange}
          className="space-y-3"
        >
          {["true", "false"].map((option) => {
            const optionId = `${question._id}-${option}`;

            return (
              <div
                key={optionId}
                className="flex items-center space-x-3 rounded-md border p-3"
              >
                <RadioGroupItem value={option} id={optionId} />

                <Label
                  htmlFor={optionId}
                  className="flex-1 cursor-pointer capitalize"
                >
                  {option}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      )}

      {question.type === "SHORT_ANSWER" && (
        <Textarea
          value={answer ?? ""}
          onChange={(event) => onAnswerChange(event.target.value)}
          placeholder="Enter your answer..."
          rows={4}
        />
      )}
    </div>
  );
}
