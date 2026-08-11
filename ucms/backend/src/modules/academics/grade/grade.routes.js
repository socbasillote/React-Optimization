import express from "express";

import * as gradeController from "./grade.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";

import { createGradeSchema, updateGradeSchema } from "./grade.validation.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY),
  validate(createGradeSchema),
  gradeController.createGrade,
);

router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT),
  gradeController.getGrades,
);

router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY),
  gradeController.getGradeById,
);

router.patch(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY),
  validate(updateGradeSchema),
  gradeController.updateGrade,
);

router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  gradeController.deleteGrade,
);

export default router;
