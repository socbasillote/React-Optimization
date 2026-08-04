import * as programService from "./program.service.js";
import sendResponse from "../../../utils/sendResponse.js";

export const createProgram = async (req, res) => {
  const program = await programService.createProgram(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Program created successfully.",
    data: program,
  });
};

export const getPrograms = async (req, res) => {
  const result = await programService.getPrograms(req.query);

  sendResponse(res, {
    message: "Programs retrieved successfully.",
    data: result.programs,
    meta: result.meta,
  });
};

export const getProgramById = async (req, res) => {
  const program = await programService.getProgramById(req.params.id);

  sendResponse(res, {
    message: "Program retrieved successfully.",
    data: program,
  });
};

export const updateProgram = async (req, res) => {
  const program = await programService.updateProgram(req.params.id, req.body);

  sendResponse(res, {
    message: "Program updated successfully.",
    data: program,
  });
};

export const deleteProgram = async (req, res) => {
  await programService.deleteProgram(req.params.id);

  sendResponse(res, {
    message: "Program deleted successfully.",
    data: null,
  });
};
