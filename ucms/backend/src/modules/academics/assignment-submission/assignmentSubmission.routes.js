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

// Student submits their own assignment.
// Faculty/Admin/Super Admin should not create student submissions.
router.post(
  "/",
  authorize(ROLES.STUDENT),
  validate(createAssignmentSubmissionSchema),
  assignmentSubmissionController.createAssignmentSubmission,
);

// Faculty/Admin/Super Admin can view submissions.
// STUDENT intentionally excluded.
router.get(
  "/",
  authorize(ROLES.FACULTY, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  assignmentSubmissionController.getAssignmentSubmissions,
);

router.get(
  "/assignment/:assignmentId/my-submission",
  authorize(ROLES.STUDENT),
  assignmentSubmissionController.getMyAssignmentSubmission,
);

router.get(
  "/my-submissions",
  authorize(ROLES.STUDENT),
  assignmentSubmissionController.getMyAssignmentSubmissions,
);

// Faculty/Admin/Super Admin can view a specific submission.
// STUDENT intentionally excluded.
router.get(
  "/:id",
  authorize(ROLES.FACULTY, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  assignmentSubmissionController.getAssignmentSubmissionById,
);

// Faculty/Admin/Super Admin can grade/update a submission.
// STUDENT intentionally excluded.
router.patch(
  "/:id",
  authorize(ROLES.FACULTY, ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validate(updateAssignmentSubmissionSchema),
  assignmentSubmissionController.updateAssignmentSubmission,
);

// Only Admin/Super Admin can delete submissions.
router.delete(
  "/:id",
  authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  assignmentSubmissionController.deleteAssignmentSubmission,
);

export default router;
