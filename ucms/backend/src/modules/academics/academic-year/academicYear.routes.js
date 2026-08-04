import express from "express";

import * as academicYearController from "./academicYear.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";

import {
  createAcademicYearSchema,
  updateAcademicYearSchema,
} from "./academicYear.validation.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN),
  validate(createAcademicYearSchema),
  academicYearController.createAcademicYear,
);

router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  academicYearController.getAcademicYears,
);

router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  academicYearController.getAcademicYearById,
);

router.patch(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  validate(updateAcademicYearSchema),
  academicYearController.updateAcademicYear,
);

router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  academicYearController.deleteAcademicYear,
);

export default router;
