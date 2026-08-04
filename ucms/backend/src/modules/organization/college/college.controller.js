import * as collegeService from "./college.service.js";
import sendResponse from "../../../utils/sendResponse.js";

export const createCollege = async (req, res) => {
  const college = await collegeService.createCollege(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "College created successfully.",
    data: college,
  });
};

export const getColleges = async (req, res) => {
  const result = await collegeService.getColleges(req.query);

  sendResponse(res, {
    message: "Colleges retrieved successfully.",
    data: result.colleges,
    meta: result.meta,
  });
};

export const getCollegeById = async (req, res) => {
  const college = await collegeService.getCollegeById(req.params.id);

  sendResponse(res, {
    message: "College retrieved successfully.",
    data: college,
  });
};

export const updateCollege = async (req, res) => {
  const college = await collegeService.updateCollege(req.params.id, req.body);

  sendResponse(res, {
    message: "College updated successfully.",
    data: college,
  });
};

export const deleteCollege = async (req, res) => {
  await collegeService.deleteCollege(req.params.id);

  sendResponse(res, {
    message: "College deleted successfully.",
    data: null,
  });
};
