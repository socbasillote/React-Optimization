import { Router } from "express";
import User from "../modules/users/user.model.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json(user);
});

export default router;
