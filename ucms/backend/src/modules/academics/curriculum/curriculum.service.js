import ApiError from "../../../utils/ApiError.js";

import Program from "../../organization/program/program.model.js";
import Curriculum from "./curriculum.model.js";

export const createCurriculum = async (payload) => {
  const program = await Program.findById(payload.program);

  if (!program) {
    throw new ApiError(404, "Program not found.");
  }

  const existingCurriculum = await Curriculum.findOne({
    program: payload.program,
    name: payload.name,
  });

  if (existingCurriculum) {
    throw new ApiError(409, "Curriculum already exists in this program.");
  }

  return Curriculum.create(payload);
};

export const getCurricula = async ({
  page = 1,
  limit = 10,
  search = "",
  program,
  status,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (program) filter.program = program;
  if (status) filter.status = status;

  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  const skip = (page - 1) * limit;

  const [curricula, total] = await Promise.all([
    Curriculum.find(filter)
      .populate({
        path: "program",
        select: "name code department",
        populate: {
          path: "department",
          select: "name college",
          populate: {
            path: "college",
            select: "name campus",
            populate: {
              path: "campus",
              select: "name",
            },
          },
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Curriculum.countDocuments(filter),
  ]);

  return {
    curricula,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCurriculumById = async (id) => {
  const curriculum = await Curriculum.findById(id).populate({
    path: "program",
    select: "name code department",
    populate: {
      path: "department",
      select: "name college",
      populate: {
        path: "college",
        select: "name campus",
        populate: {
          path: "campus",
          select: "name",
        },
      },
    },
  });

  if (!curriculum) {
    throw new ApiError(404, "Curriculum not found.");
  }

  return curriculum;
};

export const updateCurriculum = async (id, payload) => {
  const curriculum = await Curriculum.findById(id);

  if (!curriculum) {
    throw new ApiError(404, "Curriculum not found.");
  }

  const programId = payload.program || curriculum.program;

  if (payload.program) {
    const program = await Program.findById(payload.program);

    if (!program) {
      throw new ApiError(404, "Program not found.");
    }
  }

  if (payload.name) {
    const duplicate = await Curriculum.findOne({
      _id: { $ne: id },
      program: programId,
      name: payload.name,
    });

    if (duplicate) {
      throw new ApiError(409, "Curriculum already exists in this program.");
    }
  }

  Object.assign(curriculum, payload);

  await curriculum.save();

  return getCurriculumById(curriculum.id);
};

export const deleteCurriculum = async (id) => {
  const curriculum = await Curriculum.findById(id);

  if (!curriculum) {
    throw new ApiError(404, "Curriculum not found.");
  }

  /*
   * Curriculum Subject dependency check.
   * Implement after the Curriculum Subject module.
   */

  await curriculum.deleteOne();
};
