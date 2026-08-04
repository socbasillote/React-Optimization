import mongoose from "mongoose";

import { ORGANIZATION_STATUS } from "../../../constants/organizationStatus.js";

const academicTermSchema = new mongoose.Schema({
  academicYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AcademicYear",
    required: true,
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
  },

  sequence: {
    type: Number,
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },

  isCurrent: {
    type: Boolean,
    default: false,
  },

  status: {
    type: String,
    enum: Object.values(ORGANIZATION_STATUS),
    default: ORGANIZATION_STATUS.ACTIVE,
  },
});

academicTermSchema.index({ academicYear: 1, code: 1 }, { unique: true });

academicTermSchema.index({ academicYear: 1, sequence: 1 }, { unique: true });

const AcademicTerm = mongoose.model("AcademicTerm", academicTermSchema);

export default AcademicTerm;
