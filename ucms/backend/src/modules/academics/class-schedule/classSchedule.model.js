import mongoose from "mongoose";

import { DAYS } from "../../../constants/days.js";

const classScheduleSchema = new mongoose.Schema(
  {
    courseOffering: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseOffering",
      required: true,
      index: true,
    },

    day: {
      type: String,
      enum: Object.values(DAYS),
      required: true,
    },

    startTime: {
      type: String,
      required: true,
      trim: true,
    },

    endTime: {
      type: String,
      required: true,
      trim: true,
    },

    room: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

classScheduleSchema.index(
  {
    courseOffering: 1,
    day: 1,
    startTime: 1,
    endTime: 1,
  },
  {
    unique: true,
  },
);

const ClassSchedule = mongoose.model("ClassSchedule", classScheduleSchema);

export default ClassSchedule;
