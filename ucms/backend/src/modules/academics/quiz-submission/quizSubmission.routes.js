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

router.post(
  "/",
  authorize(ROLES.STUDENT, ROLES.FACULTY, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validate(createQuizSubmissionSchema),
  quizSubmissionController.createQuizSubmission,
);

router.get(
  "/",
  authorize(ROLES.STUDENT, ROLES.FACULTY, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  quizSubmissionController.getQuizSubmissions,
);

router.get(
  "/:id",
  authorize(ROLES.STUDENT, ROLES.FACULTY, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  quizSubmissionController.getQuizSubmissionById,
);

router.patch(
  "/:id",
  authorize(ROLES.FACULTY, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validate(updateQuizSubmissionSchema),
  quizSubmissionController.updateQuizSubmission,
);

router.delete(
  "/:id",
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  quizSubmissionController.deleteQuizSubmission,
);

export default router;
