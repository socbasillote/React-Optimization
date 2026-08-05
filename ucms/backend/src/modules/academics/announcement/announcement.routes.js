import express from "express";

import * as announcementController from "./announcement.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";

import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from "./announcement.validation.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY),
  validate(createAnnouncementSchema),
  announcementController.createAnnouncement,
);

router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT),
  announcementController.getAnnouncements,
);

router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT),
  announcementController.getAnnouncementById,
);

router.patch(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY),
  validate(updateAnnouncementSchema),
  announcementController.updateAnnouncement,
);

router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  announcementController.deleteAnnouncement,
);

export default router;
