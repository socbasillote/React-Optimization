import express from "express";

import academicYearRoutes from "./academic-year/academicYear.routes.js";
import academicTermRoutes from "./academic-term/academicTerm.routes.js";
import curriculumRoutes from "./curriculum/curriculum.routes.js";
import subjectRoutes from "./subject/subject.routes.js";

const router = express.Router();

router.use("/academic-years", academicYearRoutes);
router.use("/academic-terms", academicTermRoutes);
router.use("/curricula", curriculumRoutes);
router.use("/subjects", subjectRoutes);
export default router;
