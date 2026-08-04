import express from "express";

import * as academicTermController from "./academicTerm.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";

import {
  createAcademicTermSchema,
  updateAcademicTermSchema,
} from "./academicTerm.validation.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN),
  validate(createAcademicTermSchema),
  academicTermController.createAcademicTerm,
);

router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  academicTermController.getAcademicTerms,
);

router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  academicTermController.getAcademicTermById,
);

router.patch(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  validate(updateAcademicTermSchema),
  academicTermController.updateAcademicTerm,
);

router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  academicTermController.deleteAcademicTerm,
);

export default router;
