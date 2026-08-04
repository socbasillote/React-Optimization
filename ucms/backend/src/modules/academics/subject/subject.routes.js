import express from "express";

import * as subjectController from "./subject.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";

import {
  createSubjectSchema,
  updateSubjectSchema,
} from "./subject.validation.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN),
  validate(createSubjectSchema),
  subjectController.createSubject,
);

router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  subjectController.getSubjects,
);

router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  subjectController.getSubjectById,
);

router.patch(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  validate(updateSubjectSchema),
  subjectController.updateSubject,
);

router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  subjectController.deleteSubject,
);

export default router;
