import express from "express";

import * as departmentController from "./department.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";

import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "./department.validation.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN),
  validate(createDepartmentSchema),
  departmentController.createDepartment,
);

router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  departmentController.getDepartments,
);

router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  departmentController.getDepartmentById,
);

router.patch(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  validate(updateDepartmentSchema),
  departmentController.updateDepartment,
);

router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  departmentController.deleteDepartment,
);

export default router;
