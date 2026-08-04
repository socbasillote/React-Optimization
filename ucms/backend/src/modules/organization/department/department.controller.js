import * as departmentService from "./department.service.js";
import sendResponse from "../../../utils/sendResponse.js";

export const createDepartment = async (req, res) => {
  const department = await departmentService.createDepartment(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Department created successfully.",
    data: department,
  });
};

export const getDepartments = async (req, res) => {
  const result = await departmentService.getDepartments(req.query);

  sendResponse(res, {
    message: "Departments retrieved successfully.",
    data: result.departments,
    meta: result.meta,
  });
};

export const getDepartmentById = async (req, res) => {
  const department = await departmentService.getDepartmentById(req.params.id);

  sendResponse(res, {
    message: "Department retrieved successfully.",
    data: department,
  });
};

export const updateDepartment = async (req, res) => {
  const department = await departmentService.updateDepartment(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    message: "Department updated successfully.",
    data: department,
  });
};

export const deleteDepartment = async (req, res) => {
  await departmentService.deleteDepartment(req.params.id);

  sendResponse(res, {
    message: "Department deleted successfully.",
    data: null,
  });
};
