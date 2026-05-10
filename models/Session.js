import mongoose from "mongoose";


const AttemptSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
    },

    quality_score: {
      type: Number,
      required: true,
    },

    quality_class: {
      type: String,
      required: true,
    },

    phone_score_list: [
      {
        phone: {
          type: String,
          required: true,
        },

        quality_score: {
          type: Number,
          required: true,
        },

        sound_most_like: {
          type: String,
        },
      },
    ],

    llmFeedback: {
      type: String,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);

const SessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    wordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Word",
      required: true,
    },

    word: {
      type: String,
      required: true,
    },

    attempts: [AttemptSchema],
  },
  {
    timestamps: true,
  },
);

SessionSchema.index({ userId: 1, wordId: 1 }, { unique: true });

export default mongoose.model("Session", SessionSchema);
