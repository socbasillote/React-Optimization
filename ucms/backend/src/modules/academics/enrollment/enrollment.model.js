import mongoose from "mongoose";

import { ENROLLMENT_STATUS } from "../../../constants/enrollmentStatus.js";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },

    courseOffering: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseOffering",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(ENROLLMENT_STATUS),
      default: ENROLLMENT_STATUS.ENROLLED,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

enrollmentSchema.index(
  {
    student: 1,
    courseOffering: 1,
  },
  {
    unique: true,
  },
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
