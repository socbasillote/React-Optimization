import ApiError from "../../../utils/ApiError.js";

import Quiz from "../quiz/quiz.model.js";
import QuizSubmission from "./quizSubmission.model.js";
import Enrollment from "../enrollment/enrollment.model.js";
import Faculty from "../../faculty/faculty.model.js";
import CourseOffering from "../course-offering/courseOffering.model.js";

import { ENROLLMENT_STATUS } from "../../../constants/enrollmentStatus.js";
import { ROLES } from "../../../constants/roles.js";

export const createQuizSubmission = async ({
  payload,
  userRole,
  studentId,
}) => {
  const quiz = await Quiz.findById(payload.quiz);

  if (!quiz) {
    throw new ApiError(404, "Quiz not found.");
  }

  const enrollment = await Enrollment.findById(payload.enrollment);

  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found.");
  }

  if (enrollment.status === ENROLLMENT_STATUS.DROPPED) {
    throw new ApiError(400, "Cannot submit using a dropped enrollment.");
  }

  if (enrollment.courseOffering.toString() !== quiz.courseOffering.toString()) {
    throw new ApiError(
      400,
      "Enrollment does not belong to this course offering.",
    );
  }

  // STUDENT OWNERSHIP CHECK
  if (userRole === ROLES.STUDENT) {
    if (!studentId) {
      throw new ApiError(404, "Student profile not found.");
    }

    if (enrollment.student.toString() !== studentId.toString()) {
      throw new ApiError(403, "You cannot submit a quiz for another student.");
    }
  }

  const duplicate = await QuizSubmission.findOne({
    quiz: payload.quiz,
    enrollment: payload.enrollment,
  });

  if (duplicate) {
    throw new ApiError(409, "Quiz has already been submitted.");
  }

  const startedAt = payload.startedAt ?? new Date();
  const submittedAt = payload.submittedAt ?? startedAt;

  if (startedAt < quiz.availableFrom) {
    throw new ApiError(400, "Quiz has not opened yet.");
  }

  if (submittedAt < startedAt) {
    throw new ApiError(400, "Submission time cannot be before the start time.");
  }

  if (quiz.dueDate && submittedAt > quiz.dueDate) {
    throw new ApiError(400, "Quiz submission deadline has passed.");
  }

  if (payload.score !== undefined && payload.score > quiz.maxScore) {
    throw new ApiError(400, `Score cannot exceed ${quiz.maxScore}.`);
  }

  return QuizSubmission.create({
    ...payload,
    startedAt,
    submittedAt,
  });
};

