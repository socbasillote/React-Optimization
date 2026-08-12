import express from "express";

import * as quizQuestionController from "./quizQuestion.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";

import {
  createQuizQuestionSchema,
  updateQuizQuestionSchema,
} from "./quizQuestion.validation.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.FACULTY, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validate(createQuizQuestionSchema),
  quizQuestionController.createQuizQuestion,
);

router.get(
  "/",
  authorize(ROLES.STUDENT, ROLES.FACULTY, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  quizQuestionController.getQuizQuestions,
);

router.get(
  "/:id",
  authorize(ROLES.STUDENT, ROLES.FACULTY, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  quizQuestionController.getQuizQuestionById,
);

router.patch(
  "/:id",
  authorize(ROLES.FACULTY, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validate(updateQuizQuestionSchema),
  quizQuestionController.updateQuizQuestion,
);

router.delete(
  "/:id",
  authorize(ROLES.FACULTY, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  quizQuestionController.deleteQuizQuestion,
);

export default router;
