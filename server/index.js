const express = require('express');
const app = express();
const userRoutes = require('./routes/users');
const doctorRoutes = require('./routes/doctors');
const adminRoutes = require('./routes/admins');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sync = require('./config/sync');
const {ipapiCorsOptions ,corsOptions} = require('./middleware/cors/corsMiddleware');

// portNumber for the server
const PORT = process.env.PORT || 5000;

// Middleware Setup
app.use(helmet()); // Security middleware
app.use(cookieParser()); // Cookie parser middleware

app.use(cors(corsOptions,ipapiCorsOptions)); // Use CORS middleware

// Body Parser Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', userRoutes);
app.use('/doctor', doctorRoutes);
app.use('/admin', adminRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
