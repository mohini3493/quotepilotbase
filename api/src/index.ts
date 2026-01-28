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
app.use(
  cors({
    origin: "https://quotepilot-lz06.onrender.com",
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

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on http://0.0.0.0:${PORT}`);
});
