import express from "express";

import * as authController from "./auth.controller.js";
import sessionContext from "../../middleware/sessionContext.js";

import validate from "../../middleware/validate.js";
import {
  createUserSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  sendVerificationEmailSchema,
  verifyEmailSchema,
  changePasswordSchema,
} from "./auth.validation.js";

import authenticate from "../../middleware/authenticate.js";

const router = express.Router();

router.post("/register", validate(createUserSchema), authController.register);
router.post(
  "/login",
  validate(loginSchema),
  sessionContext,
  authController.login,
);

router.get("/current-user", authenticate, authController.getCurrentUser);

router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword,
);

router.post(
  "/send-verification-email",
  validate(sendVerificationEmailSchema),
  authController.sendVerificationEmail,
);

router.post(
  "/verify-email",
  validate(verifyEmailSchema),
  authController.verifyEmail,
);

router.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword,
);

export default router;
