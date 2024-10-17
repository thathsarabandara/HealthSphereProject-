const express = require('express');
const app = express();
const userRoutes = require('./routes/users');
const doctorRutes = require('./routes/doctors');
const adminRoutes = require('./routes/admins');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const sync = require('./config/sync');
const helmet = require('helmet');
const cors = require('cors');
const corsOptions = require('./middleware/cors/corsMiddleware')

// portNumber for the server
const PORT = process.env.PORT || 5000;

// Used Helmet for secure our app
app.use(helmet());
// used Cors options for 
app.use(cors(corsOptions));

//  bodyparser use
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// routes for users
app.use('/', userRoutes);
app.use('/doctor', doctorRutes);
app.use('/admin', adminRoutes);

// app.use(cors(corsOptions));
// start server
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})