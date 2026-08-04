import mongoose from "mongoose";

import { ORGANIZATION_STATUS } from "../../../constants/organizationStatus.js";

const academicTermSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

academicTermSchema.index({
  name: 1,
});

const AcademicTerm = mongoose.model("AcademicTerm", academicTermSchema);

export default AcademicTerm;
