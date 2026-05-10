import mongoose from "mongoose";

const socialSkillSchema = new mongoose.Schema({
  task: {
    type: String,
    required: [true, "Please add a task name"],
    trim: true
  },
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
  },
  description: {
    type: String,
    required: [true, "Please add a description"]
  },
  instruction: {
    type: String,
    required: [true, "Please add instructions"]
  },
  category: {
    type: String,
    required: [true, "Please add a category"],
    enum: ["greetings", "manners", "needs", "social", "emotions", "communication"]
  }
}, {
  timestamps: true
});

export default mongoose.model("SocialSkill", socialSkillSchema);
