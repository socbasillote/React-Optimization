import express from "express";

import * as attendanceController from "./attendance.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";

import {
  createAttendanceSchema,
  updateAttendanceSchema,
} from "./attendance.validation.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY),
  validate(createAttendanceSchema),
  attendanceController.createAttendance,
);

router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY),
  attendanceController.getAttendances,
);

router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY),
  attendanceController.getAttendanceById,
);

router.patch(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY),
  validate(updateAttendanceSchema),
  attendanceController.updateAttendance,
);

router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  attendanceController.deleteAttendance,
);

export default router;
