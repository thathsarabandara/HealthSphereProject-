require("dotenv").config();
const express = require("express");
const app = express();
const patientRoutes = require("./routes/patients");
const doctorRoutes = require("./routes/doctors");
const adminRoutes = require("./routes/admins");
//const auth = require('./routes/auth');
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sync = require("./config/sync");
const { ipapiCorsOptions } = require("./middleware/cors/corsMiddleware");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
const auditLogMiddleware = require("./middleware/logging/auditLogMiddleware");
const path = require("path");
const { rateLimiterMiddleware } = require("./middleware/rateLimit/rateLimiter");
const passport = require("passport");
require("./config/passport");
const { errorLogger, requestLogger } = require("./middleware/logging/logger");

// portNumber for the server
const PORT = process.env.PORT || 5000;

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware Setup
app.use(passport.initialize());
app.use(helmet()); // Security middleware
app.use(cookieParser()); // Cookie parser middleware
<<<<<<< HEAD
// app.use(auditLogMiddleware);
// app.use(rateLimiterMiddleware);
app.use(cors(corsOptions,ipapiCorsOptions)); // Use CORS middleware
=======
app.use(auditLogMiddleware);
app.use(rateLimiterMiddleware);
app.use(cors(corsOptions, ipapiCorsOptions)); // Use CORS middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
>>>>>>> 69903fb9e1f5a21d064161b05438b40cd78cef23

// Request logging
app.use(requestLogger);

// Body Parser Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", patientRoutes);
app.use("/doctor", doctorRoutes);
app.use("/admin", adminRoutes);
//app.use('/auth', auth)

// Error logging (must be after all other middleware and routes)
app.use(errorLogger);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
