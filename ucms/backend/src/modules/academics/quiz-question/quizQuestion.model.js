import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"],
      required: true,
      default: "MULTIPLE_CHOICE",
    },

    options: [
      {
        type: String,
        trim: true,
      },
    ],

    correctAnswer: {
      type: String,
      trim: true,
      default: null,
    },

    points: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },

    order: {
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

quizQuestionSchema.index({
  quiz: 1,
  order: 1,
});

const QuizQuestion = mongoose.model("QuizQuestion", quizQuestionSchema);

export default QuizQuestion;
