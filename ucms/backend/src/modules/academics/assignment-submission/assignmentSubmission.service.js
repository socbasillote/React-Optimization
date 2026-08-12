import ApiError from "../../../utils/ApiError.js";

import Assignment from "../assignment/assignment.model.js";
import AssignmentSubmission from "./assignmentSubmission.model.js";
import Enrollment from "../enrollment/enrollment.model.js";
import Faculty from "../../faculty/faculty.model.js";

import CourseOffering from "../course-offering/courseOffering.model.js";

import { ENROLLMENT_STATUS } from "../../../constants/enrollmentStatus.js";
import { ROLES } from "../../../constants/roles.js";

export const getMyAssignmentSubmissions = async ({
  studentId,
  page = 1,
  limit = 100,
}) => {
  if (!studentId) {
    throw new ApiError(404, "Student profile not found.");
  }

  page = Number(page);
  limit = Number(limit);

  const enrollments = await Enrollment.find({
    student: studentId,
    status: {
      $ne: ENROLLMENT_STATUS.DROPPED,
    },
  }).select("_id");

  const enrollmentIds = enrollments.map((enrollment) => enrollment._id);

  const filter = {
    enrollment: {
      $in: enrollmentIds,
    },
  };

  const skip = (page - 1) * limit;

  const [submissions, total] = await Promise.all([
    AssignmentSubmission.find(filter)
      .populate({
        path: "assignment",
        select:
          "title description maxScore availableFrom dueDate courseOffering",
      })
      .populate({
        path: "enrollment",
        select: "student courseOffering",
      })
      .sort({
        submittedAt: -1,
      })
      .skip(skip)
      .limit(limit),

    AssignmentSubmission.countDocuments(filter),
  ]);

  return {
    submissions,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getFacultyIdByUserId = async (userId) => {
  if (!userId) {
    throw new ApiError(401, "Authenticated user is required.");
  }

  const faculty = await Faculty.findOne({
    user: userId,
  }).select("_id");

  if (!faculty) {
    throw new ApiError(404, "Faculty profile not found.");
  }

  return faculty._id;
};

const getFacultyAssignmentIds = async (userId) => {
  const facultyId = await getFacultyIdByUserId(userId);

  const assignments = await Assignment.find({
    courseOffering: {
      $in: await getFacultyCourseOfferingIds(facultyId),
    },
  }).select("_id");

  return assignments.map((assignment) => assignment._id);
};

const getFacultyCourseOfferingIds = async (facultyId) => {
  const CourseOffering = (
    await import("../course-offering/courseOffering.model.js")
  ).default;

  const courseOfferings = await CourseOffering.find({
    faculty: facultyId,
  }).select("_id");

  return courseOfferings.map((courseOffering) => courseOffering._id);
};

export const createAssignmentSubmission = async ({
  payload,
  userRole,
  studentId,
}) => {
  const assignment = await Assignment.findById(payload.assignment);

  if (!assignment) {
    throw new ApiError(404, "Assignment not found.");
  }

  const enrollment = await Enrollment.findById(payload.enrollment);

  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found.");
  }

  if (enrollment.status === ENROLLMENT_STATUS.DROPPED) {
    throw new ApiError(400, "Cannot submit using a dropped enrollment.");
  }

  if (
    enrollment.courseOffering.toString() !==
    assignment.courseOffering.toString()
  ) {
    throw new ApiError(
      400,
      "Enrollment does not belong to this course offering.",
    );
  }

  if (userRole === ROLES.STUDENT) {
    if (!studentId) {
      throw new ApiError(404, "Student profile not found.");
    }

    if (enrollment.student.toString() !== studentId.toString()) {
      throw new ApiError(
        403,
        "You cannot submit an assignment for another student.",
      );
    }
  }

  const duplicate = await AssignmentSubmission.findOne({
    assignment: payload.assignment,
    enrollment: payload.enrollment,
  });

  if (duplicate) {
    throw new ApiError(409, "Assignment has already been submitted.");
  }

  const submittedAt = payload.submittedAt ?? new Date();

  if (submittedAt < assignment.availableFrom) {
    throw new ApiError(
      400,
      "Submission date cannot be before the assignment becomes available.",
    );
  }

  if (submittedAt > assignment.dueDate) {
    throw new ApiError(
      400,
      "Submission date cannot be after the assignment due date.",
    );
  }

  if (payload.score !== undefined && payload.score > assignment.maxScore) {
    throw new ApiError(400, `Score cannot exceed ${assignment.maxScore}.`);
  }

  return AssignmentSubmission.create({
    ...payload,
    submittedAt,
  });
};

export const getAssignmentSubmissions = async ({
  page = 1,
  limit = 10,
  assignment,
  enrollment,
  studentId,
  userRole,
  userId,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (userRole === ROLES.STUDENT) {
    throw new ApiError(403, "Students cannot access assignment submissions.");
  }

  if (assignment) {
    filter.assignment = assignment;
  }

  if (enrollment) {
    filter.enrollment = enrollment;
  }

  // Faculty restriction
  if (userRole === ROLES.FACULTY) {
    if (!userId) {
      throw new ApiError(401, "Authenticated user not found.");
    }

    const faculty = await Faculty.findOne({
      user: userId,
    }).select("_id user employeeId");

    if (!faculty) {
      throw new ApiError(404, "Faculty profile not found.");
    }

    console.log("FACULTY:", faculty);

    const courseOfferings = await CourseOffering.find({
      faculty: faculty._id,
    }).select("_id faculty");

    console.log("FACULTY COURSE OFFERINGS:", courseOfferings);
    const allCourseOfferings = await CourseOffering.find({})
      .select("_id faculty courseCode")
      .lean();

    console.log("===== ALL COURSE OFFERINGS =====");
    console.log(allCourseOfferings);
    const courseOfferingIds = courseOfferings.map((item) => item._id);

    const assignments = await Assignment.find({
      courseOffering: {
        $in: courseOfferingIds,
      },
    }).select("_id title courseOffering");

    console.log("FACULTY ASSIGNMENTS:", assignments);

    const assignmentIds = assignments.map((item) => item._id);

    filter.assignment = {
      $in: assignmentIds,
    };

    console.log("SUBMISSION FILTER:", filter);
  }

  const skip = (page - 1) * limit;

  const [submissions, total] = await Promise.all([
    AssignmentSubmission.find(filter)
      .populate({
        path: "assignment",
        select:
          "title description maxScore availableFrom dueDate courseOffering",
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
      .populate({
        path: "enrollment",
        populate: {
          path: "student",
          populate: {
            path: "user",
            select: "firstName middleName lastName suffix email",
          },
        },
      })
      .sort({
        submittedAt: -1,
      })
      .skip(skip)
      .limit(limit),

    AssignmentSubmission.countDocuments(filter),
  ]);

  return {
    submissions,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAssignmentSubmissionById = async (
  id,
  { studentId, userRole, userId } = {},
) => {
  const submission = await AssignmentSubmission.findById(id)
    .populate({
      path: "assignment",
      populate: {
        path: "courseOffering",
        select: "faculty",
      },
    })
    .populate({
      path: "enrollment",
      populate: {
        path: "student",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      },
    });

  if (!submission) {
    throw new ApiError(404, "Assignment submission not found.");
  }

  if (userRole === ROLES.STUDENT) {
    if (!studentId) {
      throw new ApiError(404, "Student profile not found.");
    }

    const submissionStudentId = submission.enrollment?.student?._id;

    if (
      !submissionStudentId ||
      submissionStudentId.toString() !== studentId.toString()
    ) {
      throw new ApiError(
        403,
        "You cannot access another student's submission.",
      );
    }
  }

  if (userRole === ROLES.FACULTY) {
    if (!userId) {
      throw new ApiError(401, "Authenticated user not found.");
    }

    const faculty = await Faculty.findOne({
      user: userId,
    }).select("_id");

    if (!faculty) {
      throw new ApiError(404, "Faculty profile not found.");
    }

    const assignmentFacultyId = submission.assignment?.courseOffering?.faculty;

    if (
      !assignmentFacultyId ||
      assignmentFacultyId.toString() !== faculty._id.toString()
    ) {
      throw new ApiError(
        403,
        "You cannot access another faculty's submission.",
      );
    }
  }

  return submission;
};

export const updateAssignmentSubmission = async (
  id,
  payload,
  { userRole, userId } = {},
) => {
  if (payload.assignment !== undefined || payload.enrollment !== undefined) {
    throw new ApiError(
      400,
      "Assignment and enrollment cannot be changed after submission.",
    );
  }

  const submission = await AssignmentSubmission.findById(id);

  if (!submission) {
    throw new ApiError(404, "Assignment submission not found.");
  }

  const assignment = await Assignment.findById(submission.assignment);

  if (!assignment) {
    throw new ApiError(404, "Assignment not found.");
  }

  /*
   * Faculty can only grade submissions
   * belonging to their own course offerings.
   */
  if (userRole === ROLES.FACULTY) {
    if (!userId) {
      throw new ApiError(401, "Authenticated user not found.");
    }

    const faculty = await Faculty.findOne({
      user: userId,
    }).select("_id");

    if (!faculty) {
      throw new ApiError(404, "Faculty profile not found.");
    }

    const courseOffering = await CourseOffering.findOne({
      _id: assignment.courseOffering,
      faculty: faculty._id,
    }).select("_id");

    if (!courseOffering) {
      throw new ApiError(
        403,
        "You cannot grade submissions for another faculty's course.",
      );
    }
  }

  if (payload.score !== undefined && payload.score > assignment.maxScore) {
    throw new ApiError(400, `Score cannot exceed ${assignment.maxScore}.`);
  }

  if (payload.score !== undefined && payload.score < 0) {
    throw new ApiError(400, "Score cannot be negative.");
  }

  Object.assign(submission, payload);

  await submission.save();

  return getAssignmentSubmissionById(submission.id, {
    userRole,
    userId,
  });
};

export const deleteAssignmentSubmission = async (id) => {
  const submission = await AssignmentSubmission.findById(id);

  if (!submission) {
    throw new ApiError(404, "Assignment submission not found.");
  }

  await submission.deleteOne();
};
