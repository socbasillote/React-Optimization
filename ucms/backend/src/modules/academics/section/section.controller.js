import * as sectionService from "./section.service.js";
import sendResponse from "../../../utils/sendResponse.js";

export const createSection = async (req, res) => {
  const section = await sectionService.createSection(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Section created successfully.",
    data: section,
  });
};

export const getSections = async (req, res) => {
  const result = await sectionService.getSections(req.query);

  sendResponse(res, {
    message: "Sections retrieved successfully.",
    data: result.sections,
    meta: result.meta,
  });
};

export const getSectionById = async (req, res) => {
  const section = await sectionService.getSectionById(req.params.id);

  sendResponse(res, {
    message: "Section retrieved successfully.",
    data: section,
  });
};

export const updateSection = async (req, res) => {
  const section = await sectionService.updateSection(req.params.id, req.body);

  sendResponse(res, {
    message: "Section updated successfully.",
    data: section,
  });
};

export const deleteSection = async (req, res) => {
  await sectionService.deleteSection(req.params.id);

  sendResponse(res, {
    message: "Section deleted successfully.",
    data: null,
  });
};
