import mongoose from "mongoose";

import { ORGANIZATION_STATUS } from "../../../constants/organizationStatus.js";

const curriculumSubjectSchema = new mongoose.Schema(
  {
    curriculum: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Curriculum",
      required: true,
      index: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },

    yearLevel: {
      type: Number,
      required: true,
      min: 1,
    },

    term: {
      type: Number,
      required: true,
      min: 1,
    },

    prerequisite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      default: null,
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

curriculumSubjectSchema.index(
  {
    curriculum: 1,
    subject: 1,
  },
  {
    unique: true,
  },
);

const CurriculumSubject = mongoose.model(
  "CurriculumSubject",
  curriculumSubjectSchema,
);

export default CurriculumSubject;
