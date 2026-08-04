import ApiError from "../../../utils/ApiError.js";
import Subject from "./subject.model.js";

export const createSubject = async (payload) => {
  const duplicate = await Subject.findOne({
    $or: [{ code: payload.code.toUpperCase() }, { title: payload.title }],
  });

  if (duplicate) {
    throw new ApiError(409, "Subject code or title already exists.");
  }

  return Subject.create(payload);
};

export const getSubjects = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      {
        code: {
          $regex: search,
          $options: "i",
        },
      },
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const skip = (page - 1) * limit;

  const [subjects, total] = await Promise.all([
    Subject.find(filter).sort({ code: 1 }).skip(skip).limit(limit),

    Subject.countDocuments(filter),
  ]);

  return {
    subjects,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getSubjectById = async (id) => {
  const subject = await Subject.findById(id);

  if (!subject) {
    throw new ApiError(404, "Subject not found.");
  }

  return subject;
};

export const updateSubject = async (id, payload) => {
  const subject = await Subject.findById(id);

  if (!subject) {
    throw new ApiError(404, "Subject not found.");
  }

  if (payload.code || payload.title) {
    const duplicate = await Subject.findOne({
      _id: { $ne: id },
      $or: [{ code: payload.code?.toUpperCase() }, { title: payload.title }],
    });

    if (duplicate) {
      throw new ApiError(409, "Subject code or title already exists.");
    }
  }

  Object.assign(subject, payload);

  await subject.save();

  return getSubjectById(subject.id);
};

export const deleteSubject = async (id) => {
  const subject = await Subject.findById(id);

  if (!subject) {
    throw new ApiError(404, "Subject not found.");
  }

  /*
   * Curriculum Subject dependency check.
   * Implement after the Curriculum Subject module.
   */

  await subject.deleteOne();
};
