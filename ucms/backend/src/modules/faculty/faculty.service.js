import ApiError from "../../utils/ApiError.js";

import Faculty from "./faculty.model.js";

import User from "../users/user.model.js";
import Department from "../organization/department/department.model.js";

import { ROLES } from "../../constants/roles.js";

export const createFaculty = async (payload) => {
  const user = await User.findById(payload.user);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.role !== ROLES.FACULTY) {
    throw new ApiError(400, "User must have the FACULTY role.");
  }

  const existing = await Faculty.findOne({
    $or: [{ user: payload.user }, { employeeId: payload.employeeId }],
  });

  if (existing) {
    throw new ApiError(409, "Faculty already exists.");
  }

  const department = await Department.findById(payload.department);

  if (!department) {
    throw new ApiError(404, "Department not found.");
  }

  return Faculty.create(payload);
};

export const getFaculties = async ({
  page = 1,
  limit = 10,
  search = "",
  department,
  status,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (department) filter.department = department;
  if (status) filter.status = status;

  if (search) {
    filter.employeeId = {
      $regex: search,
      $options: "i",
    };
  }

  const skip = (page - 1) * limit;

  const [faculties, total] = await Promise.all([
    Faculty.find(filter)
      .populate("user", "firstName middleName lastName email")
      .populate("department", "name code")
      .sort({ employeeId: 1 })
      .skip(skip)
      .limit(limit),

    Faculty.countDocuments(filter),
  ]);

  return {
    faculties,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getFacultyById = async (id) => {
  const faculty = await Faculty.findById(id)
    .populate("user", "firstName middleName lastName email phone avatar")
    .populate("department", "name code");

  if (!faculty) {
    throw new ApiError(404, "Faculty not found.");
  }

  return faculty;
};

export const updateFaculty = async (id, payload) => {
  const faculty = await Faculty.findById(id);

  if (!faculty) {
    throw new ApiError(404, "Faculty not found.");
  }

  const userId = payload.user || faculty.user;
  const employeeId = payload.employeeId || faculty.employeeId;

  if (payload.user || payload.employeeId) {
    const duplicate = await Faculty.findOne({
      _id: { $ne: id },
      $or: [{ user: userId }, { employeeId }],
    });

    if (duplicate) {
      throw new ApiError(409, "Faculty already exists.");
    }
  }

  if (payload.user) {
    const user = await User.findById(payload.user);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    if (user.role !== ROLES.FACULTY) {
      throw new ApiError(400, "User must have the FACULTY role.");
    }
  }

  if (payload.department) {
    const department = await Department.findById(payload.department);

    if (!department) {
      throw new ApiError(404, "Department not found.");
    }
  }

  Object.assign(faculty, payload);

  await faculty.save();

  return getFacultyById(faculty.id);
};

export const deleteFaculty = async (id) => {
  const faculty = await Faculty.findById(id);

  if (!faculty) {
    throw new ApiError(404, "Faculty not found.");
  }

  /*
   * Course Offering dependency check.
   * Implement after Course Offering module.
   */

  await faculty.deleteOne();
};
