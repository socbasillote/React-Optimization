import * as assignmentSubmissionService from "./assignmentSubmission.service.js";

import sendResponse from "../../../utils/sendResponse.js";

import { ROLES } from "../../../constants/roles.js";
import * as studentService from "../../students/student.service.js";

export const createAssignmentSubmission = async (req, res) => {
  let studentId;

  if (req.user.role === ROLES.STUDENT) {
    const student = await studentService.getCurrentStudent(req.user.id);

    studentId = student._id;
  }

  const submission =
    await assignmentSubmissionService.createAssignmentSubmission({
      payload: req.body,
      userRole: req.user.role,
      studentId,
    });

  sendResponse(res, {
    statusCode: 201,
    message: "Assignment submission created successfully.",
    data: submission,
  });
};

export const getAssignmentSubmissions = async (req, res) => {
  let studentId;

  if (req.user.role === ROLES.STUDENT) {
    const student = await studentService.getCurrentStudent(req.user.id);

    studentId = student._id;
  }

  const result = await assignmentSubmissionService.getAssignmentSubmissions({
    ...req.query,
    studentId,
    userRole: req.user.role,
    userId: req.user.id,
  });

  sendResponse(res, {
    message: "Assignment submissions retrieved successfully.",
    data: result.submissions,
    meta: result.meta,
  });
};

export const getAssignmentSubmissionById = async (req, res) => {
  let studentId;

  if (req.user.role === ROLES.STUDENT) {
    const student = await studentService.getCurrentStudent(req.user.id);

    studentId = student._id;
  }

  const submission =
    await assignmentSubmissionService.getAssignmentSubmissionById(
      req.params.id,
      {
        studentId: undefined,
        userRole: req.user.role,
        userId: req.user.id,
      },
    );

  sendResponse(res, {
    message: "Assignment submission retrieved successfully.",
    data: submission,
  });
};

export const updateAssignmentSubmission = async (req, res) => {
  const submission =
    await assignmentSubmissionService.updateAssignmentSubmission(
      req.params.id,
      req.body,
      {
        userRole: req.user.role,
        userId: req.user.id,
      },
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
export const getMyAssignmentSubmission = async (req, res) => {
  const student = await studentService.getCurrentStudent(req.user.id);

  const submission =
    await assignmentSubmissionService.getMyAssignmentSubmission(
      req.params.assignmentId,
      {
        studentId: student._id,
        userRole: req.user.role,
      },
    );

  sendResponse(res, {
    message: "Assignment submission retrieved successfully.",
    data: submission,
  });
};

export const getMyAssignmentSubmissions = async (req, res) => {
  const student = await studentService.getCurrentStudent(req.user.id);

  const result = await assignmentSubmissionService.getMyAssignmentSubmissions({
    studentId: student._id,
    page: req.query.page,
    limit: req.query.limit,
  });

  sendResponse(res, {
    message: "Your assignment submissions retrieved successfully.",
    data: result.submissions,
    meta: result.meta,
  });
};
