import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Question = mongoose.model("Question", questionSchema);

const answerSchema = new mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  answerText: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now },
});

export const Answer = mongoose.model("Answer", answerSchema);


