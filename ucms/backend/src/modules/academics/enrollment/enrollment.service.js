import ApiError from "../../../utils/ApiError.js";

import Enrollment from "./enrollment.model.js";

import Student from "../../students/student.model.js";
import CourseOffering from "../course-offering/courseOffering.model.js";

export const createEnrollment = async (payload) => {
  const student = await Student.findById(payload.student);

  if (!student) {
    throw new ApiError(404, "Student not found.");
  }

  const courseOffering = await CourseOffering.findById(payload.courseOffering);

  if (!courseOffering) {
    throw new ApiError(404, "Course offering not found.");
  }

  const duplicate = await Enrollment.findOne({
    student: payload.student,
    courseOffering: payload.courseOffering,
  });

  if (duplicate) {
    throw new ApiError(
      409,
      "Student is already enrolled in this course offering.",
    );
  }

  return Enrollment.create(payload);
};

export const getEnrollments = async ({
  page = 1,
  limit = 10,
  student,
  courseOffering,
  status,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (student) filter.student = student;
  if (courseOffering) filter.courseOffering = courseOffering;
  if (status) filter.status = status;

  const skip = (page - 1) * limit;

  const [enrollments, total] = await Promise.all([
    Enrollment.find(filter)
      .populate({
        path: "student",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      })
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
          {
            path: "academicYear",
            select: "name",
          },
          {
            path: "academicTerm",
            select: "name",
          },
        ],
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Enrollment.countDocuments(filter),
  ]);

  return {
    enrollments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getEnrollmentById = async (id) => {
  const enrollment = await Enrollment.findById(id)
    .populate({
      path: "student",
      populate: {
        path: "user",
        select: "firstName lastName email",
      },
    })
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
        {
          path: "academicYear",
          select: "name",
        },
        {
          path: "academicTerm",
          select: "name",
        },
      ],
    });

  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found.");
  }

  return enrollment;
};

export const updateEnrollment = async (id, payload) => {
  const enrollment = await Enrollment.findById(id);

  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found.");
  }

  const studentId = payload.student || enrollment.student;

  const courseOfferingId = payload.courseOffering || enrollment.courseOffering;

  const duplicate = await Enrollment.findOne({
    _id: { $ne: id },
    student: studentId,
    courseOffering: courseOfferingId,
  });

  if (duplicate) {
    throw new ApiError(
      409,
      "Student is already enrolled in this course offering.",
    );
  }

  if (payload.student) {
    const student = await Student.findById(payload.student);

    if (!student) {
      throw new ApiError(404, "Student not found.");
    }
  }

  if (payload.courseOffering) {
    const courseOffering = await CourseOffering.findById(
      payload.courseOffering,
    );

    if (!courseOffering) {
      throw new ApiError(404, "Course offering not found.");
    }
  }

  Object.assign(enrollment, payload);

  await enrollment.save();

  return getEnrollmentById(enrollment.id);
};

export const deleteEnrollment = async (id) => {
  const enrollment = await Enrollment.findById(id);

  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found.");
  }

  /*
   * Attendance dependency check.
   * Implement after Attendance module.
   */

  /*
   * Grade dependency check.
   * Implement after Grade module.
   */

  await enrollment.deleteOne();
};
