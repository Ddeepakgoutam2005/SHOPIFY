import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();

// --- CORS CONFIG ---
app.use(cors({
  origin: "https://shopify-pi-five.vercel.app",  // your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// --- BODY PARSER ---
app.use(express.json());

// --- REQUEST LOGGER ---
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

// --- ROUTES ---
app.use("/api/auth", authRoutes);

// --- HEALTH CHECK ---
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

export default app;
