import ApiError from "../utils/ApiError.js";

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required.");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden.");
    }

    next();
  };
};

export default authorize;
