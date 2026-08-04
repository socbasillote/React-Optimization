import express from "express";

import * as curriculumController from "./curriculum.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";

import {
  createCurriculumSchema,
  updateCurriculumSchema,
} from "./curriculum.validation.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN),
  validate(createCurriculumSchema),
  curriculumController.createCurriculum,
);

router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  curriculumController.getCurricula,
);

router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  curriculumController.getCurriculumById,
);

router.patch(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  validate(updateCurriculumSchema),
  curriculumController.updateCurriculum,
);

router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  curriculumController.deleteCurriculum,
);

export default router;
