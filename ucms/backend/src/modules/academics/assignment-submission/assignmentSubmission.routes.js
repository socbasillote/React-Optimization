import express from "express";

import * as assignmentSubmissionController from "./assignmentSubmission.controller.js";

import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";

import {
  createAssignmentSubmissionSchema,
  updateAssignmentSubmissionSchema,
} from "./assignmentSubmission.validation.js";

import { ROLES } from "../../../constants/roles.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.STUDENT, ROLES.FACULTY, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validate(createAssignmentSubmissionSchema),
  assignmentSubmissionController.createAssignmentSubmission,
);

router.get(
  "/",
  authorize(ROLES.STUDENT, ROLES.FACULTY, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  assignmentSubmissionController.getAssignmentSubmissions,
);

router.get(
  "/:id",
  authorize(ROLES.STUDENT, ROLES.FACULTY, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  assignmentSubmissionController.getAssignmentSubmissionById,
);

router.patch(
  "/:id",
  authorize(ROLES.FACULTY, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validate(updateAssignmentSubmissionSchema),
  assignmentSubmissionController.updateAssignmentSubmission,
);

router.delete(
  "/:id",
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  assignmentSubmissionController.deleteAssignmentSubmission,
);

export default router;
