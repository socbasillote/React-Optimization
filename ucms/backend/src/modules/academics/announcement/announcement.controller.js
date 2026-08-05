import * as announcementService from "./announcement.service.js";
import sendResponse from "../../../utils/sendResponse.js";

export const createAnnouncement = async (req, res) => {
  const announcement = await announcementService.createAnnouncement(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "Announcement created successfully.",
    data: announcement,
  });
};

export const getAnnouncements = async (req, res) => {
  const result = await announcementService.getAnnouncements(req.query);

  sendResponse(res, {
    message: "Announcements retrieved successfully.",
    data: result.announcements,
    meta: result.meta,
  });
};

export const getAnnouncementById = async (req, res) => {
  const announcement = await announcementService.getAnnouncementById(
    req.params.id,
  );

  sendResponse(res, {
    message: "Announcement retrieved successfully.",
    data: announcement,
  });
};

export const updateAnnouncement = async (req, res) => {
  const announcement = await announcementService.updateAnnouncement(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    message: "Announcement updated successfully.",
    data: announcement,
  });
};

export const deleteAnnouncement = async (req, res) => {
  await announcementService.deleteAnnouncement(req.params.id);

  sendResponse(res, {
    message: "Announcement deleted successfully.",
    data: null,
  });
};
