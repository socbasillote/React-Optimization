import ApiError from "../../../utils/ApiError.js";

import AcademicYear from "../academic-year/academicYear.model.js";
import AcademicTerm from "./academicTerm.model.js";

export const createAcademicTerm = async (payload) => {
  const academicYear = await AcademicYear.findById(payload.academicYear);

  if (!academicYear) {
    throw new ApiError(404, "Academic year not found.");
  }

  const duplicate = await AcademicTerm.findOne({
    academicYear: payload.academicYear,
    $or: [{ code: payload.code }, { sequence: payload.sequence }],
  });

  if (duplicate) {
    throw new ApiError(
      409,
      "Academic term code or sequence already exists in this academic year.",
    );
  }

  if (payload.isCurrent) {
    await AcademicTerm.updateMany(
      {
        academicYear: payload.academicYear,
      },
      {
        isCurrent: false,
      },
    );
  }

  return AcademicTerm.create(payload);
};

export const getAcademicTerms = async ({
  page = 1,
  limit = 10,
  search = "",
  academicYear,
  status,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (academicYear) {
    filter.academicYear = academicYear;
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

  const [academicTerms, total] = await Promise.all([
    AcademicTerm.find(filter)
      .populate("academicYear", "name")
      .sort({
        "academicYear.startDate": -1,
        sequence: 1,
      })
      .skip(skip)
      .limit(limit),

    AcademicTerm.countDocuments(filter),
  ]);

  return {
    academicTerms,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAcademicTermById = async (id) => {
  const academicTerm = await AcademicTerm.findById(id).populate(
    "academicYear",
    "name startDate endDate",
  );

  if (!academicTerm) {
    throw new ApiError(404, "Academic term not found.");
  }

  return academicTerm;
};

export const updateAcademicTerm = async (id, payload) => {
  const academicTerm = await AcademicTerm.findById(id);

  if (!academicTerm) {
    throw new ApiError(404, "Academic term not found.");
  }

  const academicYearId = payload.academicYear || academicTerm.academicYear;

  if (payload.academicYear) {
    const academicYear = await AcademicYear.findById(payload.academicYear);

    if (!academicYear) {
      throw new ApiError(404, "Academic year not found.");
    }
  }

  if (payload.code || payload.sequence) {
    const duplicate = await AcademicTerm.findOne({
      _id: { $ne: id },
      academicYear: academicYearId,
      $or: [{ code: payload.code }, { sequence: payload.sequence }],
    });

    if (duplicate) {
      throw new ApiError(
        409,
        "Academic term code or sequence already exists in this academic year.",
      );
    }
  }

  if (payload.isCurrent) {
    await AcademicTerm.updateMany(
      {
        _id: { $ne: id },
      },
      {
        isCurrent: false,
      },
    );
  }

  Object.assign(academicTerm, payload);

  await academicTerm.save();

  return getAcademicTermById(academicTerm.id);
};

export const deleteAcademicTerm = async (id) => {
  const academicTerm = await AcademicTerm.findById(id);

  if (!academicTerm) {
    throw new ApiError(404, "Academic term not found.");
  }

  /*
   * Section dependency check.
   * Implement after the Section module.
   */

  await academicTerm.deleteOne();
};
