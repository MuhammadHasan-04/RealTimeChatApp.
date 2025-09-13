import dotenv from "dotenv";
import cors from "cors";
import connectToDb from "./config/db.js";
import express  from 'express'


import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messages.js";
import { app, server } from "./services/message_mutator.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log("Server running on PORT: " + PORT);
  connectToDb();
});
