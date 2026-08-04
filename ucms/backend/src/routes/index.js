import express from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import organizationRoutes from "../modules/organization/organization.routes.js";
import academicsRoutes from "../modules/academics/academics.routes.js";
import studentRoutes from "../modules/students/student.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/organization", organizationRoutes);
router.use("/academics", academicsRoutes);
router.use("/students", studentRoutes);
//console.log(userRoutes);

export default router;
