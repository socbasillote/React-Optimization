import express from "express";

import * as classScheduleController from "./classSchedule.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";

import {
  createClassScheduleSchema,
  updateClassScheduleSchema,
} from "./classSchedule.validation.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(createClassScheduleSchema),
  classScheduleController.createClassSchedule,
);

router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY),
  classScheduleController.getClassSchedules,
);

router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY),
  classScheduleController.getClassScheduleById,
);

router.patch(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(updateClassScheduleSchema),
  classScheduleController.updateClassSchedule,
);

router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  classScheduleController.deleteClassSchedule,
);

export default router;
