import mongoose from "mongoose";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import User from "./models/User.js";
import SocialSkill from "./models/SocialSkill.js";
import SpeechTherapy from "./models/SpeechTherapy.ts";
import SpeechSpace from "./models/SpeechSpace.js";

dotenv.config();

// Sample Data
const users = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@autimate.com",
    password: "password123", // Will be hashed
    role: "admin",
    isVerified: true,
  },
  {
    firstName: "Parent",
    lastName: "Test",
    email: "parent@test.com",
    password: "password123",
    role: "user",
    isVerified: true,
  }
];

const socialSkills = [
  {
    task: "Wave Hello",
    image: "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=500&h=400&fit=crop",
    description: "Practice greeting someone with a friendly wave.",
    instruction: "When you see someone you know, lift your hand and move it from side to side.",
    category: "greetings"
  },
  {
    task: "Share a Toy",
    image: "https://images.unsplash.com/photo-1558060370-d644479cb975?w=500&h=400&fit=crop",
    description: "Learn to share toys with friends during playtime.",
    instruction: "Hand a toy to your friend and say 'Would you like to play?'",
    category: "social"
  }
];

const speechTherapyWords = [
  {
    word: "Apple",
    image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=300&h=300&fit=crop",
    category: "Fruits",
    phonemes: ["ae", "p", "l"],
    mockResponse: { quality_score: 85 }
  },
  {
    word: "Ball",
    image: "https://images.unsplash.com/photo-1580137197581-df2bb346a786?w=300&h=300&fit=crop",
    category: "Toys",
    phonemes: ["b", "ao", "l"],
    mockResponse: { quality_score: 90 }
  }
];

const speechSpaceLevels = [
  {
    levelNumber: 1,
    name: "Moon Base",
    description: "Starting your space journey with basic sounds.",
    icon: "🌙",
    starsRequired: 0,
    items: [
      { text: "A", type: "letter", hint: "Open your mouth wide", emoji: "🅰️" },
      { text: "B", type: "letter", hint: "Press your lips together", emoji: "🅱️" }
    ]
  },
  {
    levelNumber: 2,
    name: "Mars Rover",
    description: "Practicing short words on the red planet.",
    icon: "🚀",
    starsRequired: 5,
    items: [
      { text: "Cat", type: "word", hint: "C-A-T", emoji: "🐱" },
      { text: "Dog", type: "word", hint: "D-O-G", emoji: "🐶" }
    ]
  }
];

const importData = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGOOSE_CONNECTION);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await User.deleteMany();
    await SocialSkill.deleteMany();
    await SpeechTherapy.deleteMany();
    await SpeechSpace.deleteMany();

    // Hash passwords for users
    const hashedUsers = users.map(user => ({
      ...user,
      password: bcryptjs.hashSync(user.password, 10)
    }));

    // Insert new data
    await User.insertMany(hashedUsers);
    await SocialSkill.insertMany(socialSkills);
    await SpeechTherapy.insertMany(speechTherapyWords);
    await SpeechSpace.insertMany(speechSpaceLevels);

    console.log("Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error with data import:", error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany();
    await SocialSkill.deleteMany();
    await SpeechTherapy.deleteMany();
    await SpeechSpace.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error("Error with data destruction:", error);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
