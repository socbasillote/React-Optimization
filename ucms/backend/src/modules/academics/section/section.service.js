import ApiError from "../../../utils/ApiError.js";

import Program from "../../organization/program/program.model.js";
import AcademicYear from "../academic-year/academicYear.model.js";
import AcademicTerm from "../academic-term/academicTerm.model.js";
import User from "../../users/user.model.js";

import Section from "./section.model.js";
import { ROLES } from "../../../constants/roles.js";

export const createSection = async (payload) => {
  const program = await Program.findById(payload.program);

  if (!program) {
    throw new ApiError(404, "Program not found.");
  }

  const academicYear = await AcademicYear.findById(payload.academicYear);

  if (!academicYear) {
    throw new ApiError(404, "Academic year not found.");
  }

  const academicTerm = await AcademicTerm.findById(payload.academicTerm);

  if (!academicTerm) {
    throw new ApiError(404, "Academic term not found.");
  }

  if (payload.adviser) {
    const adviser = await User.findById(payload.adviser);

    if (!adviser) {
      throw new ApiError(404, "Adviser not found.");
    }
  }

  const duplicate = await Section.findOne({
    program: payload.program,
    academicYear: payload.academicYear,
    academicTerm: payload.academicTerm,
    name: payload.name,
  });

  if (duplicate) {
    throw new ApiError(409, "Section already exists.");
  }

  return Section.create(payload);
};

export const getSections = async ({
  page = 1,
  limit = 10,
  program,
  academicYear,
  academicTerm,
  status,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (program) filter.program = program;
  if (academicYear) filter.academicYear = academicYear;
  if (academicTerm) filter.academicTerm = academicTerm;
  if (status) filter.status = status;

  const skip = (page - 1) * limit;

  const [sections, total] = await Promise.all([
    Section.find(filter)
      .populate("program", "name code")
      .populate("academicYear", "name")
      .populate("academicTerm", "name")
      .populate("adviser", "firstName lastName email")
      .sort({
        yearLevel: 1,
        name: 1,
      })
      .skip(skip)
      .limit(limit),

    Section.countDocuments(filter),
  ]);

  return {
    sections,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getSectionById = async (id) => {
  const section = await Section.findById(id)
    .populate("program", "name code")
    .populate("academicYear", "name")
    .populate("academicTerm", "name")
    .populate("adviser", "firstName lastName email");

  if (!section) {
    throw new ApiError(404, "Section not found.");
  }

  return section;
};

export const updateSection = async (id, payload) => {
  const section = await Section.findById(id);

  if (!section) {
    throw new ApiError(404, "Section not found.");
  }

  const programId = payload.program || section.program;
  const academicYearId = payload.academicYear || section.academicYear;
  const academicTermId = payload.academicTerm || section.academicTerm;
  const sectionName = payload.name || section.name;

  if (payload.program) {
    const program = await Program.findById(payload.program);

    if (!program) {
      throw new ApiError(404, "Program not found.");
    }
  }

  if (payload.academicYear) {
    const academicYear = await AcademicYear.findById(payload.academicYear);

    if (!academicYear) {
      throw new ApiError(404, "Academic year not found.");
    }
  }

  if (payload.academicTerm) {
    const academicTerm = await AcademicTerm.findById(payload.academicTerm);

    if (!academicTerm) {
      throw new ApiError(404, "Academic term not found.");
    }
  }

  if (payload.adviser) {
    const adviser = await User.findById(payload.adviser);

    if (!adviser) {
      throw new ApiError(404, "Adviser not found.");
    }

    if (adviser.role !== ROLES.FACULTY) {
      throw new ApiError(400, "Selected adviser must be a faculty member.");
    }
  }

  const duplicate = await Section.findOne({
    _id: { $ne: id },
    program: programId,
    academicYear: academicYearId,
    academicTerm: academicTermId,
    name: sectionName,
  });

  if (duplicate) {
    throw new ApiError(409, "Section already exists.");
  }

  Object.assign(section, payload);

  await section.save();

  return getSectionById(section.id);
};

export const deleteSection = async (id) => {
  const section = await Section.findById(id);

  if (!section) {
    throw new ApiError(404, "Section not found.");
  }

  /*
   * Student / Enrollment dependency check.
   * Implement after Student and Enrollment modules.
   */

  await section.deleteOne();
};
