import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Workshop", "Tech Talk", "Hackathon"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    day: { type: Number, required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    regLink: { type: String, required: true },
    // ✅ Changed to 'images' as an Array of Strings
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
