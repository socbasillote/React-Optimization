import ApiError from "../../../utils/ApiError.js";

import Enrollment from "../../academics/enrollment/enrollment.model.js";

import ClassSchedule from "./classSchedule.model.js";
import CourseOffering from "../course-offering/courseOffering.model.js";

const hasRoomConflict = async ({
  room,
  day,
  startTime,
  endTime,
  excludeId,
}) => {
  const schedules = await ClassSchedule.find({
    room,
    day,
    ...(excludeId && {
      _id: { $ne: excludeId },
    }),
  });

  return schedules.some(
    (schedule) => startTime < schedule.endTime && endTime > schedule.startTime,
  );
};

const validateTimeRange = (startTime, endTime) => {
  if (startTime >= endTime) {
    throw new ApiError(400, "End time must be after start time.");
  }
};

export const createClassSchedule = async (payload) => {
  const courseOffering = await CourseOffering.findById(payload.courseOffering);

  if (!courseOffering) {
    throw new ApiError(404, "Course offering not found.");
  }

  validateTimeRange(payload.startTime, payload.endTime);

  const duplicate = await ClassSchedule.findOne({
    courseOffering: payload.courseOffering,
    day: payload.day,
    startTime: payload.startTime,
    endTime: payload.endTime,
  });

  if (duplicate) {
    throw new ApiError(409, "Class schedule already exists.");
  }

  const roomConflict = await hasRoomConflict({
    room: payload.room,
    day: payload.day,
    startTime: payload.startTime,
    endTime: payload.endTime,
  });

  if (roomConflict) {
    throw new ApiError(409, "Room is already scheduled during this time.");
  }

  return ClassSchedule.create(payload);
};

export const getClassSchedules = async ({
  page = 1,
  limit = 10,
  courseOffering,
  day,
  room,
  studentId,
  userRole,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (courseOffering) {
    filter.courseOffering = courseOffering;
  }

  if (day) {
    filter.day = day;
  }

  if (room) {
    filter.room = room;
  }

  if (userRole === "STUDENT") {
    const enrollments = await Enrollment.find({
      student: studentId,
    }).select("courseOffering");

    const courseOfferingIds = enrollments.map(
      (enrollment) => enrollment.courseOffering,
    );

    filter.courseOffering = {
      $in: courseOfferingIds,
    };
  }

  const skip = (page - 1) * limit;

  const [classSchedules, total] = await Promise.all([
    ClassSchedule.find(filter)
      .populate({
        path: "courseOffering",
        populate: [
          {
            path: "curriculumSubject",
            populate: {
              path: "subject",
              select: "code title",
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
            select: "name",
          },
        ],
      })
      .sort({
        day: 1,
        startTime: 1,
      })
      .skip(skip)
      .limit(limit),

    ClassSchedule.countDocuments(filter),
  ]);

  return {
    classSchedules,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getClassScheduleById = async (id) => {
  const classSchedule = await ClassSchedule.findById(id).populate({
    path: "courseOffering",
    populate: [
      {
        path: "curriculumSubject",
        populate: {
          path: "subject",
          select: "code title",
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
        select: "name",
      },
    ],
  });

  if (!classSchedule) {
    throw new ApiError(404, "Class schedule not found.");
  }

  return classSchedule;
};

export const updateClassSchedule = async (id, payload) => {
  const classSchedule = await ClassSchedule.findById(id);

  if (!classSchedule) {
    throw new ApiError(404, "Class schedule not found.");
  }

  if (payload.courseOffering) {
    const exists = await CourseOffering.findById(payload.courseOffering);

    if (!exists) {
      throw new ApiError(404, "Course offering not found.");
    }
  }

  const room = payload.room ?? classSchedule.room;
  const day = payload.day ?? classSchedule.day;
  const startTime = payload.startTime ?? classSchedule.startTime;
  const endTime = payload.endTime ?? classSchedule.endTime;

  validateTimeRange(startTime, endTime);

  const roomConflict = await hasRoomConflict({
    room,
    day,
    startTime,
    endTime,
    excludeId: id,
  });

  const duplicate = await ClassSchedule.findOne({
    _id: { $ne: id },
    courseOffering: payload.courseOffering ?? classSchedule.courseOffering,
    day,
    startTime,
    endTime,
  });

  if (duplicate) {
    throw new ApiError(409, "Class schedule already exists.");
  }

  if (roomConflict) {
    throw new ApiError(409, "Room is already scheduled during this time.");
  }

  Object.assign(classSchedule, payload);

  await classSchedule.save();

  return getClassScheduleById(classSchedule.id);
};

export const deleteClassSchedule = async (id) => {
  const classSchedule = await ClassSchedule.findById(id);

  if (!classSchedule) {
    throw new ApiError(404, "Class schedule not found.");
  }

  /*
   * Attendance dependency check.
   * Implement after Attendance module.
   */

  await classSchedule.deleteOne();

  return {
    message: "Class schedule deleted successfully.",
  };
};
