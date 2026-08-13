import express from "express";

import * as quizSubmissionController from "./quizSubmission.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";

import {
  createQuizSubmissionSchema,
  updateQuizSubmissionSchema,
} from "./quizSubmission.validation.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

// =========================
// STUDENT SUBMITS QUIZ
// =========================

router.post(
  "/",
  authorize(ROLES.STUDENT),
  validate(createQuizSubmissionSchema),
  quizSubmissionController.createQuizSubmission,
);

// =========================
// VIEW SUBMISSIONS
// =========================

router.get(
  "/",
  authorize(ROLES.STUDENT, ROLES.FACULTY, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  quizSubmissionController.getQuizSubmissions,
);

// =========================
// VIEW ONE SUBMISSION
// =========================

router.get(
  "/:id",
  authorize(ROLES.STUDENT, ROLES.FACULTY, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  quizSubmissionController.getQuizSubmissionById,
);

// =========================
// FACULTY GRADING
// =========================

router.patch(
  "/:id",
  authorize(ROLES.FACULTY, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validate(updateQuizSubmissionSchema),
  quizSubmissionController.updateQuizSubmission,
);

// =========================
// ADMIN DELETE
// =========================

router.delete(
  "/:id",
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  quizSubmissionController.deleteQuizSubmission,
);

router.post(
  "/start",
  authorize(ROLES.STUDENT),
  quizSubmissionController.startQuiz,
);

export default router;
