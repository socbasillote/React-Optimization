import ApiError from "../../../utils/ApiError.js";

import Quiz from "../quiz/quiz.model.js";
import QuizQuestion from "./quizQuestion.model.js";
import Enrollment from "../enrollment/enrollment.model.js";
import Faculty from "../../faculty/faculty.model.js";

import CourseOffering from "../course-offering/courseOffering.model.js";

import { ROLES } from "../../../constants/roles.js";

const getId = (value) => {
  if (!value) {
    return null;
  }

  return typeof value === "object" ? value._id : value;
};

const ensureStudentCanAccessQuiz = async (quizId, studentId) => {
  const quiz = await Quiz.findById(quizId).select("courseOffering");

  if (!quiz) {
    throw new ApiError(404, "Quiz not found.");
  }

  const enrollment = await Enrollment.findOne({
    student: studentId,
    courseOffering: quiz.courseOffering,
  }).select("_id status");

  if (!enrollment) {
    throw new ApiError(403, "You are not enrolled in this course offering.");
  }

  return quiz;
};

const ensureFacultyOwnsQuiz = async (quizId, userId) => {
  const faculty = await Faculty.findOne({
    user: userId,
  }).select("_id");

  if (!faculty) {
    throw new ApiError(404, "Faculty profile not found.");
  }

  const quiz = await Quiz.findById(quizId).select("courseOffering");

  if (!quiz) {
    throw new ApiError(404, "Quiz not found.");
  }

  const courseOffering = await CourseOffering.findById(
    quiz.courseOffering,
  ).select("faculty");

  if (!courseOffering) {
    throw new ApiError(404, "Course offering not found.");
  }

  const courseOfferingFacultyId = getId(courseOffering.faculty);

  if (
    !courseOfferingFacultyId ||
    courseOfferingFacultyId.toString() !== faculty._id.toString()
  ) {
    throw new ApiError(
      403,
      "You cannot manage questions for a quiz outside your course offerings.",
    );
  }

  return {
    faculty,
    quiz,
    courseOffering,
  };
};

export const createQuizQuestion = async (payload, { userId, userRole }) => {
  const quiz = await Quiz.findById(payload.quiz);

  if (!quiz) {
    throw new ApiError(404, "Quiz not found.");
  }

  if (userRole === ROLES.FACULTY) {
    await ensureFacultyOwnsQuiz(payload.quiz, userId);
  }

  const existingQuestion = await QuizQuestion.findOne({
    quiz: payload.quiz,
    order: payload.order,
  });

  if (existingQuestion) {
    throw new ApiError(
      409,
      "A question with this order already exists in the quiz.",
    );
  }

  return QuizQuestion.create(payload);
};

export const getQuizQuestions = async ({
  quiz,
  page = 1,
  limit = 100,
  includeAnswers = false,
  userId,
  userRole,
  studentId,
}) => {
  page = Number(page);
  limit = Number(limit);

  if (!quiz) {
    throw new ApiError(400, "Quiz is required.");
  }

  if (userRole === ROLES.STUDENT) {
    if (!studentId) {
      throw new ApiError(404, "Student profile not found.");
    }

    await ensureStudentCanAccessQuiz(quiz, studentId);
  }

  if (userRole === ROLES.FACULTY) {
    await ensureFacultyOwnsQuiz(quiz, userId);
  }

  const filter = {};

  if (quiz) {
    filter.quiz = quiz;
  }

  let query = QuizQuestion.find(filter)
    .populate({
      path: "quiz",
      select: "title maxScore availableFrom dueDate timeLimit",
    })
    .sort({
      order: 1,
    })
    .skip((page - 1) * limit)
    .limit(limit);

  if (!includeAnswers) {
    query = query.select("-correctAnswer");
  }

  const [questions, total] = await Promise.all([
    query,
    QuizQuestion.countDocuments(filter),
  ]);

  return {
    questions,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getQuizQuestionById = async (
  id,
  { includeAnswer = false, userId, userRole, studentId } = {},
) => {
  let query = QuizQuestion.findById(id).populate({
    path: "quiz",
    select: "title maxScore availableFrom dueDate timeLimit",
  });

  if (!includeAnswer) {
    query = query.select("-correctAnswer");
  }

  const question = await query;

  if (!question) {
    throw new ApiError(404, "Quiz question not found.");
  }

  if (userRole === ROLES.STUDENT) {
    if (!studentId) {
      throw new ApiError(404, "Student profile not found.");
    }

    await ensureStudentCanAccessQuiz(question.quiz._id, studentId);
  }

  if (userRole === ROLES.FACULTY) {
    await ensureFacultyOwnsQuiz(question.quiz._id, userId);
  }

  return question;
};

export const updateQuizQuestion = async (id, payload, { userId, userRole }) => {
  const question = await QuizQuestion.findById(id);

  if (!question) {
    throw new ApiError(404, "Quiz question not found.");
  }

  if (userRole === ROLES.FACULTY) {
    await ensureFacultyOwnsQuiz(question.quiz, userId);
  }

  if (payload.order !== undefined) {
    const duplicate = await QuizQuestion.findOne({
      _id: { $ne: id },
      quiz: question.quiz,
      order: payload.order,
    });

    if (duplicate) {
      throw new ApiError(
        409,
        "A question with this order already exists in the quiz.",
      );
    }
  }

  Object.assign(question, payload);

  await question.save();

  return QuizQuestion.findById(question.id).populate({
    path: "quiz",
    select: "title maxScore availableFrom dueDate timeLimit",
  });
};

export const deleteQuizQuestion = async (id, { userId, userRole }) => {
  const question = await QuizQuestion.findById(id);

  if (!question) {
    throw new ApiError(404, "Quiz question not found.");
  }

  if (userRole === ROLES.FACULTY) {
    await ensureFacultyOwnsQuiz(question.quiz, userId);
  }

  await question.deleteOne();
};
