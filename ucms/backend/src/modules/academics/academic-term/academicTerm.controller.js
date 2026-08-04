import * as academicTermService from "./academicTerm.service.js";
import sendResponse from "../../../utils/sendResponse.js";

export const createAcademicTerm = async (req, res) => {
  const academicTerm = await academicTermService.createAcademicTerm(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Academic term created successfully.",
    data: academicTerm,
  });
};

export const getAcademicTerms = async (req, res) => {
  const result = await academicTermService.getAcademicTerms(req.query);

  sendResponse(res, {
    message: "Academic terms retrieved successfully.",
    data: result.academicTerms,
    meta: result.meta,
  });
};

export const getAcademicTermById = async (req, res) => {
  const academicTerm = await academicTermService.getAcademicTermById(
    req.params.id,
  );

  sendResponse(res, {
    message: "Academic term retrieved successfully.",
    data: academicTerm,
  });
};

export const updateAcademicTerm = async (req, res) => {
  const academicTerm = await academicTermService.updateAcademicTerm(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    message: "Academic term updated successfully.",
    data: academicTerm,
  });
};

export const deleteAcademicTerm = async (req, res) => {
  await academicTermService.deleteAcademicTerm(req.params.id);

  sendResponse(res, {
    message: "Academic term deleted successfully.",
    data: null,
  });
};
