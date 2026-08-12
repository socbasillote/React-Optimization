import * as quizQuestionService from "./quizQuestion.service.js";
import * as studentService from "../../students/student.service.js";

import sendResponse from "../../../utils/sendResponse.js";

import { ROLES } from "../../../constants/roles.js";

export const createQuizQuestion = async (req, res) => {
  const question = await quizQuestionService.createQuizQuestion(req.body, {
    userId: req.user.id,
    userRole: req.user.role,
  });

  sendResponse(res, {
    statusCode: 201,
    message: "Quiz question created successfully.",
    data: question,
  });
};

export const getQuizQuestions = async (req, res) => {
  const includeAnswers =
    req.user.role === ROLES.FACULTY ||
    req.user.role === ROLES.ADMIN ||
    req.user.role === ROLES.SUPER_ADMIN;

  let studentId;

  if (req.user.role === ROLES.STUDENT) {
    const student = await studentService.getCurrentStudent(req.user.id);

    studentId = student._id;
  }

  const result = await quizQuestionService.getQuizQuestions({
    ...req.query,
    includeAnswers,
    userId: req.user.id,
    userRole: req.user.role,
    studentId,
  });

  sendResponse(res, {
    message: "Quiz questions retrieved successfully.",
    data: result.questions,
    meta: result.meta,
  });
};
export const getQuizQuestionById = async (req, res) => {
  const includeAnswer =
    req.user.role === ROLES.FACULTY ||
    req.user.role === ROLES.ADMIN ||
    req.user.role === ROLES.SUPER_ADMIN;

  let studentId;

  if (req.user.role === ROLES.STUDENT) {
    const student = await studentService.getCurrentStudent(req.user.id);

    studentId = student._id;
  }

  const question = await quizQuestionService.getQuizQuestionById(
    req.params.id,
    {
      includeAnswer,
      userId: req.user.id,
      userRole: req.user.role,
      studentId,
    },
  );

  sendResponse(res, {
    message: "Quiz question retrieved successfully.",
    data: question,
  });
};

export const updateQuizQuestion = async (req, res) => {
  const question = await quizQuestionService.updateQuizQuestion(
    req.params.id,
    req.body,
    {
      userId: req.user.id,
      userRole: req.user.role,
    },
  );

  sendResponse(res, {
    message: "Quiz question updated successfully.",
    data: question,
  });
};

export const deleteQuizQuestion = async (req, res) => {
  await quizQuestionService.deleteQuizQuestion(req.params.id, {
    userId: req.user.id,
    userRole: req.user.role,
  });

  sendResponse(res, {
    message: "Quiz question deleted successfully.",
    data: null,
  });
};
