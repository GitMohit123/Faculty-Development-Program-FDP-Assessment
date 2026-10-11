import express from "express";
import cors from "cors";
import helmet from "helmet";
import studentRoutes from "./routes/studentRoutes.js";
// meri main file 

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
    message: "server API running",
  });
});

app.use("/api", (_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});


app.use((err, _req, res, _next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Request body must be valid JSON" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Request body is too large" });
  }

  console.error(err);
  return res.status(500).json({ success: false, message: "Something went wrong on the server" });
});

export default app;
