import ApiError from "../../../utils/ApiError.js";

import Quiz from "../quiz/quiz.model.js";
import QuizSubmission from "./quizSubmission.model.js";
import Enrollment from "../enrollment/enrollment.model.js";

import { ENROLLMENT_STATUS } from "../../../constants/enrollmentStatus.js";

export const createQuizSubmission = async (payload) => {
  const quiz = await Quiz.findById(payload.quiz);

  if (!quiz) {
    throw new ApiError(404, "Quiz not found.");
  }

  const enrollment = await Enrollment.findById(payload.enrollment);

  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found.");
  }

  if (enrollment.status === ENROLLMENT_STATUS.DROPPED) {
    throw new ApiError(400, "Cannot submit using a dropped enrollment.");
  }

  if (enrollment.courseOffering.toString() !== quiz.courseOffering.toString()) {
    throw new ApiError(
      400,
      "Enrollment does not belong to this course offering.",
    );
  }

  const duplicate = await QuizSubmission.findOne({
    quiz: payload.quiz,
    enrollment: payload.enrollment,
  });

  if (duplicate) {
    throw new ApiError(409, "Quiz has already been submitted.");
  }

  const startedAt = payload.startedAt ?? new Date();

  const submittedAt = payload.submittedAt ?? startedAt;

  if (startedAt < quiz.availableFrom) {
    throw new ApiError(400, "Quiz has not opened yet.");
  }

  if (submittedAt < startedAt) {
    throw new ApiError(400, "Submission time cannot be before the start time.");
  }

  if (payload.score !== undefined && payload.score > quiz.maxScore) {
    throw new ApiError(400, `Score cannot exceed ${quiz.maxScore}.`);
  }

  return QuizSubmission.create({
    ...payload,
    startedAt,
    submittedAt,
  });
};

export const getQuizSubmissions = async ({
  page = 1,
  limit = 10,
  quiz,
  enrollment,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (quiz) filter.quiz = quiz;
  if (enrollment) filter.enrollment = enrollment;

  const skip = (page - 1) * limit;

  const [submissions, total] = await Promise.all([
    QuizSubmission.find(filter)
      .populate({
        path: "quiz",
        select: "title maxScore availableFrom dueDate timeLimit",
      })
      .populate({
        path: "enrollment",
        populate: {
          path: "student",
          populate: {
            path: "user",
            select: "firstName lastName email",
          },
        },
      })
      .sort({
        submittedAt: -1,
      })
      .skip(skip)
      .limit(limit),

    QuizSubmission.countDocuments(filter),
  ]);

  return {
    submissions,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getQuizSubmissionById = async (id) => {
  const submission = await QuizSubmission.findById(id)
    .populate({
      path: "quiz",
    })
    .populate({
      path: "enrollment",
      populate: {
        path: "student",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      },
    });

  if (!submission) {
    throw new ApiError(404, "Quiz submission not found.");
  }

  return submission;
};

export const updateQuizSubmission = async (id, payload) => {
  const submission = await QuizSubmission.findById(id);

  if (!submission) {
    throw new ApiError(404, "Quiz submission not found.");
  }

  if (payload.quiz !== undefined || payload.enrollment !== undefined) {
    throw new ApiError(
      400,
      "Quiz and enrollment cannot be changed after submission.",
    );
  }

  const quiz = await Quiz.findById(submission.quiz);

  if (payload.startedAt && payload.startedAt < quiz.availableFrom) {
    throw new ApiError(400, "Quiz has not opened yet.");
  }

  if (payload.startedAt || payload.submittedAt) {
    const startedAt = payload.startedAt ?? submission.startedAt;

    const submittedAt = payload.submittedAt ?? submission.submittedAt;

    if (submittedAt < startedAt) {
      throw new ApiError(
        400,
        "Submission time cannot be before the start time.",
      );
    }
  }

  if (payload.score !== undefined && payload.score > quiz.maxScore) {
    throw new ApiError(400, `Score cannot exceed ${quiz.maxScore}.`);
  }

  Object.assign(submission, payload);

  await submission.save();

  return getQuizSubmissionById(submission.id);
};

export const deleteQuizSubmission = async (id) => {
  const submission = await QuizSubmission.findById(id);

  if (!submission) {
    throw new ApiError(404, "Quiz submission not found.");
  }

  await submission.deleteOne();
};
