import express from "express";

import academicYearRoutes from "./academic-year/academicYear.routes.js";

const router = express.Router();

router.use("/academic-years", academicYearRoutes);

export default router;
