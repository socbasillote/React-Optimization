import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
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

    content: {
      type: String,
      required: true,
      trim: true,
    },

    publishedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

announcementSchema.index({
  courseOffering: 1,
  publishedAt: -1,
});

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
