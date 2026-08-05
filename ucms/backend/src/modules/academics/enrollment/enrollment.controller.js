import * as enrollmentService from "./enrollment.service.js";
import sendResponse from "../../../utils/sendResponse.js";

export const createEnrollment = async (req, res) => {
  const enrollment = await enrollmentService.createEnrollment(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Enrollment created successfully.",
    data: enrollment,
  });
};

export const getEnrollments = async (req, res) => {
  const result = await enrollmentService.getEnrollments(req.query);

  sendResponse(res, {
    message: "Enrollments retrieved successfully.",
    data: result.enrollments,
    meta: result.meta,
  });
};

export const getEnrollmentById = async (req, res) => {
  const enrollment = await enrollmentService.getEnrollmentById(req.params.id);

  sendResponse(res, {
    message: "Enrollment retrieved successfully.",
    data: enrollment,
  });
};

export const updateEnrollment = async (req, res) => {
  const enrollment = await enrollmentService.updateEnrollment(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    message: "Enrollment updated successfully.",
    data: enrollment,
  });
};

export const deleteEnrollment = async (req, res) => {
  await enrollmentService.deleteEnrollment(req.params.id);

  sendResponse(res, {
    message: "Enrollment deleted successfully.",
    data: null,
  });
};
