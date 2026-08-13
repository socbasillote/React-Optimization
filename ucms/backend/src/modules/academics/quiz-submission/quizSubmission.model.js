import mongoose from "mongoose";

const quizSubmissionAnswerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizQuestion",
      required: true,
    },

    answer: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: false,
  },
);

const quizSubmissionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },

    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
      index: true,
    },

    answers: {
      type: [quizSubmissionAnswerSchema],
      default: [],
    },

    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    score: {
      type: Number,
      min: 0,
      default: null,
    },

    feedback: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

quizSubmissionSchema.index(
  {
    quiz: 1,
    enrollment: 1,
  },
  {
    unique: true,
  },
);

const QuizSubmission = mongoose.model("QuizSubmission", quizSubmissionSchema);

export default QuizSubmission;
