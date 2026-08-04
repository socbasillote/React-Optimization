import ApiError from "../../../utils/ApiError.js";

import Department from "../department/department.model.js";
import Program from "./program.model.js";

export const createProgram = async (payload) => {
  const department = await Department.findById(payload.department);

  if (!department) {
    throw new ApiError(404, "Department not found.");
  }

  const existingProgram = await Program.findOne({
    department: payload.department,
    $or: [{ name: payload.name }, { code: payload.code }],
  });

  if (existingProgram) {
    throw new ApiError(
      409,
      "Program name or code already exists in this department.",
    );
  }

  return Program.create(payload);
};

export const getPrograms = async ({
  page = 1,
  limit = 10,
  search = "",
  department,
  degreeType,
  status,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (department) filter.department = department;
  if (degreeType) filter.degreeType = degreeType;
  if (status) filter.status = status;

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        code: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const skip = (page - 1) * limit;

  const [programs, total] = await Promise.all([
    Program.find(filter)
      .populate({
        path: "department",
        select: "name code college",
        populate: {
          path: "college",
          select: "name code campus",
          populate: {
            path: "campus",
            select: "name code",
          },
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Program.countDocuments(filter),
  ]);

  return {
    programs,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProgramById = async (id) => {
  const program = await Program.findById(id).populate({
    path: "department",
    select: "name code college",
    populate: {
      path: "college",
      select: "name code campus",
      populate: {
        path: "campus",
        select: "name code",
      },
    },
  });

  if (!program) {
    throw new ApiError(404, "Program not found.");
  }

  return program;
};

export const updateProgram = async (id, payload) => {
  const program = await Program.findById(id);

  if (!program) {
    throw new ApiError(404, "Program not found.");
  }

  const departmentId = payload.department || program.department;

  if (payload.department) {
    const department = await Department.findById(payload.department);

    if (!department) {
      throw new ApiError(404, "Department not found.");
    }
  }

  if (payload.name || payload.code) {
    const duplicate = await Program.findOne({
      _id: { $ne: id },
      department: departmentId,
      $or: [{ name: payload.name }, { code: payload.code }],
    });

    if (duplicate) {
      throw new ApiError(
        409,
        "Program name or code already exists in this department.",
      );
    }
  }

  Object.assign(program, payload);

  await program.save();

  return getProgramById(program.id);
};

export const deleteProgram = async (id) => {
  const program = await Program.findById(id);

  if (!program) {
    throw new ApiError(404, "Program not found.");
  }

  /*
   * Student dependency check
   * Curriculum dependency check
   * Implemented in later phases.
   */

  await program.deleteOne();
};
