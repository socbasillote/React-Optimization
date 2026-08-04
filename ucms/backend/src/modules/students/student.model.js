import mongoose from "mongoose";

import { ORGANIZATION_STATUS } from "../../constants/organizationStatus.js";

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    studentNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },

    curriculum: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Curriculum",
      required: true,
    },

    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      default: null,
    },

    yearLevel: {
      type: Number,
      required: true,
      min: 1,
    },

    admissionDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(ORGANIZATION_STATUS),
      default: ORGANIZATION_STATUS.ACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
