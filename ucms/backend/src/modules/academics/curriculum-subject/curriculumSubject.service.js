import ApiError from "../../../utils/ApiError.js";

import Curriculum from "../curriculum/curriculum.model.js";
import Subject from "../subject/subject.model.js";
import CurriculumSubject from "./curriculumSubject.model.js";

export const createCurriculumSubject = async (payload) => {
  const curriculum = await Curriculum.findById(payload.curriculum);

  if (!curriculum) {
    throw new ApiError(404, "Curriculum not found.");
  }

  const subject = await Subject.findById(payload.subject);

  if (!subject) {
    throw new ApiError(404, "Subject not found.");
  }

  if (payload.prerequisite) {
    const prerequisite = await Subject.findById(payload.prerequisite);

    if (!prerequisite) {
      throw new ApiError(404, "Prerequisite subject not found.");
    }

    if (payload.prerequisite === payload.subject) {
      throw new ApiError(400, "A subject cannot be its own prerequisite.");
    }
  }

  const duplicate = await CurriculumSubject.findOne({
    curriculum: payload.curriculum,
    subject: payload.subject,
  });

  if (duplicate) {
    throw new ApiError(409, "Subject already exists in this curriculum.");
  }

  return CurriculumSubject.create(payload);
};

export const getCurriculumSubjects = async ({
  page = 1,
  limit = 10,
  curriculum,
  yearLevel,
  term,
  status,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (curriculum) filter.curriculum = curriculum;
  if (yearLevel) filter.yearLevel = Number(yearLevel);
  if (term) filter.term = Number(term);
  if (status) filter.status = status;

  const skip = (page - 1) * limit;

  const [curriculumSubjects, total] = await Promise.all([
    CurriculumSubject.find(filter)
      .populate("curriculum", "name")
      .populate("subject", "code title units")
      .populate("prerequisite", "code title")
      .sort({
        yearLevel: 1,
        term: 1,
        "subject.code": 1,
      })
      .skip(skip)
      .limit(limit),

    CurriculumSubject.countDocuments(filter),
  ]);

  return {
    curriculumSubjects,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCurriculumSubjectById = async (id) => {
  const curriculumSubject = await CurriculumSubject.findById(id)
    .populate("curriculum", "name")
    .populate("subject", "code title units")
    .populate("prerequisite", "code title");

  if (!curriculumSubject) {
    throw new ApiError(404, "Curriculum subject not found.");
  }

  return curriculumSubject;
};

export const updateCurriculumSubject = async (id, payload) => {
  const curriculumSubject = await CurriculumSubject.findById(id);

  if (!curriculumSubject) {
    throw new ApiError(404, "Curriculum subject not found.");
  }

  const curriculumId = payload.curriculum || curriculumSubject.curriculum;

  const subjectId = payload.subject || curriculumSubject.subject;

  if (payload.curriculum) {
    const curriculum = await Curriculum.findById(payload.curriculum);

    if (!curriculum) {
      throw new ApiError(404, "Curriculum not found.");
    }
  }

  if (payload.subject) {
    const subject = await Subject.findById(payload.subject);

    if (!subject) {
      throw new ApiError(404, "Subject not found.");
    }
  }

  if (payload.prerequisite) {
    const prerequisite = await Subject.findById(payload.prerequisite);

    if (!prerequisite) {
      throw new ApiError(404, "Prerequisite subject not found.");
    }

    if (payload.prerequisite === subjectId.toString()) {
      throw new ApiError(400, "A subject cannot be its own prerequisite.");
    }
  }

  const duplicate = await CurriculumSubject.findOne({
    _id: { $ne: id },
    curriculum: curriculumId,
    subject: subjectId,
  });

  if (duplicate) {
    throw new ApiError(409, "Subject already exists in this curriculum.");
  }

  Object.assign(curriculumSubject, payload);

  await curriculumSubject.save();

  return getCurriculumSubjectById(curriculumSubject.id);
};

export const deleteCurriculumSubject = async (id) => {
  const curriculumSubject = await CurriculumSubject.findById(id);

  if (!curriculumSubject) {
    throw new ApiError(404, "Curriculum subject not found.");
  }

  await curriculumSubject.deleteOne();
};
