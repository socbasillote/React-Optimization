import ApiError from "../../../utils/ApiError.js";

import Campus from "../campus/campus.model.js";
import College from "./college.model.js";

export const createCollege = async (payload) => {
  const campus = await Campus.findById(payload.campus);

  if (!campus) {
    throw new ApiError(404, "Campus not found.");
  }

  const existingCollege = await College.findOne({
    campus: payload.campus,
    $or: [{ name: payload.name }, { code: payload.code }],
  });

  if (existingCollege) {
    throw new ApiError(
      409,
      "College name or code already exists in this campus.",
    );
  }

  return College.create(payload);
};

export const getColleges = async ({
  page = 1,
  limit = 10,
  search = "",
  campus,
  status,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (campus) {
    filter.campus = campus;
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

  const [colleges, total] = await Promise.all([
    College.find(filter)
      .populate("campus", "name code")
      .populate("dean", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    College.countDocuments(filter),
  ]);

  return {
    colleges,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCollegeById = async (id) => {
  const college = await College.findById(id)
    .populate("campus", "name code")
    .populate("dean", "firstName lastName email");

  if (!college) {
    throw new ApiError(404, "College not found.");
  }

  return college;
};

export const updateCollege = async (id, payload) => {
  const college = await College.findById(id);

  if (!college) {
    throw new ApiError(404, "College not found.");
  }

  if (payload.campus) {
    const campus = await Campus.findById(payload.campus);

    if (!campus) {
      throw new ApiError(404, "Campus not found.");
    }
  }

  if (payload.name || payload.code) {
    const duplicate = await College.findOne({
      _id: { $ne: id },
      campus: payload.campus || college.campus,
      $or: [{ name: payload.name }, { code: payload.code }],
    });

    if (duplicate) {
      throw new ApiError(
        409,
        "College name or code already exists in this campus.",
      );
    }
  }

  Object.assign(college, payload);

  await college.save();

  return getCollegeById(college.id);
};

export const deleteCollege = async (id) => {
  const college = await College.findById(id);

  if (!college) {
    throw new ApiError(404, "College not found.");
  }

  /*
   * Department check
   * (implemented once Department module exists)
   */

  await college.deleteOne();
};
