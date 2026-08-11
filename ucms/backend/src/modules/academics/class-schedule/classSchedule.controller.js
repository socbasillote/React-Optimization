import * as classScheduleService from "./classSchedule.service.js";
import sendResponse from "../../../utils/sendResponse.js";

import ApiError from "../../../utils/ApiError.js";

import * as studentService from "../../students/student.service.js";

import { ROLES } from "../../../constants/roles.js";

export const createClassSchedule = async (req, res) => {
  const classSchedule = await classScheduleService.createClassSchedule(
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    message: "Class schedule created successfully.",
    data: classSchedule,
  });
};

export const getClassSchedules = async (req, res) => {
  let studentId = null;

  if (req.user.role === ROLES.STUDENT) {
    const student = await studentService.getCurrentStudent(req.user.id);

    studentId = student._id;
  }

  const result = await classScheduleService.getClassSchedules({
    ...req.query,
    studentId,
    userRole: req.user.role,
  });

  sendResponse(res, {
    message: "Class schedules retrieved successfully.",
    data: result.classSchedules,
    meta: result.meta,
  });
};

export const getClassScheduleById = async (req, res) => {
  const classSchedule = await classScheduleService.getClassScheduleById(
    req.params.id,
  );

  sendResponse(res, {
    message: "Class schedule retrieved successfully.",
    data: classSchedule,
  });
};

export const updateClassSchedule = async (req, res) => {
  const classSchedule = await classScheduleService.updateClassSchedule(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    message: "Class schedule updated successfully.",
    data: classSchedule,
  });
};

export const deleteClassSchedule = async (req, res) => {
  await classScheduleService.deleteClassSchedule(req.params.id);

  sendResponse(res, {
    message: "Class schedule deleted successfully.",
    data: null,
  });
};
