import crypto from "crypto";

import RefreshSession from "./refreshSession.model.js";
import { verifyRefreshToken } from "../../utils/jwt.js";

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const createSession = async ({
  refreshToken,
  userId,
  sessionContext,
}) => {
  const payload = verifyRefreshToken(refreshToken);

  await RefreshSession.create({
    user: userId,
    tokenHash: hashToken(refreshToken),
    device: sessionContext?.device,
    ip: sessionContext?.ip,
    userAgent: sessionContext?.userAgent,
    expiresAt: new Date(payload.exp * 1000),
  });
};

export const findSession = async (refreshToken) => {
  return RefreshSession.findOne({
    tokenHash: hashToken(refreshToken),
  });
};

export const deleteSession = async (refreshToken) => {
  return RefreshSession.findOneAndDelete({
    tokenHash: hashToken(refreshToken),
  });
};

export const validateSession = async (refreshToken) => {
  const payload = verifyRefreshToken(refreshToken);

  const session = await RefreshSession.findOne({
    tokenHash: hashToken(refreshToken),
  });

  if (!session) {
    return null;
  }

  return {
    session,
    payload,
  };
};
