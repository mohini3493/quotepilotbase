import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import quoteRoutes from "./routes/quote";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/product";
import uploadRoutes from "./routes/upload";
import adminProductRoutes from "./routes/adminProducts";

const app = express();

app.set("trust proxy", 1);

// ✅ CORS middleware
app.use(
  cors({
    origin: "https://quotepilotbase.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ THIS LINE GOES HERE (after cors, before routes)
app.options("*", cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "QuotePilot API running 🚀" });
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/quote", quoteRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/products/admin/all", adminProductRoutes);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on http://0.0.0.0:${PORT}`);
});
