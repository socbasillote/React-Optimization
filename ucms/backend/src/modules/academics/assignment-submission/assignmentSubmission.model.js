import mongoose from "mongoose";

const assignmentSubmissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      index: true,
    },

    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
      index: true,
    },

    submittedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    content: {
      type: String,
      trim: true,
      default: "",
    },

    score: {
      type: Number,
      min: 0,
      default: null,
    },

    feedback: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

assignmentSubmissionSchema.index(
  {
    assignment: 1,
    enrollment: 1,
  },
  {
    unique: true,
  },
);

const AssignmentSubmission = mongoose.model(
  "AssignmentSubmission",
  assignmentSubmissionSchema,
);

export default AssignmentSubmission;
