import * as subjectService from "./subject.service.js";
import sendResponse from "../../../utils/sendResponse.js";

export const createSubject = async (req, res) => {
  const subject = await subjectService.createSubject(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Subject created successfully.",
    data: subject,
  });
};

export const getSubjects = async (req, res) => {
  const result = await subjectService.getSubjects(req.query);

  sendResponse(res, {
    message: "Subjects retrieved successfully.",
    data: result.subjects,
    meta: result.meta,
  });
};

export const getSubjectById = async (req, res) => {
  const subject = await subjectService.getSubjectById(req.params.id);

  sendResponse(res, {
    message: "Subject retrieved successfully.",
    data: subject,
  });
};

export const updateSubject = async (req, res) => {
  const subject = await subjectService.updateSubject(req.params.id, req.body);

  sendResponse(res, {
    message: "Subject updated successfully.",
    data: subject,
  });
};

export const deleteSubject = async (req, res) => {
  await subjectService.deleteSubject(req.params.id);

  sendResponse(res, {
    message: "Subject deleted successfully.",
    data: null,
  });
};
