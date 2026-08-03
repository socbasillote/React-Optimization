import ApiError from "../../utils/ApiError.js";
import User from "../modules/users/user.model.js";

import * as sessionService from "./session.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import RefreshSession from "./refreshSession.model.js";

export const login = async ({ email, password }, sessionContext) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (user.status !== "ACTIVE") {
    throw new ApiError(
      403,
      "Your account is not active. Please contact the administrator.",
    );
  }

  user.lastLogin = new Date();
  await user.save();

  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);

  const refreshToken = generateRefreshToken(payload);

  await sessionService.createSession({
    refreshToken,
    userId: user._id,
    sessionContext,
  });
  return {
    accessToken,
    refreshToken,
    user,
  };
};

export const register = async (payload) => {
  const existingUser = await User.findOne({
    email: payload.email,
  });

  if (existingUser) {
    throw new ApiError(409, "Email already exists.");
  }

  const user = await User.create(payload);

  return user;
};

export const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required.");
  }

  const { payload } = await sessionService.validateSession(refreshToken);

  const user = await User.findById(payload.id);

  if (!user) {
    throw new ApiError(401, "User not found.");
  }

  if (user.status !== "ACTIVE") {
    throw new ApiError(403, "Account is inactive.");
  }

  const accessToken = generateAccessToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  return {
    accessToken,
  };
};

export const logout = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  await sessionService.deleteSession(refreshToken);
};

export const changePassword = async ({
  userId,
  currentPassword,
  newPassword,
}) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const isPasswordCorrect = await user.comparePassword(currentPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Current password is incorrect.");
  }

  user.password = newPassword;

  await user.save();

  await RefreshSession.deleteMany({
    user: user._id,
  });
};
