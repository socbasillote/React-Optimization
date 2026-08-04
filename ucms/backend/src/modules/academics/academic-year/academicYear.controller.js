import * as academicYearService from "./academicYear.service.js";
import sendResponse from "../../../utils/sendResponse.js";

export const createAcademicYear = async (req, res) => {
  const academicYear = await academicYearService.createAcademicYear(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Academic year created successfully.",
    data: academicYear,
  });
};

export const getAcademicYears = async (req, res) => {
  const result = await academicYearService.getAcademicYears(req.query);

  sendResponse(res, {
    message: "Academic years retrieved successfully.",
    data: result.academicYears,
    meta: result.meta,
  });
};

export const getAcademicYearById = async (req, res) => {
  const academicYear = await academicYearService.getAcademicYearById(
    req.params.id,
  );

  sendResponse(res, {
    message: "Academic year retrieved successfully.",
    data: academicYear,
  });
};

export const updateAcademicYear = async (req, res) => {
  const academicYear = await academicYearService.updateAcademicYear(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    message: "Academic year updated successfully.",
    data: academicYear,
  });
};

export const deleteAcademicYear = async (req, res) => {
  await academicYearService.deleteAcademicYear(req.params.id);

  sendResponse(res, {
    message: "Academic year deleted successfully.",
    data: null,
  });
};