export const getQuizSubmissions = async ({
  page = 1,
  limit = 10,
  quiz,
  enrollment,
  studentId,
  userRole,
  userId,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (quiz) {
    filter.quiz = quiz;
  }

  if (enrollment) {
    filter.enrollment = enrollment;
  }

  // =========================
  // STUDENT
  // =========================

  if (userRole === ROLES.STUDENT) {
    if (!studentId) {
      throw new ApiError(404, "Student profile not found.");
    }

    const studentEnrollments = await Enrollment.find({
      student: studentId,
    }).select("_id");

    const enrollmentIds = studentEnrollments.map((item) => item._id);

    filter.enrollment = {
      $in: enrollmentIds,
    };
  }

  // =========================
  // FACULTY
  // =========================

  if (userRole === ROLES.FACULTY) {
    if (!userId) {
      throw new ApiError(404, "Faculty user information not found.");
    }

    const faculty = await Faculty.findOne({
      user: userId,
    }).select("_id");

    if (!faculty) {
      throw new ApiError(404, "Faculty profile not found.");
    }

    const courseOfferings = await CourseOffering.find({
      faculty: faculty._id,
    }).select("_id");

    const courseOfferingIds = courseOfferings.map((item) => item._id);

    const facultyQuizzes = await Quiz.find({
      courseOffering: {
        $in: courseOfferingIds,
      },
    }).select("_id");

    const quizIds = facultyQuizzes.map((item) => item._id);

    filter.quiz = {
      $in: quizIds,
    };
  }

  const skip = (page - 1) * limit;

  const [submissions, total] = await Promise.all([
    QuizSubmission.find(filter)
      .populate({
        path: "quiz",
        select:
          "title description maxScore availableFrom dueDate timeLimit courseOffering",
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
            {
              path: "faculty",
              populate: {
                path: "user",
                select: "firstName lastName",
              },
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

    QuizSubmission.countDocuments(filter),
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

export const getQuizSubmissionById = async (
  id,
  { studentId, userRole, userId } = {},
) => {
  const submission = await QuizSubmission.findById(id)
    .populate({
      path: "quiz",
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
          {
            path: "faculty",
            populate: {
              path: "user",
              select: "firstName lastName",
            },
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
    });

  if (!submission) {
    throw new ApiError(404, "Quiz submission not found.");
  }

  // =========================
  // STUDENT OWNERSHIP
  // =========================

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
        "You cannot access another student's quiz submission.",
      );
    }
  }

  // =========================
  // FACULTY OWNERSHIP
  // =========================

  if (userRole === ROLES.FACULTY) {
    if (!userId) {
      throw new ApiError(404, "Faculty user information not found.");
    }

    const faculty = await Faculty.findOne({
      user: userId,
    }).select("_id");

    if (!faculty) {
      throw new ApiError(404, "Faculty profile not found.");
    }

    const courseOffering = submission.quiz?.courseOffering;

    const courseOfferingFacultyId =
      typeof courseOffering.faculty === "object"
        ? courseOffering.faculty?._id
        : courseOffering.faculty;

    if (
      !courseOfferingFacultyId ||
      courseOfferingFacultyId.toString() !== faculty._id.toString()
    ) {
      throw new ApiError(
        403,
        "You cannot access a quiz submission outside your course offerings.",
      );
    }
  }

  return submission;
};

export const updateQuizSubmission = async (
  id,
  payload,
  { userRole, userId } = {},
) => {
  const submission = await QuizSubmission.findById(id);

  if (!submission) {
    throw new ApiError(404, "Quiz submission not found.");
  }

  if (payload.quiz !== undefined || payload.enrollment !== undefined) {
    throw new ApiError(
      400,
      "Quiz and enrollment cannot be changed after submission.",
    );
  }

  const quiz = await Quiz.findById(submission.quiz);

  if (!quiz) {
    throw new ApiError(404, "Quiz not found.");
  }

  // FACULTY CAN ONLY GRADE THEIR OWN QUIZZES
  if (userRole === ROLES.FACULTY) {
    const faculty = await Faculty.findOne({
      user: userId,
    }).select("_id");

    if (!faculty) {
      throw new ApiError(404, "Faculty profile not found.");
    }

    const courseOffering = await CourseOffering.findById(
      quiz.courseOffering,
    ).select("faculty");

    console.log("===== QUIZ GRADING ACCESS =====");
    console.log("userId:", userId);
    console.log("userRole:", userRole);
    console.log("faculty:", faculty);
    console.log("quizId:", submission.quiz);
    console.log("courseOfferingId:", quiz.courseOffering);
    console.log("courseOffering:", courseOffering);

    if (!courseOffering) {
      throw new ApiError(404, "Course offering not found.");
    }

    if (!courseOffering.faculty) {
      throw new ApiError(400, "Course offering has no assigned faculty.");
    }

    if (courseOffering.faculty.toString() !== faculty._id.toString()) {
      throw new ApiError(
        403,
        "You cannot grade a quiz submission outside your course offerings.",
      );
    }
  }

  if (payload.startedAt && payload.startedAt < quiz.availableFrom) {
    throw new ApiError(400, "Quiz has not opened yet.");
  }

  if (payload.startedAt || payload.submittedAt) {
    const startedAt = payload.startedAt ?? submission.startedAt;

    const submittedAt = payload.submittedAt ?? submission.submittedAt;

    if (submittedAt < startedAt) {
      throw new ApiError(
        400,
        "Submission time cannot be before the start time.",
      );
    }
  }

  if (payload.score !== undefined && payload.score > quiz.maxScore) {
    throw new ApiError(400, `Score cannot exceed ${quiz.maxScore}.`);
  }

  Object.assign(submission, payload);

  await submission.save();

  return getQuizSubmissionById(submission.id, {
    userRole,
    userId,
  });
};

export const deleteQuizSubmission = async (id) => {
  const submission = await QuizSubmission.findById(id);

  if (!submission) {
    throw new ApiError(404, "Quiz submission not found.");
  }

  await submission.deleteOne();
};
