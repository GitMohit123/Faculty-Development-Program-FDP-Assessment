import express from "express";
import cors from "cors";
import helmet from "helmet";
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

app.use((error, _req, res, _next) => {
  const malformedJson = error instanceof SyntaxError && error.status === 400 && "body" in error;
  return res.status(malformedJson ? 400 : 500).json({
    success: false,
    message: malformedJson ? "Invalid JSON body" : "Internal server error",
  });
});



export default app;
