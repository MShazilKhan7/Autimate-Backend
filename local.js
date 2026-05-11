import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./server.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGOOSE_CONNECTION).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});