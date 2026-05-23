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
import glazingOptionsRoutes from "./routes/glazingOptions";
import { pool } from "./db";

async function runMigrations() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS glazing_options (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      image TEXT,
      "order" INT DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT now()
    )
  `);
  await pool.query(`
    ALTER TABLE customers ADD COLUMN IF NOT EXISTS glazing_option TEXT
  `);
  await pool.query(`
    ALTER TABLE handle_colors ADD COLUMN IF NOT EXISTS product_id INT REFERENCES products(id) ON DELETE SET NULL
  `);
  console.log("Migrations complete");
}

const app = express();

app.set("trust proxy", 1);

// ✅ CORS middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://quote-front-production.up.railway.app",
  "https://infinityglazing.com",
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
  res.json({ message: "Infinity Glazing API running 🚀" });
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
app.use("/api/glazing-options", glazingOptionsRoutes);

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

runMigrations().catch(console.error);

const server = app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

// Keep the server running
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;
