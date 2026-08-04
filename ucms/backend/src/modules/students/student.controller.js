import * as studentService from "./student.service.js";
import sendResponse from "../../utils/sendResponse.js";

export const createStudent = async (req, res) => {
  const student = await studentService.createStudent(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Student created successfully.",
    data: student,
  });
};

export const getStudents = async (req, res) => {
  const result = await studentService.getStudents(req.query);

  sendResponse(res, {
    message: "Students retrieved successfully.",
    data: result.students,
    meta: result.meta,
  });
};

export const getStudentById = async (req, res) => {
  const student = await studentService.getStudentById(req.params.id);

  sendResponse(res, {
    message: "Student retrieved successfully.",
    data: student,
  });
};

export const updateStudent = async (req, res) => {
  const student = await studentService.updateStudent(req.params.id, req.body);

  sendResponse(res, {
    message: "Student updated successfully.",
    data: student,
  });
};

export const deleteStudent = async (req, res) => {
  await studentService.deleteStudent(req.params.id);

  sendResponse(res, {
    message: "Student deleted successfully.",
    data: null,
  });
};
