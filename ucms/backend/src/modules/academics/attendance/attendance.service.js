import ApiError from "../../../utils/ApiError.js";

import Attendance from "./attendance.model.js";

import Enrollment from "../enrollment/enrollment.model.js";
import ClassSchedule from "../class-schedule/classSchedule.model.js";

import { ROLES } from "../../../constants/roles.js";

export const DAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

export const createAttendance = async (payload) => {
  const enrollment = await Enrollment.findById(payload.enrollment).populate(
    "courseOffering",
  );

  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found.");
  }

  const classSchedule = await ClassSchedule.findById(
    payload.classSchedule,
  ).populate("courseOffering");

  if (!classSchedule) {
    throw new ApiError(404, "Class schedule not found.");
  }

  if (
    enrollment.courseOffering._id.toString() !==
    classSchedule.courseOffering._id.toString()
  ) {
    throw new ApiError(
      400,
      "Enrollment does not belong to this class schedule.",
    );
  }

  const attendanceDay = DAYS[new Date(payload.date).getDay()];

  if (attendanceDay !== classSchedule.day) {
    throw new ApiError(
      400,
      "Attendance date does not match the class schedule day.",
    );
  }

  const duplicate = await Attendance.findOne({
    enrollment: payload.enrollment,
    classSchedule: payload.classSchedule,
    date: payload.date,
  });

  if (duplicate) {
    throw new ApiError(409, "Attendance already recorded.");
  }

  return Attendance.create(payload);
};

export const getAttendances = async ({
  page = 1,
  limit = 10,
  enrollment,
  classSchedule,
  date,
  status,
  studentId,
  userRole,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (enrollment) {
    filter.enrollment = enrollment;
  }

  if (classSchedule) {
    filter.classSchedule = classSchedule;
  }

  if (date) {
    filter.date = new Date(date);
  }

  if (status) {
    filter.status = status;
  }

  if (userRole === ROLES.STUDENT) {
    const enrollments = await Enrollment.find({
      student: studentId,
    }).select("_id");

    const enrollmentIds = enrollments.map((enrollment) => enrollment._id);

    filter.enrollment = {
      $in: enrollmentIds,
    };
  }

  const skip = (page - 1) * limit;

  const [attendances, total] = await Promise.all([
    Attendance.find(filter)
      .populate({
        path: "enrollment",
        populate: {
          path: "student",
          populate: {
            path: "user",
            select: "firstName lastName email",
          },
        },
      })
      .populate({
        path: "classSchedule",
        populate: {
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
              path: "section",
              select: "name",
            },
          ],
        },
      })
      .sort({
        date: -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit),

    Attendance.countDocuments(filter),
  ]);

  return {
    attendances,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAttendanceById = async (id) => {
  const attendance = await Attendance.findById(id)
    .populate({
      path: "enrollment",
      populate: {
        path: "student",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      },
    })
    .populate({
      path: "classSchedule",
      populate: {
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
            path: "section",
            select: "name",
          },
        ],
      },
    });

  if (!attendance) {
    throw new ApiError(404, "Attendance not found.");
  }

  return attendance;
};

export const updateAttendance = async (id, payload) => {
  const attendance = await Attendance.findById(id);

  if (!attendance) {
    throw new ApiError(404, "Attendance not found.");
  }

  const enrollmentId = payload.enrollment ?? attendance.enrollment;
  const classScheduleId = payload.classSchedule ?? attendance.classSchedule;
  const date = payload.date ?? attendance.date;

  const enrollment =
    await Enrollment.findById(enrollmentId).populate("courseOffering");

  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found.");
  }

  const classSchedule =
    await ClassSchedule.findById(classScheduleId).populate("courseOffering");

  if (!classSchedule) {
    throw new ApiError(404, "Class schedule not found.");
  }

  if (
    enrollment.courseOffering._id.toString() !==
    classSchedule.courseOffering._id.toString()
  ) {
    throw new ApiError(
      400,
      "Enrollment does not belong to this class schedule.",
    );
  }

  const attendanceDay = DAYS[new Date(date).getDay()];

  if (attendanceDay !== classSchedule.day) {
    throw new ApiError(
      400,
      "Attendance date does not match the class schedule day.",
    );
  }

  const duplicate = await Attendance.findOne({
    _id: { $ne: id },
    enrollment: enrollmentId,
    classSchedule: classScheduleId,
    date,
  });

  if (duplicate) {
    throw new ApiError(409, "Attendance already recorded.");
  }

  Object.assign(attendance, payload);

  await attendance.save();

  return getAttendanceById(attendance.id);
};

export const deleteAttendance = async (id) => {
  const attendance = await Attendance.findById(id);

  if (!attendance) {
    throw new ApiError(404, "Attendance not found.");
  }

  await attendance.deleteOne();
};
