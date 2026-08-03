import * as userService from "./user.service.js";
import sendResponse from "../../utils/sendResponse.js";

export const getMe = async (req, res) => {
  const user = await userService.getMe(req.user.id);

  sendResponse(res, {
    message: "User retrieved successfully.",
    data: user,
  });
};

export const getById = async (req, res) => {
  const user = await userService.getById(req.params.id);

  sendResponse(res, {
    message: "User retrieved successfully.",
    data: user,
  });
};

export const updateProfile = async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);

  sendResponse(res, {
    message: "Profile updated successfully.",
    data: user,
  });
};

export const getUsers = async (req, res) => {
  const result = await userService.getUsers(req.query);

  sendResponse(res, {
    message: "Users retrieved successfully.",
    data: result.users,
    meta: result.meta,
  });
};

export const updateStatus = async (req, res) => {
  const user = await userService.updateStatus(req.params.id, req.body.status);

  sendResponse(res, {
    message: "User status updated successfully.",
    data: user,
  });
};

export const updateRole = async (req, res) => {
  const user = await userService.updateRole(req.params.id, req.body.role);

  sendResponse(res, {
    message: "User role updated successfully.",
    data: user,
  });
};

export const deleteUser = async (req, res) => {
  await userService.deleteUser(req.params.id);

  sendResponse(res, {
    message: "User deleted successfully.",
    data: null,
  });
};
