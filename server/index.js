const express = require("express");
const app = express();
const patientRoutes = require("./routes/patients");
const doctorRoutes = require("./routes/doctors");
const adminRoutes = require("./routes/admins");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sync = require("./config/sync");
const {
  ipapiCorsOptions,
  corsOptions,
} = require("./middleware/cors/corsMiddleware");
const auditLogMiddleware = require("./middleware/logging/auditLogMiddleware");
const path = require("path");
const { rateLimiterMiddleware } = require("./middleware/rateLimit/rateLimiter");

// portNumber for the server
const PORT = process.env.PORT || 5000;

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware Setup
app.use(helmet()); // Security middleware
app.use(cookieParser()); // Cookie parser middleware
app.use(auditLogMiddleware);
app.use(rateLimiterMiddleware);
app.use(cors(corsOptions, ipapiCorsOptions)); // Use CORS middleware

// Body Parser Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", patientRoutes);
app.use("/doctor", doctorRoutes);
app.use("/admin", adminRoutes);
// Test route - should work even without other routes
app.get("/test", (req, res) => {
  res.send("Server is working!");
});
console.log("Server is working!");

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
