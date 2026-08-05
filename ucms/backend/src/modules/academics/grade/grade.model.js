import mongoose from "mongoose";

import { GRADE_REMARKS } from "../../../constants/gradeRemarks.js";

const gradeSchema = new mongoose.Schema(
  {
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
      unique: true,
      index: true,
    },

    prelim: {
      type: Number,
      min: 0,
      max: 100,
    },

    midterm: {
      type: Number,
      min: 0,
      max: 100,
    },

    final: {
      type: Number,
      min: 0,
      max: 100,
    },

    finalGrade: {
      type: Number,
      min: 0,
      max: 100,
    },

    remarks: {
      type: String,
      enum: Object.values(GRADE_REMARKS),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Grade = mongoose.model("Grade", gradeSchema);

export default Grade;
