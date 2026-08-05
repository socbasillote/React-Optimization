import ApiError from "../../../utils/ApiError.js";

import Assignment from "./assignment.model.js";
import CourseOffering from "../course-offering/courseOffering.model.js";

export const createAssignment = async (payload) => {
  const courseOffering = await CourseOffering.findById(payload.courseOffering);

  if (!courseOffering) {
    throw new ApiError(404, "Course offering not found.");
  }

  const duplicate = await Assignment.findOne({
    courseOffering: payload.courseOffering,
    title: payload.title,
  });

  if (duplicate) {
    throw new ApiError(
      409,
      "Assignment title already exists for this course offering.",
    );
  }

  return Assignment.create(payload);
};

export const getAssignments = async ({
  page = 1,
  limit = 10,
  courseOffering,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (courseOffering) {
    filter.courseOffering = courseOffering;
  }

  const skip = (page - 1) * limit;

  const [assignments, total] = await Promise.all([
    Assignment.find(filter)
      .populate({
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
      })
      .sort({
        dueDate: 1,
      })
      .skip(skip)
      .limit(limit),

    Assignment.countDocuments(filter),
  ]);

  return {
    assignments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAssignmentById = async (id) => {
  const assignment = await Assignment.findById(id).populate({
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
  });

  if (!assignment) {
    throw new ApiError(404, "Assignment not found.");
  }

  return assignment;
};

export const updateAssignment = async (id, payload) => {
  const assignment = await Assignment.findById(id);

  if (!assignment) {
    throw new ApiError(404, "Assignment not found.");
  }

  const courseOffering = payload.courseOffering ?? assignment.courseOffering;

  const title = payload.title ?? assignment.title;

  if (payload.courseOffering) {
    const exists = await CourseOffering.findById(payload.courseOffering);

    if (!exists) {
      throw new ApiError(404, "Course offering not found.");
    }
  }

  const duplicate = await Assignment.findOne({
    _id: { $ne: id },
    courseOffering,
    title,
  });

  if (duplicate) {
    throw new ApiError(
      409,
      "Assignment title already exists for this course offering.",
    );
  }

  Object.assign(assignment, payload);

  await assignment.save();

  return getAssignmentById(assignment.id);
};

export const deleteAssignment = async (id) => {
  const assignment = await Assignment.findById(id);

  if (!assignment) {
    throw new ApiError(404, "Assignment not found.");
  }

  /*
   * Assignment Submission dependency check.
   * Implement after Assignment Submission module.
   */

  await assignment.deleteOne();
};
