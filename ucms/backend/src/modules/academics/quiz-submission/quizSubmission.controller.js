import * as quizSubmissionService from "./quizSubmission.service.js";
import sendResponse from "../../../utils/sendResponse.js";

export const createQuizSubmission = async (req, res) => {
  const submission = await quizSubmissionService.createQuizSubmission(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Quiz submission created successfully.",
    data: submission,
  });
};

export const getQuizSubmissions = async (req, res) => {
  const result = await quizSubmissionService.getQuizSubmissions(req.query);

  sendResponse(res, {
    message: "Quiz submissions retrieved successfully.",
    data: result.submissions,
    meta: result.meta,
  });
};

export const getQuizSubmissionById = async (req, res) => {
  const submission = await quizSubmissionService.getQuizSubmissionById(
    req.params.id,
  );

  sendResponse(res, {
    message: "Quiz submission retrieved successfully.",
    data: submission,
  });
};

export const updateQuizSubmission = async (req, res) => {
  const submission = await quizSubmissionService.updateQuizSubmission(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    message: "Quiz submission updated successfully.",
    data: submission,
  });
};

export const deleteQuizSubmission = async (req, res) => {
  await quizSubmissionService.deleteQuizSubmission(req.params.id);

  sendResponse(res, {
    message: "Quiz submission deleted successfully.",
    data: null,
  });
};
