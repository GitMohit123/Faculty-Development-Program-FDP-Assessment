import express from "express";
import cors from "cors";
import helmet from "helmet";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();

app.use(helmet());

// const allowedOrigins = new Set([
//   process.env.CLIENT_URL,
//   "http://localhost:5173",
// ].filter(Boolean));

// app.use(
//   cors({
//     origin(origin, callback) {
//       if (!origin || allowedOrigins.has(origin)) {
//         callback(null, true);
//         return;
//       }

//       callback(new Error("CORS policy: this origin is not allowed"));
//     },
//     credentials: true,
//   })
// );

app.use(cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
    credentials: true
}));

app.use(express.json());
app.use("/api/students", studentRoutes);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "MERN FDP API is running",
  });
});

export default app;
