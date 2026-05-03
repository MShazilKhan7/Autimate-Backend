import mongoose from "mongoose";

const speechTherapySchema = new mongoose.Schema({
  word: {
    type: String,
    required: [true, "Please add a word"],
    trim: true,
    unique: true
  },
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1568702846914-96b305d2uj67?w=300&h=300&fit=crop"
  },
  category: {
    type: String,
    required: [true, "Please add a category"]
  },
  phonemes: {
    type: [String],
    default: []
  },
  mockResponse: {
    type: Object, // Stores the complex SpeechAce format object
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model("SpeechTherapy", speechTherapySchema);
