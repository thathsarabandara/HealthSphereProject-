const express = require('express');
const app = express();
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const adminRoutes = require('./routes/admins');
const auth = require('./routes/auth');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sync = require('./config/sync');
const {ipapiCorsOptions ,corsOptions} = require('./middleware/cors/corsMiddleware');
const auditLogMiddleware = require('./middleware/logging/auditLogMiddleware');
const path = require('path');
const { rateLimiterMiddleware } = require('./middleware/rateLimit/rateLimiter');
const passport = require('passport')
require('./config/passport')
const { errorLogger, requestLogger } = require('./middleware/logging/logger');
const { adminAuthMiddleware } = require("./middleware/auth/authorizeAdmin");
const report = require('./routes/report');

// portNumber for the server
const PORT = process.env.PORT || 5000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware Setup
app.use(passport.initialize());
app.use(helmet()); // Security middleware
app.use(cookieParser()); // Cookie parser middleware
// app.use(auditLogMiddleware);
// app.use(rateLimiterMiddleware);
app.use(cors(corsOptions,ipapiCorsOptions)); // Use CORS middleware

// Request logging
app.use(requestLogger);

// Body Parser Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', patientRoutes);
app.use('/doctor', doctorRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', auth)
app.use('/report', report);

// Error logging (must be after all other middleware and routes)
app.use(errorLogger);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
