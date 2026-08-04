import mongoose from "mongoose";

import { ORGANIZATION_STATUS } from "../../../constants/organizationStatus.js";
import { DEGREE_TYPES } from "../../../constants/degreeTypes.js";

const programSchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    degreeType: {
      type: String,
      enum: Object.values(DEGREE_TYPES),
      required: true,
    },

    durationYears: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
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

programSchema.index(
  {
    department: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

programSchema.index(
  {
    department: 1,
    code: 1,
  },
  {
    unique: true,
  },
);

const Program = mongoose.model("Program", programSchema);

export default Program;
