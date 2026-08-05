import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
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

    timeLimit: {
      type: Number,
      required: true,
      min: 1,
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

quizSchema.index(
  {
    courseOffering: 1,
    title: 1,
  },
  {
    unique: true,
  },
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
