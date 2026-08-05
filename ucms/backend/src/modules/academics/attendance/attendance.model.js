import mongoose from "mongoose";

import { ATTENDANCE_STATUS } from "../../../constants/attendanceStatus.js";

const attendanceSchema = new mongoose.Schema(
  {
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
      index: true,
    },

    classSchedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassSchedule",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(ATTENDANCE_STATUS),
      default: ATTENDANCE_STATUS.PRESENT,
    },

    remarks: {
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

attendanceSchema.index(
  {
    enrollment: 1,
    classSchedule: 1,
    date: 1,
  },
  {
    unique: true,
  },
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
