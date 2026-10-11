import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json());
app.use("/api/students", studentRoutes);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "MERN FDP API is running",
  });
});

// Unknown routes answer in the same JSON shape as everything else.
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Final error boundary: only safe, human-readable messages leave the server.
app.use((error, _req, res, _next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Request body must be valid JSON" });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ success: false, message: "Invalid student data" });
  }

  const status = error.status ?? error.statusCode;
  if (status >= 400 && status < 500) {
    return res.status(status).json({ success: false, message: "Invalid request" });
  }

  console.error(error);
  return res.status(500).json({ success: false, message: "Something went wrong" });
});

export default app;
