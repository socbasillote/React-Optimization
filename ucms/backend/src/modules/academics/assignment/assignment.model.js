import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    courseOffering: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseOffering",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    availableFrom: {
      type: Date,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    maxScore: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

assignmentSchema.index(
  {
    courseOffering: 1,
    title: 1,
  },
  {
    unique: true,
  },
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
