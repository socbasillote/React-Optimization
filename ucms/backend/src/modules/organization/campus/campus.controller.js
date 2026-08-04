import * as campusService from "./campus.service.js";
import sendResponse from "../../../utils/sendResponse.js";

export const createCampus = async (req, res) => {
  const campus = await campusService.createCampus(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Campus created successfully.",
    data: campus,
  });
};

export const getCampuses = async (req, res) => {
  const result = await campusService.getCampuses(req.query);

  sendResponse(res, {
    message: "Campuses retrieved successfully.",
    data: result.campuses,
    meta: result.meta,
  });
};

export const getCampusById = async (req, res) => {
  const campus = await campusService.getCampusById(req.params.id);

  sendResponse(res, {
    message: "Campus retrieved successfully.",
    data: campus,
  });
};

export const updateCampus = async (req, res) => {
  const campus = await campusService.updateCampus(req.params.id, req.body);

  sendResponse(res, {
    message: "Campus updated successfully.",
    data: campus,
  });
};

export const deleteCampus = async (req, res) => {
  await campusService.deleteCampus(req.params.id);

  sendResponse(res, {
    message: "Campus deleted successfully.",
    data: null,
  });
};
