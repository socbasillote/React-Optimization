import express from "express";

import * as campusController from "./campus.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";

import { createCampusSchema, updateCampusSchema } from "./campus.validation.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN),
  validate(createCampusSchema),
  campusController.createCampus,
);

router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  campusController.getCampuses,
);

router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  campusController.getCampusById,
);

router.patch(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  validate(updateCampusSchema),
  campusController.updateCampus,
);

router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN),
  campusController.deleteCampus,
);

export default router;
