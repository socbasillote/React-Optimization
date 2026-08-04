import mongoose from "mongoose";

import { ORGANIZATION_STATUS } from "../../../constants/organizationStatus.js";

const academicYearSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

academicYearSchema.index({
  name: 1,
});

const AcademicYear = mongoose.model("AcademicYear", academicYearSchema);

export default AcademicYear;
