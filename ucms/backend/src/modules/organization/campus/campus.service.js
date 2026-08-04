import ApiError from "../../../utils/ApiError.js";
import Campus from "./campus.model.js";

export const createCampus = async (payload) => {
  const existingCampus = await Campus.findOne({
    $or: [{ name: payload.name }, { code: payload.code }],
  });

  if (existingCampus) {
    throw new ApiError(409, "Campus name or code already exists.");
  }

  return Campus.create(payload);
};

export const getCampuses = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

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

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [campuses, total] = await Promise.all([
    Campus.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),

    Campus.countDocuments(filter),
  ]);

  return {
    campuses,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCampusById = async (id) => {
  const campus = await Campus.findById(id);

  if (!campus) {
    throw new ApiError(404, "Campus not found.");
  }

  return campus;
};

export const updateCampus = async (id, payload) => {
  const campus = await Campus.findById(id);

  if (!campus) {
    throw new ApiError(404, "Campus not found.");
  }

  if (payload.name || payload.code) {
    const duplicate = await Campus.findOne({
      _id: { $ne: id },
      $or: [{ name: payload.name }, { code: payload.code }],
    });

    if (duplicate) {
      throw new ApiError(409, "Campus name or code already exists.");
    }
  }

  Object.assign(campus, payload);

  await campus.save();

  return campus;
};

export const deleteCampus = async (id) => {
  const campus = await Campus.findById(id);

  if (!campus) {
    throw new ApiError(404, "Campus not found.");
  }

  await campus.deleteOne();
};
