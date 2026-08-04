import * as curriculumService from "./curriculum.service.js";
import sendResponse from "../../../utils/sendResponse.js";

export const createCurriculum = async (req, res) => {
  const curriculum = await curriculumService.createCurriculum(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Curriculum created successfully.",
    data: curriculum,
  });
};

export const getCurricula = async (req, res) => {
  const result = await curriculumService.getCurricula(req.query);

  sendResponse(res, {
    message: "Curricula retrieved successfully.",
    data: result.curricula,
    meta: result.meta,
  });
};

export const getCurriculumById = async (req, res) => {
  const curriculum = await curriculumService.getCurriculumById(req.params.id);

  sendResponse(res, {
    message: "Curriculum retrieved successfully.",
    data: curriculum,
  });
};

export const updateCurriculum = async (req, res) => {
  const curriculum = await curriculumService.updateCurriculum(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    message: "Curriculum updated successfully.",
    data: curriculum,
  });
};

export const deleteCurriculum = async (req, res) => {
  await curriculumService.deleteCurriculum(req.params.id);

  sendResponse(res, {
    message: "Curriculum deleted successfully.",
    data: null,
  });
};
