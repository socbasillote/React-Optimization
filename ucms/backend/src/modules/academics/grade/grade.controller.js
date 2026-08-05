import * as gradeService from "./grade.service.js";
import sendResponse from "../../../utils/sendResponse.js";

export const createGrade = async (req, res) => {
  const grade = await gradeService.createGrade(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Grade created successfully.",
    data: grade,
  });
};

export const getGrades = async (req, res) => {
  const result = await gradeService.getGrades(req.query);

  sendResponse(res, {
    message: "Grades retrieved successfully.",
    data: result.grades,
    meta: result.meta,
  });
};

export const getGradeById = async (req, res) => {
  const grade = await gradeService.getGradeById(req.params.id);

  sendResponse(res, {
    message: "Grade retrieved successfully.",
    data: grade,
  });
};

export const updateGrade = async (req, res) => {
  const grade = await gradeService.updateGrade(req.params.id, req.body);

  sendResponse(res, {
    message: "Grade updated successfully.",
    data: grade,
  });
};

export const deleteGrade = async (req, res) => {
  await gradeService.deleteGrade(req.params.id);

  sendResponse(res, {
    message: "Grade deleted successfully.",
    data: null,
  });
};
