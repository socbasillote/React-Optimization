import * as assignmentSubmissionService from "./assignmentSubmission.service.js";
import sendResponse from "../../../utils/sendResponse.js";

export const createAssignmentSubmission = async (req, res) => {
  const submission =
    await assignmentSubmissionService.createAssignmentSubmission(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Assignment submission created successfully.",
    data: submission,
  });
};

export const getAssignmentSubmissions = async (req, res) => {
  const result = await assignmentSubmissionService.getAssignmentSubmissions(
    req.query,
  );

  sendResponse(res, {
    message: "Assignment submissions retrieved successfully.",
    data: result.submissions,
    meta: result.meta,
  });
};

export const getAssignmentSubmissionById = async (req, res) => {
  const submission =
    await assignmentSubmissionService.getAssignmentSubmissionById(
      req.params.id,
    );

  sendResponse(res, {
    message: "Assignment submission retrieved successfully.",
    data: submission,
  });
};

export const updateAssignmentSubmission = async (req, res) => {
  if (payload.assignment !== undefined || payload.enrollment !== undefined) {
    throw new ApiError(
      400,
      "Assignment and enrollment cannot be changed after submission.",
    );
  }
  const submission =
    await assignmentSubmissionService.updateAssignmentSubmission(
      req.params.id,
      req.body,
    );

  sendResponse(res, {
    message: "Assignment submission updated successfully.",
    data: submission,
  });
};

export const deleteAssignmentSubmission = async (req, res) => {
  await assignmentSubmissionService.deleteAssignmentSubmission(req.params.id);

  sendResponse(res, {
    message: "Assignment submission deleted successfully.",
    data: null,
  });
};
