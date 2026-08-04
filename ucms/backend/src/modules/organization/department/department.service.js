import ApiError from "../../../utils/ApiError.js";

import College from "../college/college.model.js";
import Department from "./department.model.js";

export const createDepartment = async (payload) => {
  const college = await College.findById(payload.college);

  if (!college) {
    throw new ApiError(404, "College not found.");
  }

  const existingDepartment = await Department.findOne({
    college: payload.college,
    $or: [{ name: payload.name }, { code: payload.code }],
  });

  if (existingDepartment) {
    throw new ApiError(
      409,
      "Department name or code already exists in this college.",
    );
  }

  return Department.create(payload);
};

export const getDepartments = async ({
  page = 1,
  limit = 10,
  search = "",
  college,
  status,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (college) {
    filter.college = college;
  }

  if (status) {
    filter.status = status;
  }

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

  const [departments, total] = await Promise.all([
    Department.find(filter)
      .populate({
        path: "college",
        select: "name code campus",
        populate: {
          path: "campus",
          select: "name code",
        },
      })
      .populate("chairperson", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Department.countDocuments(filter),
  ]);

  return {
    departments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getDepartmentById = async (id) => {
  const department = await Department.findById(id)
    .populate({
      path: "college",
      select: "name code campus",
      populate: {
        path: "campus",
        select: "name code",
      },
    })
    .populate("chairperson", "firstName lastName email");

  if (!department) {
    throw new ApiError(404, "Department not found.");
  }

  return department;
};

export const updateDepartment = async (id, payload) => {
  const department = await Department.findById(id);

  if (!department) {
    throw new ApiError(404, "Department not found.");
  }

  const collegeId = payload.college || department.college;

  if (payload.college) {
    const college = await College.findById(payload.college);

    if (!college) {
      throw new ApiError(404, "College not found.");
    }
  }

  if (payload.name || payload.code) {
    const duplicate = await Department.findOne({
      _id: { $ne: id },
      college: collegeId,
      $or: [{ name: payload.name }, { code: payload.code }],
    });

    if (duplicate) {
      throw new ApiError(
        409,
        "Department name or code already exists in this college.",
      );
    }
  }

  Object.assign(department, payload);

  await department.save();

  return getDepartmentById(department.id);
};

export const deleteDepartment = async (id) => {
  const department = await Department.findById(id);

  if (!department) {
    throw new ApiError(404, "Department not found.");
  }

  /*
   * Program dependency check
   * (Implemented in the next module.)
   */

  await department.deleteOne();
};
