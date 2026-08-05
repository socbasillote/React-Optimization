import express from "express";

import * as quizController from "./quiz.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";

import { createQuizSchema, updateQuizSchema } from "./quiz.validation.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY),
  validate(createQuizSchema),
  quizController.createQuiz,
);

router.get(
  "/",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT),
  quizController.getQuizzes,
);

router.get(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT),
  quizController.getQuizById,
);

router.patch(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY),
  validate(updateQuizSchema),
  quizController.updateQuiz,
);

router.delete(
  "/:id",
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.FACULTY),
  quizController.deleteQuiz,
);

export default router;
