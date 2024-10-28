const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.generateToken = (email, password) =>{
    return jwt.sign({ email: email , password:password}, process.env.JWT_SECRET);
}


