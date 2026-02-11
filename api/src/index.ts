import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import quoteRoutes from "./routes/quote";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/product";
import uploadRoutes from "./routes/upload";
import adminProductRoutes from "./routes/adminProducts";
import doorTypesRoutes from "./routes/doorTypes";
import panelStylesRoutes from "./routes/panelStyles";
import dimensionsRoutes from "./routes/dimensions";
import postcodesRoutes from "./routes/postcodes";
import externalColorsRoutes from "./routes/externalColors";
import internalColorsRoutes from "./routes/internalColors";
import handleColorsRoutes from "./routes/handleColors";
import customersRoutes from "./routes/customers";

const app = express();

app.set("trust proxy", 1);

// ✅ CORS middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://quote-back-production.up.railway.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
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
app.use("/api/door-types", doorTypesRoutes);
app.use("/api/panel-styles", panelStylesRoutes);
app.use("/api/dimensions", dimensionsRoutes);
app.use("/api/postcodes", postcodesRoutes);
app.use("/api/external-colors", externalColorsRoutes);
app.use("/api/internal-colors", internalColorsRoutes);
app.use("/api/handle-colors", handleColorsRoutes);
app.use("/api/customers", customersRoutes);

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Global error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

// Keep the server running
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;
