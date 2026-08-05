import ApiError from "../../../utils/ApiError.js";

import Assignment from "../assignment/assignment.model.js";
import AssignmentSubmission from "./assignmentSubmission.model.js";
import Enrollment from "../enrollment/enrollment.model.js";

import { ENROLLMENT_STATUS } from "../../../constants/enrollmentStatus.js";

export const createAssignmentSubmission = async (payload) => {
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
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (assignment) filter.assignment = assignment;
  if (enrollment) filter.enrollment = enrollment;

  const skip = (page - 1) * limit;

  const [submissions, total] = await Promise.all([
    AssignmentSubmission.find(filter)
      .populate({
        path: "assignment",
        select: "title maxScore availableFrom dueDate",
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

export const getAssignmentSubmissionById = async (id) => {
  const submission = await AssignmentSubmission.findById(id)
    .populate({
      path: "assignment",
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

  return submission;
};

export const updateAssignmentSubmission = async (id, payload) => {
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

  if (payload.score !== undefined && payload.score > assignment.maxScore) {
    throw new ApiError(400, `Score cannot exceed ${assignment.maxScore}.`);
  }

  Object.assign(submission, payload);

  await submission.save();

  return getAssignmentSubmissionById(submission.id);
};

export const deleteAssignmentSubmission = async (id) => {
  const submission = await AssignmentSubmission.findById(id);

  if (!submission) {
    throw new ApiError(404, "Assignment submission not found.");
  }

  await submission.deleteOne();
};
