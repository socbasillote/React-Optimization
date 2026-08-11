import express from "express";

import * as studentController from "./student.controller.js";

import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import validate from "../../middleware/validate.js";

import {
  createStudentSchema,
  updateStudentSchema,
} from "./student.validation.js";

import { ROLES } from "../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(createStudentSchema),
  studentController.createStudent,
);

router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY),
  studentController.getStudents,
);

router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY),
  studentController.getStudentById,
);

router.get(
  "/me",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT),
  studentController.getCurrentStudent,
);

router.patch(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(updateStudentSchema),
  studentController.updateStudent,
);

router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  studentController.deleteStudent,
);

export default router;
