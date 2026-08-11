import express from "express";

import * as courseOfferingController from "./courseOffering.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";

import {
  createCourseOfferingSchema,
  updateCourseOfferingSchema,
} from "./courseOffering.validation.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(createCourseOfferingSchema),
  courseOfferingController.createCourseOffering,
);

router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT),
  courseOfferingController.getCourseOfferings,
);

router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY),
  courseOfferingController.getCourseOfferingById,
);

router.patch(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(updateCourseOfferingSchema),
  courseOfferingController.updateCourseOffering,
);

router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  courseOfferingController.deleteCourseOffering,
);

export default router;
