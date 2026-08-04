import express from "express";

import * as sectionController from "./section.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";

import {
  createSectionSchema,
  updateSectionSchema,
} from "./section.validation.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN),
  validate(createSectionSchema),
  sectionController.createSection,
);

router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  sectionController.getSections,
);

router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  sectionController.getSectionById,
);

router.patch(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  validate(updateSectionSchema),
  sectionController.updateSection,
);

router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  sectionController.deleteSection,
);

export default router;
