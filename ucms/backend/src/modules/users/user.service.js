import ApiError from "../../utils/ApiError.js";
import User from "../users/user.model.js";

export const getMe = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return user;
};

export const getById = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return user;
};

export const updateProfile = async (userId, payload) => {
  const user = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return user;
};

export const getUsers = async ({
  page = 1,
  limit = 10,
  search = "",
  role,
  status,
}) => {
  const filter = {};

  if (search) {
    filter.$or = [
      {
        firstName: {
          $regex: search,
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (role) {
    filter.role = role;
  }

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(filter).skip(skip).limit(limit).sort({
      createdAt: -1,
    }),

    User.countDocuments(filter),
  ]);

  return {
    users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateStatus = async (id, status) => {
  const user = await User.findByIdAndUpdate(id, { status }, { new: true });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return user;
};

export const updateRole = async (id, role) => {
  const user = await User.findByIdAndUpdate(id, { role }, { new: true });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }
};
