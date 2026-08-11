import * as gradeService from "./grade.service.js";
import sendResponse from "../../../utils/sendResponse.js";
import * as studentService from "../../students/student.service.js";
import { ROLES } from "../../../constants/roles.js";

export const createGrade = async (req, res) => {
  const grade = await gradeService.createGrade(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Grade created successfully.",
    data: grade,
  });
};

export const getGrades = async (req, res) => {
  let studentId;

  if (req.user.role === ROLES.STUDENT) {
    const student = await studentService.getCurrentStudent(req.user.id);

    studentId = student._id;
  }

  const result = await gradeService.getGrades({
    ...req.query,
    studentId,
    userRole: req.user.role,
  });

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
