import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const exists = await User.findOne({
      email: req.body.email,
    });

    if (exists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const user = await User.create(req.body);

    const token = generateToken(user);

    res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const matched = await user.comparePassword(password);

  if (!matched) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  user.password = undefined;

  res.json({
    user,
    token: generateToken(user),
  });
};
