import ApiError from "../../../utils/ApiError.js";

import Grade from "./grade.model.js";
import Enrollment from "../enrollment/enrollment.model.js";
import { ENROLLMENT_STATUS } from "../../../constants/enrollmentStatus.js";

export const createGrade = async (payload) => {
  const enrollment = await Enrollment.findById(payload.enrollment);

  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found.");
  }

  const duplicate = await Grade.findOne({
    enrollment: payload.enrollment,
  });

  if (duplicate) {
    throw new ApiError(409, "Grade already exists for this enrollment.");
  }

  if (enrollment.status === ENROLLMENT_STATUS.DROPPED) {
    throw new ApiError(400, "Cannot record grades for a dropped enrollment.");
  }

  return Grade.create(payload);
};

export const getGrades = async ({
  page = 1,
  limit = 10,
  enrollment,
  remarks,
  studentId,
  userRole,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (enrollment) {
    filter.enrollment = enrollment;
  }

  if (remarks) {
    filter.remarks = remarks;
  }

  if (userRole === "STUDENT") {
    const enrollments = await Enrollment.find({
      student: studentId,
    }).select("_id");

    const enrollmentIds = enrollments.map((item) => item._id);

    filter.enrollment = {
      $in: enrollmentIds,
    };
  }

  const skip = (page - 1) * limit;

  const [grades, total] = await Promise.all([
    Grade.find(filter)
      .populate({
        path: "enrollment",
        populate: [
          {
            path: "student",
            populate: {
              path: "user",
              select: "firstName lastName email",
            },
          },
          {
            path: "courseOffering",
            populate: [
              {
                path: "curriculumSubject",
                populate: {
                  path: "subject",
                  select: "code title units",
                },
              },
              {
                path: "faculty",
                populate: {
                  path: "user",
                  select: "firstName lastName",
                },
              },
              {
                path: "section",
                select: "name yearLevel",
              },
            ],
          },
        ],
      })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit),

    Grade.countDocuments(filter),
  ]);

  return {
    grades,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getGradeById = async (id) => {
  const grade = await Grade.findById(id).populate({
    path: "enrollment",
    populate: [
      {
        path: "student",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      },
      {
        path: "courseOffering",
        populate: [
          {
            path: "curriculumSubject",
            populate: {
              path: "subject",
              select: "code title units",
            },
          },
          {
            path: "faculty",
            populate: {
              path: "user",
              select: "firstName lastName",
            },
          },
          {
            path: "section",
            select: "name yearLevel",
          },
        ],
      },
    ],
  });

  if (!grade) {
    throw new ApiError(404, "Grade not found.");
  }

  return grade;
};

export const updateGrade = async (id, payload) => {
  const grade = await Grade.findById(id);

  if (!grade) {
    throw new ApiError(404, "Grade not found.");
  }

  if (payload.enrollment) {
    const enrollment = await Enrollment.findById(payload.enrollment);

    if (!enrollment) {
      throw new ApiError(404, "Enrollment not found.");
    }

    if (enrollment.status === ENROLLMENT_STATUS.DROPPED) {
      throw new ApiError(400, "Cannot assign grades to a dropped enrollment.");
    }

    const duplicate = await Grade.findOne({
      _id: { $ne: id },
      enrollment: payload.enrollment,
    });

    if (duplicate) {
      throw new ApiError(409, "Grade already exists for this enrollment.");
    }
  }

  Object.assign(grade, payload);

  await grade.save();

  return getGradeById(grade.id);
};

export const deleteGrade = async (id) => {
  const grade = await Grade.findById(id);

  if (!grade) {
    throw new ApiError(404, "Grade not found.");
  }

  await grade.deleteOne();
};
