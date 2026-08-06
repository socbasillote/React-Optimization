import ApiError from "../utils/ApiError.js";
import User from "../modules/users/user.model.js";
import { verifyAccessToken } from "../utils/jwt.js";

const authenticate = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required.");
  }

  const token = authorization.split(" ")[1];

  const payload = verifyAccessToken(token);
  console.log("PAYLOAD:", payload);
  const user = await User.findById(payload.id);

  if (!user) {
    throw new ApiError(401, "Authentication required.");
  }

  if (user.status !== "ACTIVE") {
    throw new ApiError(403, "Account is inactive.");
  }

  req.user = {
    id: user._id,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
  };

  next();
};

export default authenticate;
