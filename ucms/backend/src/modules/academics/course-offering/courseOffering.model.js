import mongoose from "mongoose";

import { ORGANIZATION_STATUS } from "../../../constants/organizationStatus.js";

const courseOfferingSchema = new mongoose.Schema(
  {
    curriculumSubject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CurriculumSubject",
      required: true,
      index: true,
    },

    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
      index: true,
    },

    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
      index: true,
    },

    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
      index: true,
    },

    academicTerm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicTerm",
      required: true,
      index: true,
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

courseOfferingSchema.index(
  {
    curriculumSubject: 1,
    section: 1,
    academicYear: 1,
    academicTerm: 1,
  },
  {
    unique: true,
  },
);

const CourseOffering = mongoose.model("CourseOffering", courseOfferingSchema);

export default CourseOffering;
