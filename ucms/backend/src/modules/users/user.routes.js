import express from "express";

import * as userController from "./user.controller.js";

import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import validate from "../../middleware/validate.js";

import {
  updateProfileSchema,
  updateStatusSchema,
  updateRoleSchema,
} from "./user.validation.js";

import { ROLES } from "../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.get("/me", userController.getMe);

router.patch(
  "/me",
  validate(updateProfileSchema),
  userController.updateProfile,
);

router.get(
  "/",
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  userController.getUsers,
);

router.get(
  "/:id",
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  userController.getById,
);

router.patch(
  "/:id/status",
  authorize(ROLES.SUPER_ADMIN),
  validate(updateStatusSchema),
  userController.updateStatus,
);

router.patch(
  "/:id/role",
  authorize(ROLES.SUPER_ADMIN),
  validate(updateRoleSchema),
  userController.updateRole,
);

router.delete("/:id", authorize(ROLES.SUPER_ADMIN), userController.deleteUser);

export default router;
