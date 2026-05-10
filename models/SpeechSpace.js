import mongoose from "mongoose";

const practiceItemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["letter", "word", "sentence"],
    required: true
  },
  hint: {
    type: String,
    default: ""
  },
  emoji: {
    type: String,
    default: "🗣️"
  }
});

const speechSpaceLevelSchema = new mongoose.Schema({
  levelNumber: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  icon: {
    type: String,
    default: "🚀"
  },
  starsRequired: {
    type: Number,
    default: 0
  },
  items: [practiceItemSchema]
}, {
  timestamps: true
});

export default mongoose.model("SpeechSpace", speechSpaceLevelSchema);
