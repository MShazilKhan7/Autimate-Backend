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

type ExerciseType =
  | "imitation"
  | "identify"
  | "expressive"
  | "functional"
  | "checkpoint"; // checkpoint is a special type that marks the end of a phase and the beginning of the next one


export interface ExerciseConfig {
  prompt?: string;
  video?: string;
  image?: string;
  distractorWordIds?: Types.ObjectId[];
}

export interface ModuleStep {
  _id?: Types.ObjectId;
  type: ExerciseType;
  wordId?: Types.ObjectId;
  title: string;
  order: number;
  difficulty?: "easy" | "medium" | "hard";
  config?: ExerciseConfig;
}

const ExerciseConfigSchema = new Schema(
  {
    prompt: String,
    video: String,
    image: String,
    distractorWordIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Word",
      },
    ],
  },
  {
    _id: false,
  }
);

const ModuleStepSchema = new Schema<ModuleStep>(
  {
    type: {
      type: String,
      enum: ["imitation", "identify", "expressive", "functional", "checkpoint"],
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

    order: {
      type: Number,
      required: true,
      default: 1,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    config: ExerciseConfigSchema,
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

export const ModuleModel =
  mongoose.models.Module ||
  mongoose.model("Module", ModuleSchema);

export default mongoose.model(
  "ExerciseModule",
  ModuleSchema
);