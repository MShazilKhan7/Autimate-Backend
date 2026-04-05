import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
    expressive: { type: Number, default: 0 },
    receptive: { type: Number, default: 0 },
    articulation: { type: Number, default: 0 },
    social: { type: Number, default: 0 }
}, { _id: false });

const preferenceSchema = new mongoose.Schema({
    motivators: [{ type: String }],
    sensitivities: [{ type: String }],
    reward: { type: String }
}, { _id: false });

const metaSchema = new mongoose.Schema({
    generatedFrom: { type: String },
    algorithmVersion: { type: String }
}, { _id: false });

const childProfileSchema = new mongoose.Schema({
    tierId: {
        type: Number,
        enum: [1, 2, 3, 4, 5]           // matches Tier.id: 1 | 2 | 3 | 4 | 5
    },
    tierLabel: { type: String },

    scores: scoreSchema,
    totalScore: { type: Number },

    difficultyLevel: { type: String },   // DBProfile.difficultyLevel is a plain string

    targetPhonemes: [{ type: String }],
    recommendedExercises: [{ type: String }],

    sessionLengthTarget: { type: String },

    preferences: preferenceSchema,

    primaryGoal: {
        type: String,
        enum: ["expressive", "receptive", "articulation", "social", "increase_vocab"]  // matches DomainScores keys
    },

    assessmentDate: {
        type: Date,
        default: Date.now
    },

    meta: metaSchema

}, { _id: false });

const childInfoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,                    // ChildInfo.age is string, not Number
        required: true
    },
    gender: {
        type: Number,
        required: true,
        enum: [0, 1],                   // ChildInfo.gender is 0 | 1 only
        default: 0
    },

    profile: childProfileSchema,
});

export default mongoose.model("ChildInfo", childInfoSchema);