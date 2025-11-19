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

const onBoardingResponseSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
      answerId: { type: mongoose.Schema.Types.ObjectId, ref: "Answer", required: true }
    }
  ],

  completed: {
    type: Boolean,
    default: true
  },

  completedAt: {
    type: Date,
    default: Date.now
  }
});

export const onBoardingRespons = mongoose.model("onBoardingResponse", onBoardingResponseSchema);

