import express from "express";

import * as collegeController from "./college.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";

import {
  createCollegeSchema,
  updateCollegeSchema,
} from "./college.validation.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN),
  validate(createCollegeSchema),
  collegeController.createCollege,
);

router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  collegeController.getColleges,
);

router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  collegeController.getCollegeById,
);

router.patch(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  validate(updateCollegeSchema),
  collegeController.updateCollege,
);

router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  collegeController.deleteCollege,
);

export default router;
