import * as assignmentService from "./assignment.service.js";
import sendResponse from "../../../utils/sendResponse.js";

import * as studentService from "../../students/student.service.js";

import { ROLES } from "../../../constants/roles.js";

export const createAssignment = async (req, res) => {
  const assignment = await assignmentService.createAssignment(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Assignment created successfully.",
    data: assignment,
  });
};

export const getAssignments = async (req, res) => {
  let studentId;

  if (req.user.role === ROLES.STUDENT) {
    const student = await studentService.getCurrentStudent(req.user.id);

    studentId = student._id;
  }

  const result = await assignmentService.getAssignments({
    ...req.query,
    studentId,
    userRole: req.user.role,
  });

  sendResponse(res, {
    message: "Assignments retrieved successfully.",
    data: result.assignments,
    meta: result.meta,
  });
};

export const getAssignmentById = async (req, res) => {
  const assignment = await assignmentService.getAssignmentById(req.params.id);

  sendResponse(res, {
    message: "Assignment retrieved successfully.",
    data: assignment,
  });
};

export const updateAssignment = async (req, res) => {
  const assignment = await assignmentService.updateAssignment(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    message: "Assignment updated successfully.",
    data: assignment,
  });
};

export const deleteAssignment = async (req, res) => {
  await assignmentService.deleteAssignment(req.params.id);

  sendResponse(res, {
    message: "Assignment deleted successfully.",
    data: null,
  });
};
