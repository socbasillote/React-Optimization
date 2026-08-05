import express from "express";

import * as dashboardController from "./dashboard.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT),
  dashboardController.getDashboard,
);

export default router;
