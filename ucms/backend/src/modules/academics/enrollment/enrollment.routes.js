import express from "express";

import * as enrollmentController from "./enrollment.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";

import {
  createEnrollmentSchema,
  updateEnrollmentSchema,
} from "./enrollment.validation.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(createEnrollmentSchema),
  enrollmentController.createEnrollment,
);

router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY),
  enrollmentController.getEnrollments,
);

router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY),
  enrollmentController.getEnrollmentById,
);

router.patch(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(updateEnrollmentSchema),
  enrollmentController.updateEnrollment,
);

router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  enrollmentController.deleteEnrollment,
);

export default router;
