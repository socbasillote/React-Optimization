import express from "express";

import academicYearRoutes from "./academic-year/academicYear.routes.js";
import academicTermRoutes from "./academic-term/academicTerm.routes.js";

const router = express.Router();

router.use("/academic-years", academicYearRoutes);
router.use("/academic-terms", academicTermRoutes);

export default router;
