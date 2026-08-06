import express from "express";

import authenticate from "../../middleware/authenticate.js";

import * as dashboardController from "./dashboard.controller.js";

const router = express.Router();

router.get("/stats", authenticate, dashboardController.getStatistics);

export default router;
