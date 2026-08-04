import express from "express";

import * as curriculumSubjectController from "./curriculumSubject.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";

import {
  createCurriculumSubjectSchema,
  updateCurriculumSubjectSchema,
} from "./curriculumSubject.validation.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN),
  validate(createCurriculumSubjectSchema),
  curriculumSubjectController.createCurriculumSubject,
);

router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  curriculumSubjectController.getCurriculumSubjects,
);

router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  curriculumSubjectController.getCurriculumSubjectById,
);

router.patch(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  validate(updateCurriculumSubjectSchema),
  curriculumSubjectController.updateCurriculumSubject,
);

router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  curriculumSubjectController.deleteCurriculumSubject,
);

export default router;
