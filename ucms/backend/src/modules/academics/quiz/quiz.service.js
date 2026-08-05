import ApiError from "../../../utils/ApiError.js";

import Quiz from "./quiz.model.js";
import CourseOffering from "../course-offering/courseOffering.model.js";

export const createQuiz = async (payload) => {
  const courseOffering = await CourseOffering.findById(payload.courseOffering);

  if (!courseOffering) {
    throw new ApiError(404, "Course offering not found.");
  }

  const duplicate = await Quiz.findOne({
    courseOffering: payload.courseOffering,
    title: payload.title,
  });

  if (duplicate) {
    throw new ApiError(
      409,
      "Quiz title already exists for this course offering.",
    );
  }

  return Quiz.create(payload);
};

export const getQuizzes = async ({ page = 1, limit = 10, courseOffering }) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (courseOffering) {
    filter.courseOffering = courseOffering;
  }

  const skip = (page - 1) * limit;

  const [quizzes, total] = await Promise.all([
    Quiz.find(filter)
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

    Quiz.countDocuments(filter),
  ]);

  return {
    quizzes,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getQuizById = async (id) => {
  const quiz = await Quiz.findById(id).populate({
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

  if (!quiz) {
    throw new ApiError(404, "Quiz not found.");
  }

  return quiz;
};

export const updateQuiz = async (id, payload) => {
  const quiz = await Quiz.findById(id);

  if (!quiz) {
    throw new ApiError(404, "Quiz not found.");
  }

  const courseOffering = payload.courseOffering ?? quiz.courseOffering;

  const title = payload.title ?? quiz.title;

  if (payload.courseOffering) {
    const exists = await CourseOffering.findById(payload.courseOffering);

    if (!exists) {
      throw new ApiError(404, "Course offering not found.");
    }
  }

  const duplicate = await Quiz.findOne({
    _id: { $ne: id },
    courseOffering,
    title,
  });

  if (duplicate) {
    throw new ApiError(
      409,
      "Quiz title already exists for this course offering.",
    );
  }

  const availableFrom = payload.availableFrom ?? quiz.availableFrom;

  const dueDate = payload.dueDate ?? quiz.dueDate;

  if (availableFrom > dueDate) {
    throw new ApiError(400, "Due date must be after the available date.");
  }

  Object.assign(quiz, payload);

  await quiz.save();

  return getQuizById(quiz.id);
};

export const deleteQuiz = async (id) => {
  const quiz = await Quiz.findById(id);

  if (!quiz) {
    throw new ApiError(404, "Quiz not found.");
  }

  /*
   * Quiz Submission dependency check.
   * Implement after Quiz Submission module.
   */

  await quiz.deleteOne();
};
