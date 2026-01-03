import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import { connectToSocket } from "./src/controllers/socketManager.js";
import userRoutes from "./src/routes/users.routes.js";
import dotenv from "dotenv";
const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 5000);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));
dotenv.config();
app.use("/api/users", userRoutes);
const start = async () => {
  const connectDB = await mongoose.connect(
    process.env.MONGO_URI
  );
  console.log("MONGODB CONNECTED", connectDB.connection.host);
  server.listen(app.get("port"), () => {
    console.log("LISTING ON PORT 5000");
  });
};

start();
