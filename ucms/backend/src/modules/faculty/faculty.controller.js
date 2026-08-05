import * as facultyService from "./faculty.service.js";
import sendResponse from "../../utils/sendResponse.js";

export const createFaculty = async (req, res) => {
  const faculty = await facultyService.createFaculty(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Faculty created successfully.",
    data: faculty,
  });
};

export const getFaculties = async (req, res) => {
  const result = await facultyService.getFaculties(req.query);

  sendResponse(res, {
    message: "Faculties retrieved successfully.",
    data: result.faculties,
    meta: result.meta,
  });
};

export const getFacultyById = async (req, res) => {
  const faculty = await facultyService.getFacultyById(req.params.id);

  sendResponse(res, {
    message: "Faculty retrieved successfully.",
    data: faculty,
  });
};

export const updateFaculty = async (req, res) => {
  const faculty = await facultyService.updateFaculty(req.params.id, req.body);

  sendResponse(res, {
    message: "Faculty updated successfully.",
    data: faculty,
  });
};

export const deleteFaculty = async (req, res) => {
  await facultyService.deleteFaculty(req.params.id);

  sendResponse(res, {
    message: "Faculty deleted successfully.",
    data: null,
  });
};
