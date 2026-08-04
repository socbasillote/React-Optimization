import crypto from "crypto";

import ApiError from "../../utils/ApiError.js";
import User from "../users/user.model.js";
import EmailVerification from "./emailVerification.model.js";

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const createVerificationToken = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, "Email is already verified.");
  }

  await EmailVerification.deleteMany({
    user: user._id,
  });

  const token = crypto.randomBytes(32).toString("hex");

  const tokenHash = hashToken(token);

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await EmailVerification.create({
    user: user._id,
    tokenHash,
    expiresAt,
  });

  return {
    token,
    user,
  };
};

export const verifyEmail = async (token) => {
  const tokenHash = hashToken(token);

  const verification = await EmailVerification.findOne({
    tokenHash,
  });

  if (!verification) {
    throw new ApiError(400, "Invalid or expired verification token.");
  }

  const user = await User.findById(verification.user);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  user.isEmailVerified = true;

  await user.save();

  await EmailVerification.deleteOne({
    _id: verification._id,
  });
};
