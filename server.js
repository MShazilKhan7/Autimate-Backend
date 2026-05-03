import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/config.js";
import AuthRoute from "./routes/Auth.Route.js";
import UsersRoute from "./routes/Users.Route.js";
import questionRoutes from "./routes/Onboarding.Routes.js";
import speechAceRoutes from "./routes/SpeechAce.Routes.js";
import aiServiceRoutes from "./routes/Feedback.Routes.js";
import exerciseRoutes from "./routes/exercise.Routes.js";
import socialSkillRoutes from "./routes/SocialSkill.Route.js";
import speechTherapyRoutes from "./routes/SpeechTherapy.Route.js";
import speechSpaceRoutes from "./routes/SpeechSpace.Route.js";

dotenv.config();
connectDB();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8080",
      "http://localhost:8081",
      "https://autimateapp.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Routers
app.get("/", (req, res) => {
  res.send("Hello, Autimate API is working!");
});

app.get("/api/version", (req, res) => {
  res.json({ version: "1.0.0" });
});

app.use("/api/auth", AuthRoute);
app.use("/api/users", UsersRoute);
app.use("/api/on-boarding", questionRoutes);
app.use("/api/score-speech", speechAceRoutes);
app.use("/api/ai", aiServiceRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/social-skills", socialSkillRoutes);
app.use("/api/speech-therapy", speechTherapyRoutes);
app.use("/api/speech-space", speechSpaceRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  const token = process.env.ENCODE_TOKEN;
  console.log("Server listen", port);
});
