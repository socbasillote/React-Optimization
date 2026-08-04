import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    campus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campus",
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

    dean: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/*
 * A college name and code must be unique within the same campus.
 * This allows different campuses to have colleges with the same
 * name or code if needed.
 */
collegeSchema.index({ campus: 1, name: 1 }, { unique: true });

collegeSchema.index({ campus: 1, code: 1 }, { unique: true });

const College = mongoose.model("College", collegeSchema);

export default College;
