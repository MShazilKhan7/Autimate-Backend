import mongoose, { Schema, Document, Model, Types } from "mongoose";

/* =========================
   Management : Module -> steps[] -> type, wordId
========================= */

/* =========================
   WORD
========================= */

export interface Word extends Document {
  word: string;
  emoji: string;
  phonemes: string[];
  images?: string[];
  videos?: string[];
  category: string;
  color: string;
}

const WordSchema = new Schema<Word>(
  {
    word: {
      type: String,
      required: true,
      trim: true,
    },
    emoji: {
      type: String,
      required: true,
    },
    phonemes: [
      {
        type: String,
        required: true,
      },
    ],
    images: [
      {
        type: String,
        required: false,
      }
    ],
    videos: [
      {
        type: String,
        required: false,
      }
    ],
    category: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const WordModel: Model<Word> =
  mongoose.models.Word || mongoose.model<Word>("Word", WordSchema);

/* =========================
   MODULE STEP
========================= */

export interface ModuleStep {
  _id?: Types.ObjectId;
  type: "imitation" | "expressive" | "phoneme" | "checkpoint";
  wordId?: Types.ObjectId;
  title: string;
  phase: string;
}

const ModuleStepSchema = new Schema<ModuleStep>(
  {
    type: {
      type: String,
      enum: ["imitation", "expressive", "phoneme", "checkpoint"],
      required: true,
    },

    // Reference to Word document
    wordId: {
      type: Schema.Types.ObjectId,
      ref: "Word",
    },

    title: {
      type: String,
      required: true,
    },

    phase: {
      type: String,
      required: true,
    },
  },
  {
    _id: true, // auto generates _id for each step
  }
);

/* =========================
   MODULE
========================= */

export interface Module extends Document {
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  colorLight: string;
  steps: ModuleStep[];
}

const ModuleSchema = new Schema<Module>(
  {
    title: {
      type: String,
      required: true,
    },

    subtitle: {
      type: String,
      required: true,
    },

    emoji: {
      type: String,
      required: true,
    },

    color: {
      type: String,
      required: true,
    },

    colorLight: {
      type: String,
      required: true,
    },

    steps: {
      type: [ModuleStepSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const ModuleModel: Model<Module> =
  mongoose.models.Module || mongoose.model<Module>("Module", ModuleSchema);

export default mongoose.model("ExerciseModule", ModuleSchema);