import ApiError from "../../../utils/ApiError.js";

import CourseOffering from "./courseOffering.model.js";

import CurriculumSubject from "../curriculum-subject/curriculumSubject.model.js";
import Faculty from "../../faculty/faculty.model.js";
import Section from "../section/section.model.js";
import AcademicYear from "../academic-year/academicYear.model.js";
import AcademicTerm from "../academic-term/academicTerm.model.js";

export const createCourseOffering = async (payload) => {
  const curriculumSubject = await CurriculumSubject.findById(
    payload.curriculumSubject,
  );

  if (!curriculumSubject) {
    throw new ApiError(404, "Curriculum subject not found.");
  }

  const faculty = await Faculty.findById(payload.faculty);

  if (!faculty) {
    throw new ApiError(404, "Faculty not found.");
  }

  const section = await Section.findById(payload.section);

  if (!section) {
    throw new ApiError(404, "Section not found.");
  }

  const academicYear = await AcademicYear.findById(payload.academicYear);

  if (!academicYear) {
    throw new ApiError(404, "Academic year not found.");
  }

  const academicTerm = await AcademicTerm.findById(payload.academicTerm);

  if (!academicTerm) {
    throw new ApiError(404, "Academic term not found.");
  }

  if (academicTerm.academicYear.toString() !== academicYear.id) {
    throw new ApiError(
      400,
      "Academic term does not belong to the selected academic year.",
    );
  }

  const duplicate = await CourseOffering.findOne({
    curriculumSubject: payload.curriculumSubject,
    section: payload.section,
    academicYear: payload.academicYear,
    academicTerm: payload.academicTerm,
  });

  if (duplicate) {
    throw new ApiError(409, "Course offering already exists.");
  }

  return CourseOffering.create(payload);
};

export const getCourseOfferings = async ({
  page = 1,
  limit = 10,
  academicYear,
  academicTerm,
  faculty,
  section,
  status,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (academicYear) filter.academicYear = academicYear;
  if (academicTerm) filter.academicTerm = academicTerm;
  if (faculty) filter.faculty = faculty;
  if (section) filter.section = section;
  if (status) filter.status = status;

  const skip = (page - 1) * limit;

  const [courseOfferings, total] = await Promise.all([
    CourseOffering.find(filter)
      .populate({
        path: "curriculumSubject",
        populate: [
          {
            path: "subject",
            select: "code title units",
          },
          {
            path: "curriculum",
            select: "name",
          },
        ],
      })
      .populate({
        path: "faculty",
        populate: {
          path: "user",
          select: "firstName lastName",
        },
      })
      .populate("section", "name yearLevel")
      .populate("academicYear", "name")
      .populate("academicTerm", "name")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit),

    CourseOffering.countDocuments(filter),
  ]);

  return {
    courseOfferings,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCourseOfferingById = async (id) => {
  const courseOffering = await CourseOffering.findById(id)
    .populate({
      path: "curriculumSubject",
      populate: [
        {
          path: "subject",
          select: "code title units",
        },
        {
          path: "curriculum",
          select: "name",
        },
      ],
    })
    .populate({
      path: "faculty",
      populate: {
        path: "user",
        select: "firstName lastName",
      },
    })
    .populate("section", "name yearLevel")
    .populate("academicYear", "name")
    .populate("academicTerm", "name");

  if (!courseOffering) {
    throw new ApiError(404, "Course offering not found.");
  }

  return courseOffering;
};

export const updateCourseOffering = async (id, payload) => {
  const offering = await CourseOffering.findById(id);

  if (!offering) {
    throw new ApiError(404, "Course offering not found.");
  }

  const curriculumSubject =
    payload.curriculumSubject || offering.curriculumSubject;

  const section = payload.section || offering.section;

  const academicYear = payload.academicYear || offering.academicYear;

  const academicTerm = payload.academicTerm || offering.academicTerm;

  const duplicate = await CourseOffering.findOne({
    _id: { $ne: id },
    curriculumSubject,
    section,
    academicYear,
    academicTerm,
  });

  if (duplicate) {
    throw new ApiError(409, "Course offering already exists.");
  }

  if (payload.curriculumSubject) {
    const exists = await CurriculumSubject.findById(payload.curriculumSubject);

    if (!exists) {
      throw new ApiError(404, "Curriculum subject not found.");
    }
  }

  if (payload.faculty) {
    const exists = await Faculty.findById(payload.faculty);

    if (!exists) {
      throw new ApiError(404, "Faculty not found.");
    }
  }

  if (payload.section) {
    const exists = await Section.findById(payload.section);

    if (!exists) {
      throw new ApiError(404, "Section not found.");
    }
  }

  if (payload.academicYear) {
    const exists = await AcademicYear.findById(payload.academicYear);

    if (!exists) {
      throw new ApiError(404, "Academic year not found.");
    }
  }

  if (payload.academicTerm) {
    const exists = await AcademicTerm.findById(payload.academicTerm);

    if (!exists) {
      throw new ApiError(404, "Academic term not found.");
    }
  }

  Object.assign(offering, payload);

  await offering.save();

  return getCourseOfferingById(offering.id);
};

export const deleteCourseOffering = async (id) => {
  const offering = await CourseOffering.findById(id);

  if (!offering) {
    throw new ApiError(404, "Course offering not found.");
  }

  /*
   * Enrollment dependency check.
   * Implement after Enrollment module.
   */

  await offering.deleteOne();
};
