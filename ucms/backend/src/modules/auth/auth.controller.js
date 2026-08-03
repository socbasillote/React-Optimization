import * as authService from "./auth.service.js";
import sendResponse from "../../utils/sendResponse.js";

import { refreshCookieOptions } from "../../utils/cookieOptions.js";

import * as passwordResetService from "./passwordReset.service.js";
import sendEmail from "../../utils/sendEmail.js";
import passwordResetEmail from "../../utils/passwordResetEmail.js";

import * as emailVerificationService from "./emailVerification.service.js";
import emailVerificationEmail from "../../utils/emailVerificationEmail.js";

export const register = async (req, res) => {
  const user = await authService.register(req.body);

  sendResponse(res, {
    statusCode: 201,
    message: "User registered successfully.",
    data: user,
  });
};

export const login = async (req, res) => {
  const result = await authService.login(req.body, req.sessionContext);

  res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

  sendResponse(res, {
    message: "Login successful.",
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
};

export const logout = async (req, res) => {
  const { refreshToken } = req.cookies;

  await authService.logout(refreshToken);

  res.clearCookie("refreshToken", refreshCookieOptions);

  sendResponse(res, {
    message: "Logout successful.",
    data: null,
  });
};

export const forgotPassword = async (req, res) => {
  const result = await passwordResetService.createResetToken(req.body.email);

  if (result) {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${result.token}`;

    const email = passwordResetEmail({
      name: result.user.firstName,
      resetLink,
    });

    await sendEmail({
      to: result.user.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
  }

  sendResponse(res, {
    message:
      "If an account with that email exists, a password reset link has been sent.",
    data: null,
  });
};

export const resetPassword = async (req, res) => {
  await passwordResetService.resetPassword(req.body);

  sendResponse(res, {
    message: "Password reset successful.",
    data: null,
  });
};

export const sendVerificationEmail = async (req, res) => {
  const { userId } = req.body;

  const result = await emailVerificationService.createVerificationToken(userId);

  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${result.token}`;

  const email = emailVerificationEmail({
    name: result.user.firstName,
    verificationLink,
  });

  await sendEmail({
    to: result.user.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });

  sendResponse(res, {
    message: "Verification email sent successfully.",
    data: null,
  });
};

export const verifyEmail = async (req, res) => {
  await emailVerificationService.verifyEmail(req.body.token);

  sendResponse(res, {
    message: "Email verified successfully.",
    data: null,
  });
};

export const changePassword = async (req, res) => {
  await authService.changePassword({
    userId: req.user.id,
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword,
  });

  res.clearCookie("refreshToken", refreshCookieOptions);

  sendResponse(res, {
    message: "Password changed successfully. Please log in again.",
    data: null,
  });
};
