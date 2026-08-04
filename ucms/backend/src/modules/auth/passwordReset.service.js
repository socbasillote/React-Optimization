import crypto from "crypto";

import ApiError from "../../utils/ApiError.js";
import User from "../users/user.model.js";
import PasswordReset from "./passwordReset.model.js";

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const createResetToken = async (email) => {
  const user = await User.findOne({ email });

  // Prevent user enumeration
  if (!user) {
    return null;
  }

  await PasswordReset.deleteMany({
    user: user._id,
  });

  const token = crypto.randomBytes(32).toString("hex");

  const tokenHash = hashToken(token);

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await PasswordReset.create({
    user: user._id,
    tokenHash,
    expiresAt,
  });

  return {
    token,
    user,
  };
};

export const resetPassword = async ({ token, password }) => {
  const tokenHash = hashToken(token);

  const reset = await PasswordReset.findOne({
    tokenHash,
  });

  if (!reset) {
    throw new ApiError(400, "Invalid or expired reset token.");
  }

  const user = await User.findById(reset.user).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  user.password = password;
  await user.save();

  await PasswordReset.deleteOne({
    _id: reset._id,
  });
};
