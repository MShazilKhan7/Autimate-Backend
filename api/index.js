// api/index.js
import mongoose from "mongoose";
import app from "../server.js";
import dotenv from "dotenv";

dotenv.config();

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI);
  }

  cached.conn = await cached.promise;

  return cached.conn;
}

export default async function handler(req, res) {
  await connectDB();

  return app(req, res);
}