import express from "express";

import * as facultyController from "./faculty.controller.js";

import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import validate from "../../middleware/validate.js";

import {
  createFacultySchema,
  updateFacultySchema,
} from "./faculty.validation.js";

import { ROLES } from "../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(createFacultySchema),
  facultyController.createFaculty,
);

router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  facultyController.getFaculties,
);

router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  facultyController.getFacultyById,
);

router.patch(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(updateFacultySchema),
  facultyController.updateFaculty,
);

router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  facultyController.deleteFaculty,
);

export default router;
