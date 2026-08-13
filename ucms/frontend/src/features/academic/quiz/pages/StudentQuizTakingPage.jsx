import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useGetQuizByIdQuery } from "../api/quizApi";

import { useGetQuizQuestionsQuery } from "@/features/academic/quiz-question/api/quizQuestionApi";

import {
  useCreateQuizSubmissionMutation,
  useStartQuizMutation,
} from "../api/quizSubmissionApi";

import { useGetEnrollmentsQuery } from "@/features/academic/enrollment/api/enrollmentApi";

import StudentQuizQuestion from "../components/student/StudentQuizQuestion";

const formatTime = (seconds) => {
  if (seconds === null || seconds === undefined) {
    return "—";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
};

export default function StudentQuizTakingPage() {
  const navigate = useNavigate();
  const { quizId } = useParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(null);

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

  const { data: enrollmentData, isLoading: enrollmentsLoading } =
    useGetEnrollmentsQuery({
      page: 1,
      limit: 100,
    });

  const [
    startQuiz,
    { data: startData, isLoading: isStarting, error: startError },
  ] = useStartQuizMutation();

  const [
    createQuizSubmission,
    { isLoading: isSubmitting, error: submitError },
  ] = useCreateQuizSubmissionMutation();

  const quiz = quizData?.data ?? null;

  const questions = useMemo(() => {
    return [...(questionData?.data ?? [])].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    );
  }, [questionData]);

  const enrollments = enrollmentData?.data ?? [];

  const enrollment = useMemo(() => {
    if (!quiz) {
      return null;
    }

    const courseOfferingId =
      typeof quiz.courseOffering === "object"
        ? quiz.courseOffering?._id
        : quiz.courseOffering;

    return enrollments.find((item) => {
      const enrollmentCourseOfferingId =
        typeof item.courseOffering === "object"
          ? item.courseOffering?._id
          : item.courseOffering;

      return enrollmentCourseOfferingId === courseOfferingId;
    });
  }, [quiz, enrollments]);

  const startedSubmission = startData?.data ?? null;

  const currentQuestion = questions[currentIndex];

  const answeredCount = questions.filter(
    (question) =>
      answers[question._id] !== undefined &&
      String(answers[question._id]).trim() !== "",
  ).length;

  const isLoading = quizLoading || questionsLoading || enrollmentsLoading;

  /*
   * Start the quiz once the quiz and enrollment
   * have loaded.
   */
  useEffect(() => {
    if (!quiz || !enrollment || startedSubmission || isStarting || submitted) {
      return;
    }

    startQuiz({
      quiz: quiz._id,
      enrollment: enrollment._id,
    }).catch((error) => {
      console.error("Failed to start quiz:", error);
    });
  }, [quiz, enrollment, startedSubmission, isStarting, submitted, startQuiz]);

  /*
   * Countdown is based on the server-recorded
   * startedAt, not component mount time.
   */
  useEffect(() => {
    if (!startedSubmission?.startedAt || !quiz?.timeLimit || submitted) {
      return;
    }

    const startedAt = new Date(startedSubmission.startedAt).getTime();

    const deadline = startedAt + quiz.timeLimit * 60 * 1000;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));

      setRemainingSeconds(remaining);
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startedSubmission?.startedAt, quiz?.timeLimit, submitted]);

  const handleAnswerChange = (value) => {
    if (!currentQuestion) {
      return;
    }

    setAnswers((current) => ({
      ...current,
      [currentQuestion._id]: value,
    }));
  };

  const handlePrevious = () => {
    setCurrentIndex((current) => Math.max(current - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((current) => Math.min(current + 1, questions.length - 1));
  };

  const handleSubmit = async () => {
    if (
      !quiz ||
      !enrollment ||
      !startedSubmission ||
      isSubmitting ||
      submitted
    ) {
      return;
    }

    const submissionAnswers = questions.map((question) => ({
      question: question._id,
      answer: String(answers[question._id] ?? "").trim(),
    }));

    try {
      await createQuizSubmission({
        quiz: quiz._id,
        enrollment: enrollment._id,
        answers: submissionAnswers,
      }).unwrap();

      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }
  };

  /*
   * Automatically submit when timer reaches zero.
   */
  useEffect(() => {
    if (
      remainingSeconds === 0 &&
      startedSubmission &&
      !submitted &&
      !isSubmitting
    ) {
      handleSubmit();
    }
  }, [remainingSeconds, startedSubmission, submitted, isSubmitting]);

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading quiz...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Quiz not found</h1>

        <Button variant="outline" onClick={() => navigate("/app/quizzes")}>
          <ArrowLeft />
          Back to Quizzes
        </Button>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Quiz unavailable</h1>

        <p className="text-sm text-muted-foreground">
          You are not enrolled in this quiz's course offering.
        </p>

        <Button variant="outline" onClick={() => navigate("/app/quizzes")}>
          <ArrowLeft />
          Back to Quizzes
        </Button>
      </div>
    );
  }

  if (startError) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Unable to start quiz</h1>

        <p className="text-sm text-destructive">
          {startError?.data?.message ?? "The quiz could not be started."}
        </p>

        <Button variant="outline" onClick={() => navigate("/app/quizzes")}>
          <ArrowLeft />
          Back to Quizzes
        </Button>
      </div>
    );
  }

  if (isStarting || !startedSubmission) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Starting quiz...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-lg border p-8 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-12 w-12" />

          <h1 className="text-2xl font-semibold">Quiz Submitted</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Your answers have been submitted successfully.
          </p>

          <div className="mt-6">
            <Button onClick={() => navigate("/app/quizzes")}>
              Back to Quizzes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/app/quizzes")}
        >
          <ArrowLeft />
          Back to Quizzes
        </Button>

        <div>
          <h1 className="text-2xl font-semibold">{quiz.title}</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            This quiz does not have any questions yet.
          </p>
        </div>
      </div>
    );
  }

  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;

  const hasCurrentAnswer =
    String(answers[currentQuestion?._id] ?? "").trim() !== "";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/app/quizzes")}
          >
            <ArrowLeft />
            Back to Quizzes
          </Button>

          <div className="mt-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {quiz.title}
            </h1>

            <p className="text-sm text-muted-foreground">
              {answeredCount} of {questions.length} answered
            </p>
          </div>
        </div>

        {quiz.timeLimit && (
          <div
            className={`rounded-lg border px-4 py-3 text-right ${
              remainingSeconds !== null && remainingSeconds <= 60
                ? "border-destructive"
                : ""
            }`}
          >
            <p className="text-xs text-muted-foreground">Time remaining</p>

            <p className="font-mono text-lg font-semibold">
              {formatTime(remainingSeconds)}
            </p>
          </div>
        )}
      </div>

      {submitError && (
        <Alert variant="destructive">
          <AlertTitle>Submission failed</AlertTitle>

          <AlertDescription>
            {submitError?.data?.message ??
              "Unable to submit the quiz. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
        <p className="text-sm font-medium">
          Question {currentIndex + 1} of {questions.length}
        </p>

        <p className="text-sm text-muted-foreground">
          {currentQuestion.points}{" "}
          {currentQuestion.points === 1 ? "point" : "points"}
        </p>
      </div>

      <StudentQuizQuestion
        question={currentQuestion}
        answer={answers[currentQuestion._id] ?? ""}
        onAnswerChange={handleAnswerChange}
      />

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isFirstQuestion || isSubmitting}
          onClick={handlePrevious}
        >
          <ArrowLeft />
          Previous
        </Button>

        {isLastQuestion ? (
          <Button
            type="button"
            disabled={isSubmitting || !hasCurrentAnswer}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        ) : (
          <Button
            type="button"
            disabled={!hasCurrentAnswer || isSubmitting}
            onClick={handleNext}
          >
            Next
            <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
}
