import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import caseStudyRoutes from "./routes/caseStudyRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // permissive for local development
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome endpoint
app.get("/", (req, res) => {
  res.json({
    message: "GETprospeKt API is running live 🚀",
    status: "healthy",
    endpoints: {
      health: "/api/health",
      articles: "/api/articles",
      caseStudies: "/api/case-studies",
      resources: "/api/resources",
      newsletters: "/api/newsletters",
      enquiries: "/api/enquiries",
    },
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "GETprospeKt API",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/case-studies", caseStudyRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/newsletters", newsletterRoutes);
app.use("/api/enquiries", enquiryRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("[Server Error]:", err.stack);
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[GETprospeKt API] Server running on http://localhost:${PORT}`);
});
