import ApiError from "../../../utils/ApiError.js";

import * as studentService from "../../students/student.service.js";

import Quiz from "../quiz/quiz.model.js";
import QuizQuestion from "../quiz-question/quizQuestion.model.js";
import QuizSubmission from "./quizSubmission.model.js";
import Enrollment from "../enrollment/enrollment.model.js";
import Faculty from "../../faculty/faculty.model.js";
import CourseOffering from "../course-offering/courseOffering.model.js";

import { ENROLLMENT_STATUS } from "../../../constants/enrollmentStatus.js";
import { ROLES } from "../../../constants/roles.js";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const normalizeAnswer = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim().toLowerCase();
};

const ensureStudentEnrollment = async ({ enrollmentId, studentId, quiz }) => {
  const enrollment = await Enrollment.findById(enrollmentId);

  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found.");
  }

  if (enrollment.student.toString() !== studentId.toString()) {
    throw new ApiError(
      403,
      "You cannot submit a quiz using another student's enrollment.",
    );
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

  return enrollment;
};

const ensureFacultyOwnsQuiz = async ({ userId, quiz }) => {
  const faculty = await Faculty.findOne({
    user: userId,
  }).select("_id");

  if (!faculty) {
    throw new ApiError(404, "Faculty profile not found.");
  }

  const courseOffering = await CourseOffering.findById(
    quiz.courseOffering,
  ).select("faculty");

  if (!courseOffering) {
    throw new ApiError(404, "Course offering not found.");
  }

  if (courseOffering.faculty.toString() !== faculty._id.toString()) {
    throw new ApiError(
      403,
      "You cannot access a quiz outside your course offerings.",
    );
  }

  return courseOffering;
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
    })
    .populate({
      path: "answers.question",
      select: "question type options correctAnswer points order",
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

    /*
     * Never expose the correct answer to students.
     */
    submission.answers = submission.answers.map((item) => {
      const answer = item.toObject();

      if (answer.question) {
        delete answer.question.correctAnswer;
      }

      return answer;
    });
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

    if (!courseOffering) {
      throw new ApiError(404, "Course offering not found.");
    }

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

export const deleteQuizSubmission = async (id) => {
  const submission = await QuizSubmission.findById(id);

  if (!submission) {
    throw new ApiError(404, "Quiz submission not found.");
  }

  await submission.deleteOne();
};

/*
|--------------------------------------------------------------------------
| Validate and grade answers
|--------------------------------------------------------------------------
*/

const validateAndGradeAnswers = async ({ quizId, answers = [] }) => {
  if (!Array.isArray(answers)) {
    throw new ApiError(400, "Answers must be an array.");
  }

  const questionIds = answers.map((item) => item.question);

  const uniqueQuestionIds = new Set(questionIds.map((id) => id.toString()));

  if (uniqueQuestionIds.size !== questionIds.length) {
    throw new ApiError(400, "A question cannot be answered more than once.");
  }

  if (questionIds.length === 0) {
    return {
      answers: [],
      score: 0,
      totalPoints: 0,
      hasManualGrading: false,
    };
  }

  const questions = await QuizQuestion.find({
    _id: {
      $in: questionIds,
    },
    quiz: quizId,
  }).select("_id type correctAnswer points order");

  if (questions.length !== uniqueQuestionIds.size) {
    throw new ApiError(
      400,
      "One or more questions do not belong to this quiz.",
    );
  }

  const questionMap = new Map(
    questions.map((question) => [question._id.toString(), question]),
  );

  let score = 0;
  let totalPoints = 0;
  let hasManualGrading = false;

  const normalizedAnswers = answers.map((item) => {
    const question = questionMap.get(item.question.toString());

    totalPoints += question.points ?? 0;

    const submittedAnswer = String(item.answer ?? "").trim();

    /*
     * Short answer is not automatically
     * graded yet.
     */
    if (question.type === "SHORT_ANSWER") {
      hasManualGrading = true;

      return {
        question: question._id,
        answer: submittedAnswer,
      };
    }

    const isCorrect =
      normalizeAnswer(submittedAnswer) ===
      normalizeAnswer(question.correctAnswer);

    if (isCorrect) {
      score += question.points ?? 0;
    }

    return {
      question: question._id,
      answer: submittedAnswer,
    };
  });

  return {
    answers: normalizedAnswers,
    score,
    totalPoints,
    hasManualGrading,
  };
};

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

export const createQuizSubmission = async ({
  payload,
  userId,
  studentId,
  userRole,
}) => {
  const quiz = await Quiz.findById(payload.quiz);

  if (!quiz) {
    throw new ApiError(404, "Quiz not found.");
  }

  /*
   * Find the submission created when
   * the student started the quiz.
   */
  const existingSubmission = await QuizSubmission.findOne({
    quiz: payload.quiz,
    enrollment: payload.enrollment,
  });

  if (!existingSubmission) {
    throw new ApiError(400, "Quiz has not been started.");
  }

  /*
   * Prevent submitting the same quiz twice.
   */
  if (existingSubmission.submittedAt) {
    throw new ApiError(409, "Quiz has already been submitted.");
  }

  let enrollment;

  /*
   * STUDENT
   * --------------------------------------------------
   * A student can only submit using their own
   * enrollment.
   */
  if (userRole === ROLES.STUDENT) {
    if (!studentId) {
      throw new ApiError(404, "Student profile not found.");
    }

    enrollment = await ensureStudentEnrollment({
      enrollmentId: payload.enrollment,
      studentId,
      quiz,
    });
  } else {
    /*
     * FACULTY / ADMIN / SUPER_ADMIN
     */
    enrollment = await Enrollment.findById(payload.enrollment);

    if (!enrollment) {
      throw new ApiError(404, "Enrollment not found.");
    }

    if (enrollment.status === ENROLLMENT_STATUS.DROPPED) {
      throw new ApiError(400, "Cannot submit using a dropped enrollment.");
    }

    if (
      enrollment.courseOffering.toString() !== quiz.courseOffering.toString()
    ) {
      throw new ApiError(
        400,
        "Enrollment does not belong to this course offering.",
      );
    }

    /*
     * Faculty may only access quizzes belonging
     * to their own course offerings.
     */
    if (userRole === ROLES.FACULTY) {
      await ensureFacultyOwnsQuiz({
        userId,
        quiz,
      });
    }
  }

  /*
   * Use the server-recorded start time.
   *
   * Do NOT trust payload.startedAt from
   * the client.
   */
  const startedAt = existingSubmission.startedAt;

  const submittedAt = new Date();

  /*
   * Verify the quiz was actually open when
   * it was started.
   */
  if (startedAt < quiz.availableFrom) {
    throw new ApiError(400, "Quiz has not opened yet.");
  }

  /*
   * Check the quiz deadline.
   */
  if (quiz.dueDate && submittedAt > quiz.dueDate) {
    throw new ApiError(400, "The quiz deadline has passed.");
  }

  /*
   * Check the time limit.
   *
   * Example:
   * startedAt = 10:00
   * timeLimit = 30
   * deadline = 10:30
   */
  if (quiz.timeLimit) {
    const deadline = new Date(startedAt.getTime() + quiz.timeLimit * 60 * 1000);

    if (submittedAt > deadline) {
      throw new ApiError(400, "The quiz time limit has expired.");
    }
  }

  /*
   * Validate answers and calculate the
   * automatically graded score.
   */
  const grading = await validateAndGradeAnswers({
    quizId: quiz._id,
    answers: payload.answers ?? [],
  });

  if (grading.score > quiz.maxScore) {
    throw new ApiError(400, `Score cannot exceed ${quiz.maxScore}.`);
  }

  /*
   * Update the submission that was created
   * when the quiz was started.
   */
  existingSubmission.answers = grading.answers;

  existingSubmission.submittedAt = submittedAt;

  existingSubmission.score = grading.score;

  await existingSubmission.save();

  return getQuizSubmissionById(existingSubmission._id);
};

/*
|--------------------------------------------------------------------------
| UPDATE / GRADE
|--------------------------------------------------------------------------
*/
export const updateQuizSubmission = async (
  id,
  payload,
  { userId, userRole } = {},
) => {
  const submission = await QuizSubmission.findById(id);

  if (!submission) {
    throw new ApiError(404, "Quiz submission not found.");
  }

  /*
   * This endpoint is now for grading.
   *
   * Quiz identity, enrollment, answers,
   * startedAt, and submittedAt are controlled
   * by the submission lifecycle.
   */
  const allowedFields = ["score", "feedback"];

  const attemptedFields = Object.keys(payload);

  const invalidFields = attemptedFields.filter(
    (field) => !allowedFields.includes(field),
  );

  if (invalidFields.length > 0) {
    throw new ApiError(400, "Only score and feedback can be updated.");
  }

  const quiz = await Quiz.findById(submission.quiz);

  if (!quiz) {
    throw new ApiError(404, "Quiz not found.");
  }

  // =========================
  // FACULTY GRADING ACCESS
  // =========================

  if (userRole === ROLES.FACULTY) {
    await ensureFacultyOwnsQuiz({
      userId,
      quiz,
    });
  }

  /*
   * Only submitted quizzes can be graded.
   */
  if (!submission.submittedAt) {
    throw new ApiError(400, "This quiz has not been submitted yet.");
  }

  /*
   * Validate score.
   */
  if (payload.score !== undefined) {
    if (payload.score < 0) {
      throw new ApiError(400, "Score cannot be negative.");
    }

    if (payload.score > quiz.maxScore) {
      throw new ApiError(400, `Score cannot exceed ${quiz.maxScore}.`);
    }

    submission.score = payload.score;
  }

  /*
   * Update faculty feedback.
   */
  if (payload.feedback !== undefined) {
    submission.feedback = payload.feedback;
  }

  await submission.save();

  /*
   * Re-fetch through the same authorization
   * layer so the returned object contains
   * the populated quiz, student, and questions.
   */
  return getQuizSubmissionById(submission._id, {
    userId,
    userRole,
  });
};

export const startQuiz = async ({ quizId, enrollmentId, userId, userRole }) => {
  const quiz = await Quiz.findById(quizId);

  if (!quiz) {
    throw new ApiError(404, "Quiz not found.");
  }

  if (userRole !== ROLES.STUDENT) {
    throw new ApiError(403, "Only students can start a quiz.");
  }

  const student = await studentService.getCurrentStudent(userId);

  if (!student) {
    throw new ApiError(404, "Student profile not found.");
  }

  const enrollment = await ensureStudentEnrollment({
    enrollmentId,
    studentId: student._id,
    quiz,
  });

  const existing = await QuizSubmission.findOne({
    quiz: quizId,
    enrollment: enrollment._id,
  });

  if (existing) {
    throw new ApiError(409, "Quiz has already been started or submitted.");
  }

  const now = new Date();

  if (now < quiz.availableFrom) {
    throw new ApiError(400, "Quiz has not opened yet.");
  }

  if (quiz.dueDate && now > quiz.dueDate) {
    throw new ApiError(400, "The quiz deadline has passed.");
  }

  return QuizSubmission.create({
    quiz: quiz._id,
    enrollment: enrollment._id,
    answers: [],
    startedAt: now,

    /*
     * We don't want a started quiz to
     * look submitted yet.
     */
    submittedAt: null,

    score: null,
    feedback: "",
  });
};
