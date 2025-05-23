import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import db from "./config/database.js";
import "./models/usermodel.js";
import "./models/sparepartmodel.js";
import "./models/modelpembelian.js";
import router from "./routes/route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Serve folder uploads statis
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// Routing
app.use(router);

// Koneksi & Sinkronisasi database
(async () => {
  try {
    await db.authenticate();
    console.log("Database connected");

    await db.sync({ alter: true }); // Penting untuk sinkronisasi model
    console.log("All models synchronized");
  } catch (error) {
    console.error("Database connection or sync failed:", error);
  }
})();

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
