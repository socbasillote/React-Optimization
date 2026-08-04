import ApiError from "../../utils/ApiError.js";

import User from "../users/user.model.js";
import Program from "../organization/program/program.model.js";
import Curriculum from "../academics/curriculum/curriculum.model.js";
import Section from "../academics/section/section.model.js";

import Student from "./student.model.js";

import { ROLES } from "../../constants/roles.js";

export const createStudent = async (payload) => {
  const user = await User.findById(payload.user);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.role !== ROLES.STUDENT) {
    throw new ApiError(400, "User must have the STUDENT role.");
  }

  const existingStudent = await Student.findOne({
    $or: [{ user: payload.user }, { studentNumber: payload.studentNumber }],
  });

  if (existingStudent) {
    throw new ApiError(409, "Student already exists.");
  }

  const program = await Program.findById(payload.program);

  if (!program) {
    throw new ApiError(404, "Program not found.");
  }

  const curriculum = await Curriculum.findById(payload.curriculum);

  if (!curriculum) {
    throw new ApiError(404, "Curriculum not found.");
  }

  if (payload.section) {
    const section = await Section.findById(payload.section);

    if (!section) {
      throw new ApiError(404, "Section not found.");
    }
  }

  return Student.create(payload);
};

export const getStudents = async ({
  page = 1,
  limit = 10,
  search = "",
  program,
  section,
  status,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (program) filter.program = program;
  if (section) filter.section = section;
  if (status) filter.status = status;

  if (search) {
    filter.studentNumber = {
      $regex: search,
      $options: "i",
    };
  }

  const skip = (page - 1) * limit;

  const [students, total] = await Promise.all([
    Student.find(filter)
      .populate("user", "firstName middleName lastName email")
      .populate("program", "name code")
      .populate("curriculum", "name")
      .populate("section", "name")
      .sort({
        studentNumber: 1,
      })
      .skip(skip)
      .limit(limit),

    Student.countDocuments(filter),
  ]);

  return {
    students,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getStudentById = async (id) => {
  const student = await Student.findById(id)
    .populate("user", "firstName middleName lastName email phone avatar")
    .populate("program", "name code")
    .populate("curriculum", "name")
    .populate("section", "name");

  if (!student) {
    throw new ApiError(404, "Student not found.");
  }

  return student;
};

export const updateStudent = async (id, payload) => {
  const student = await Student.findById(id);

  if (!student) {
    throw new ApiError(404, "Student not found.");
  }

  const userId = payload.user || student.user;
  const studentNumber = payload.studentNumber || student.studentNumber;

  if (payload.user || payload.studentNumber) {
    const duplicate = await Student.findOne({
      _id: { $ne: id },
      $or: [{ user: userId }, { studentNumber }],
    });

    if (duplicate) {
      throw new ApiError(409, "Student already exists.");
    }
  }

  if (payload.user) {
    const user = await User.findById(payload.user);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    if (user.role !== ROLES.STUDENT) {
      throw new ApiError(400, "User must have the STUDENT role.");
    }
  }

  if (payload.program) {
    const exists = await Program.findById(payload.program);

    if (!exists) {
      throw new ApiError(404, "Program not found.");
    }
  }

  if (payload.curriculum) {
    const exists = await Curriculum.findById(payload.curriculum);

    if (!exists) {
      throw new ApiError(404, "Curriculum not found.");
    }
  }

  if (payload.section) {
    const exists = await Section.findById(payload.section);

    if (!exists) {
      throw new ApiError(404, "Section not found.");
    }
  }

  Object.assign(student, payload);

  await student.save();

  return getStudentById(student.id);
};

export const deleteStudent = async (id) => {
  const student = await Student.findById(id);

  if (!student) {
    throw new ApiError(404, "Student not found.");
  }

  /*
   * Enrollment dependency check.
   * Implement after Enrollment module.
   */

  await student.deleteOne();
};
