import * as attendanceService from "./attendance.service.js";
import sendResponse from "../../../utils/sendResponse.js";

export const createAttendance = async (req, res) => {
  const attendance = await attendanceService.createAttendance(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Attendance recorded successfully.",
    data: attendance,
  });
};

export const getAttendances = async (req, res) => {
  const result = await attendanceService.getAttendances(req.query);

  sendResponse(res, {
    message: "Attendances retrieved successfully.",
    data: result.attendances,
    meta: result.meta,
  });
};

export const getAttendanceById = async (req, res) => {
  const attendance = await attendanceService.getAttendanceById(req.params.id);

  sendResponse(res, {
    message: "Attendance retrieved successfully.",
    data: attendance,
  });
};

export const updateAttendance = async (req, res) => {
  const attendance = await attendanceService.updateAttendance(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    message: "Attendance updated successfully.",
    data: attendance,
  });
};

export const deleteAttendance = async (req, res) => {
  await attendanceService.deleteAttendance(req.params.id);

  sendResponse(res, {
    message: "Attendance deleted successfully.",
    data: null,
  });
};
