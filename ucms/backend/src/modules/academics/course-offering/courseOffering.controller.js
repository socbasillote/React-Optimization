import * as courseOfferingService from "./courseOffering.service.js";
import sendResponse from "../../../utils/sendResponse.js";

export const createCourseOffering = async (req, res) => {
  const courseOffering = await courseOfferingService.createCourseOffering(
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    message: "Course offering created successfully.",
    data: courseOffering,
  });
};

export const getCourseOfferings = async (req, res) => {
  const result = await courseOfferingService.getCourseOfferings(req.query);

  sendResponse(res, {
    message: "Course offerings retrieved successfully.",
    data: result.courseOfferings,
    meta: result.meta,
  });
};

export const getCourseOfferingById = async (req, res) => {
  const courseOffering = await courseOfferingService.getCourseOfferingById(
    req.params.id,
  );

  sendResponse(res, {
    message: "Course offering retrieved successfully.",
    data: courseOffering,
  });
};

export const updateCourseOffering = async (req, res) => {
  const courseOffering = await courseOfferingService.updateCourseOffering(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    message: "Course offering updated successfully.",
    data: courseOffering,
  });
};

export const deleteCourseOffering = async (req, res) => {
  await courseOfferingService.deleteCourseOffering(req.params.id);

  sendResponse(res, {
    message: "Course offering deleted successfully.",
    data: null,
  });
};
