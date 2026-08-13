import * as quizSubmissionService from "./quizSubmission.service.js";

import sendResponse from "../../../utils/sendResponse.js";

import * as studentService from "../../students/student.service.js";

import { ROLES } from "../../../constants/roles.js";

import ApiError from "../../../utils/ApiError.js";

export const createQuizSubmission = async (req, res) => {
  let studentId;

  if (req.user.role === ROLES.STUDENT) {
    const student = await studentService.getCurrentStudent(req.user.id);

    console.log("===== CURRENT STUDENT =====");
    console.log("userId:", req.user.id);
    console.log("student:", student);

    studentId = student?._id;

    console.log("studentId:", studentId);
  }

  console.log("===== QUIZ SUBMISSION AUTH =====");
  console.log("req.user:", req.user);

  const submission = await quizSubmissionService.createQuizSubmission({
    payload: req.body,
    userId: req.user.id,
    studentId,
    userRole: req.user.role,
  });

  sendResponse(res, {
    statusCode: 201,
    message: "Quiz submission created successfully.",
    data: submission,
  });
};

export const getQuizSubmissions = async (req, res) => {
  let studentId;

  if (req.user.role === ROLES.STUDENT) {
    const student = await studentService.getCurrentStudent(req.user.id);

    studentId = student._id;
  }

  const result = await quizSubmissionService.getQuizSubmissions({
    ...req.query,
    studentId,
    userRole: req.user.role,
    userId: req.user.id,
  });

  sendResponse(res, {
    message: "Quiz submissions retrieved successfully.",
    data: result.submissions,
    meta: result.meta,
  });
};

export const getQuizSubmissionById = async (req, res) => {
  let studentId;

  if (req.user.role === ROLES.STUDENT) {
    const student = await studentService.getCurrentStudent(req.user.id);

    if (!student) {
      throw new ApiError(404, "Student profile not found.");
    }

    studentId = student._id;
  }

  const submission = await quizSubmissionService.getQuizSubmissionById(
    req.params.id,
    {
      studentId,
      userRole: req.user.role,
      userId: req.user.id,
    },
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
    {
      userRole: req.user.role,
      userId: req.user.id,
    },
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

export const startQuiz = async (req, res) => {
  const submission = await quizSubmissionService.startQuiz({
    quizId: req.body.quiz,
    enrollmentId: req.body.enrollment,
    userId: req.user.id,
    userRole: req.user.role,
  });

  sendResponse(res, {
    statusCode: 201,
    message: "Quiz started successfully.",
    data: submission,
  });
};
