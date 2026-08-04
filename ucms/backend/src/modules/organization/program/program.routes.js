import express from "express";

import * as programController from "./program.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";

import {
  createProgramSchema,
  updateProgramSchema,
} from "./program.validation.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN),
  validate(createProgramSchema),
  programController.createProgram,
);

router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  programController.getPrograms,
);

router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  programController.getProgramById,
);

router.patch(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  validate(updateProgramSchema),
  programController.updateProgram,
);

router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  programController.deleteProgram,
);

export default router;
