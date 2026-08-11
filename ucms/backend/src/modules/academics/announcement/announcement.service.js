import ApiError from "../../../utils/ApiError.js";

import Announcement from "./announcement.model.js";
import CourseOffering from "../course-offering/courseOffering.model.js";

import Enrollment from "../enrollment/enrollment.model.js";

export const createAnnouncement = async (payload) => {
  const courseOffering = await CourseOffering.findById(payload.courseOffering);

  if (!courseOffering) {
    throw new ApiError(404, "Course offering not found.");
  }

  return Announcement.create(payload);
};

export const getAnnouncements = async ({
  page = 1,
  limit = 10,
  courseOffering,
  studentId,
  userRole,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (courseOffering) {
    filter.courseOffering = courseOffering;
  }

  if (userRole === "STUDENT") {
    const enrollments = await Enrollment.find({
      student: studentId,
    }).select("courseOffering");

    const courseOfferingIds = enrollments.map(
      (enrollment) => enrollment.courseOffering,
    );

    filter.courseOffering = {
      $in: courseOfferingIds,
    };
  }

  const skip = (page - 1) * limit;

  const [announcements, total] = await Promise.all([
    Announcement.find(filter)
      .populate("courseOffering")
      .sort({
        publishedAt: -1,
      })
      .skip(skip)
      .limit(limit),

    Announcement.countDocuments(filter),
  ]);

  return {
    announcements,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAnnouncementById = async (id) => {
  const announcement =
    await Announcement.findById(id).populate("courseOffering");

  if (!announcement) {
    throw new ApiError(404, "Announcement not found.");
  }

  return announcement;
};

export const updateAnnouncement = async (id, payload) => {
  const announcement = await Announcement.findById(id);

  if (!announcement) {
    throw new ApiError(404, "Announcement not found.");
  }

  if (
    payload.courseOffering &&
    payload.courseOffering !== announcement.courseOffering.toString()
  ) {
    const courseOffering = await CourseOffering.findById(
      payload.courseOffering,
    );

    if (!courseOffering) {
      throw new ApiError(404, "Course offering not found.");
    }
  }

  Object.assign(announcement, payload);

  await announcement.save();

  return getAnnouncementById(announcement.id);
};

export const deleteAnnouncement = async (id) => {
  const announcement = await Announcement.findById(id);

  if (!announcement) {
    throw new ApiError(404, "Announcement not found.");
  }

  await announcement.deleteOne();
};
