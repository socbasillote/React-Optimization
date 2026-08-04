import mongoose from "mongoose";

import { ORGANIZATION_STATUS } from "../../../constants/organizationStatus.js";

const departmentSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
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

    chairperson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

departmentSchema.index(
  {
    college: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

departmentSchema.index(
  {
    college: 1,
    code: 1,
  },
  {
    unique: true,
  },
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;
