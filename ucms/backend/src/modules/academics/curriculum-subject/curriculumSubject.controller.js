import * as curriculumSubjectService from "./curriculumSubject.service.js";
import sendResponse from "../../../utils/sendResponse.js";

export const createCurriculumSubject = async (req, res) => {
  const curriculumSubject =
    await curriculumSubjectService.createCurriculumSubject(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Curriculum subject created successfully.",
    data: curriculumSubject,
  });
};

export const getCurriculumSubjects = async (req, res) => {
  const result = await curriculumSubjectService.getCurriculumSubjects(
    req.query,
  );

  sendResponse(res, {
    message: "Curriculum subjects retrieved successfully.",
    data: result.curriculumSubjects,
    meta: result.meta,
  });
};

export const getCurriculumSubjectById = async (req, res) => {
  const curriculumSubject =
    await curriculumSubjectService.getCurriculumSubjectById(req.params.id);

  sendResponse(res, {
    message: "Curriculum subject retrieved successfully.",
    data: curriculumSubject,
  });
};

export const updateCurriculumSubject = async (req, res) => {
  const curriculumSubject =
    await curriculumSubjectService.updateCurriculumSubject(
      req.params.id,
      req.body,
    );

  sendResponse(res, {
    message: "Curriculum subject updated successfully.",
    data: curriculumSubject,
  });
};

export const deleteCurriculumSubject = async (req, res) => {
  await curriculumSubjectService.deleteCurriculumSubject(req.params.id);

  sendResponse(res, {
    message: "Curriculum subject deleted successfully.",
    data: null,
  });
};
