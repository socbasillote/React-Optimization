import ApiError from "../../../utils/ApiError.js";

import AcademicYear from "./academicYear.model.js";
import AcademicTerm from "../academic-term/academicTerm.model.js";

export const createAcademicYear = async (payload) => {
  const existingAcademicYear = await AcademicYear.findOne({
    name: payload.name,
  });

  if (existingAcademicYear) {
    throw new ApiError(409, "Academic year already exists.");
  }

  if (payload.isCurrent) {
    await AcademicYear.updateMany(
      {},
      {
        isCurrent: false,
      },
    );
  }

  return AcademicYear.create(payload);
};

export const getAcademicYears = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  const skip = (page - 1) * limit;

  const [academicYears, total] = await Promise.all([
    AcademicYear.find(filter).sort({ startDate: -1 }).skip(skip).limit(limit),

    AcademicYear.countDocuments(filter),
  ]);

  return {
    academicYears,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAcademicYearById = async (id) => {
  const academicYear = await AcademicYear.findById(id);

  if (!academicYear) {
    throw new ApiError(404, "Academic year not found.");
  }

  return academicYear;
};

export const updateAcademicYear = async (id, payload) => {
  const academicYear = await AcademicYear.findById(id);

  if (!academicYear) {
    throw new ApiError(404, "Academic year not found.");
  }

  if (payload.name && payload.name !== academicYear.name) {
    const duplicate = await AcademicYear.findOne({
      _id: { $ne: id },
      name: payload.name,
    });

    if (duplicate) {
      throw new ApiError(409, "Academic year already exists.");
    }
  }

  if (payload.isCurrent) {
    await AcademicYear.updateMany(
      {
        _id: {
          $ne: id,
        },
      },
      {
        isCurrent: false,
      },
    );
  }

  Object.assign(academicYear, payload);

  await academicYear.save();

  return academicYear;
};

export const deleteAcademicYear = async (id) => {
  const academicYear = await AcademicYear.findById(id);

  if (!academicYear) {
    throw new ApiError(404, "Academic year not found.");
  }

  const hasTerms = await AcademicTerm.exists({
    academicYear: id,
  });

  if (hasTerms) {
    throw new ApiError(
      409,
      "Cannot delete academic year because it has academic terms.",
    );
  }

  await academicYear.deleteOne();
};
