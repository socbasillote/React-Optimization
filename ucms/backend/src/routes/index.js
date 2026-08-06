import express from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import organizationRoutes from "../modules/organization/organization.routes.js";
import academicsRoutes from "../modules/academics/academics.routes.js";
import studentRoutes from "../modules/students/student.routes.js";
import facultyRoutes from "../modules/faculty/faculty.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/organization", organizationRoutes);
router.use("/academics", academicsRoutes);
router.use("/students", studentRoutes);
router.use("/faculty", facultyRoutes);
router.use("/dashboard", dashboardRoutes);
//console.log(userRoutes);

export default router;
