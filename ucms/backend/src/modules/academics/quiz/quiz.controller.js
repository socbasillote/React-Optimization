import * as quizService from "./quiz.service.js";
import sendResponse from "../../../utils/sendResponse.js";

export const createQuiz = async (req, res) => {
  const quiz = await quizService.createQuiz(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Quiz created successfully.",
    data: quiz,
  });
};

export const getQuizzes = async (req, res) => {
  const result = await quizService.getQuizzes(req.query);

  sendResponse(res, {
    message: "Quizzes retrieved successfully.",
    data: result.quizzes,
    meta: result.meta,
  });
};

export const getQuizById = async (req, res) => {
  const quiz = await quizService.getQuizById(req.params.id);

  sendResponse(res, {
    message: "Quiz retrieved successfully.",
    data: quiz,
  });
};

export const updateQuiz = async (req, res) => {
  const quiz = await quizService.updateQuiz(req.params.id, req.body);

  sendResponse(res, {
    message: "Quiz updated successfully.",
    data: quiz,
  });
};

export const deleteQuiz = async (req, res) => {
  await quizService.deleteQuiz(req.params.id);

  sendResponse(res, {
    message: "Quiz deleted successfully.",
    data: null,
  });
};
