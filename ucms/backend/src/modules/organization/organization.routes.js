import express from "express";

import campusRoutes from "./campus/campus.routes.js";
import collegeRoutes from "./college/college.routes.js";
import departmentRoutes from "./department/department.routes.js";
import programRoutes from "./program/program.routes.js";

const router = express.Router();

router.use("/campuses", campusRoutes);
router.use("/colleges", collegeRoutes);
router.use("/departments", departmentRoutes);
router.use("/programs", programRoutes);

export default router;
