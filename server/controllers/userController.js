const User = require('../models/auth/User');
const { createUser, findByEmail } = require('../models/auth/User'); // Import the createUser function
const { comparePassword } = require('../utils/hashpassword');
const { createToken } = require('../models/auth/Token');
const tokenutils = require('../utils/tokenUtils');
const { sendOTP, verify } = require('../services/otpService');
const { createPatient } = require('../models/healthcare/Patient');
const { sendWelcomeMessage, sendUnusualLogin } = require('../services/emailServices');
const { createTempToken, findTempToken } = require('../models/auth/TempToken');
const userStorage = new Map();

exports.register = async (req, res) => {
    const userdata = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    };

    if (!userdata.username || !userdata.email || !userdata.password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    try {
        // 1. Check if the email already exists
        const existingUser = await findByEmail(userdata.email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // 2. Send OTP to the user's email
        await sendOTP(userdata.email);
        console.log(`Sending OTP to ${userdata.email}`);

        // 3. Hash the user's password and create a new user temporarily
        userdata.password = await hashPassword(userdata.password);
        const newUser = await createUser(userdata); // createUser saves the user with verified=false

        // 4. Generate a temporary token for OTP verification
        const tempToken = await tokenutils.generateToken({ id: newUser.id, email: userdata.email });

        // 5. Save tempToken in TempToken table for the user
        await createTempToken(newUser.id, tempToken);

        // 6. Set cookie for token
        res.cookie('verifytoken', tempToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 600, // 10 minutes
        });

        return res.json({ message: 'Credentials saved successfully, please verify OTP!' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

exports.verifyUser = async (req, res) => {
    const otp = req.body.otp;
    const token = req.cookies.verifytoken; // Get token from cookies

    if (!otp || !token) {
        return res.status(400).json({ error: 'OTP and token are required!' });
    }

    try {
        // 1. Check if the tempToken is valid
        const tempTokenData = await findTempToken(token);

        if (!tempTokenData) {
            return res.status(400).json({ error: 'Invalid or expired token. Please register again.' });
        }

        // 2. Verify the OTP using otpService
        const isValidOTP = await verify(tempTokenData.email, otp);

        if (!isValidOTP) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // 3. Mark the user as verified
        const user = await User.findByPk(tempTokenData.user_id);
        user.verified = true;
        await user.save();

        // 4. Create a patient record for the user
        const newPatient = await createPatient(user.id);

        // 5. Send a welcome email
        await sendWelcomeMessage(user.username, newPatient.id, user.email);

        return res.status(200).json({ message: 'OTP verified successfully, registration complete!' });
    } catch (err) {
        console.error('Error during OTP verification:', err);
        return res.status(500).json({ error: 'OTP verification failed' });
    }
};

exports.login = async (req, res) => {
    const credentials = {
        email: req.body.email,
        password: req.body.password
    };

    try {
        // 1. Find user by email
        const user = await findByEmail(credentials.email);

        if (!user || !user.verified) {
            return res.status(404).json({ error: 'User not found or not verified' });
        }

        // 2. Verify password
        const isValidPassword = await comparePassword(credentials.password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 3. Generate JWT or token
        const token = await tokenutils.generateToken({ id: user.id, email: user.email });

        // 4. Save the token in the database (optional, can also be used with Redis)
        await createToken(user.id, token);

        // 5. Set token in the cookie
        res.cookie('token', token, {
            httpOnly: true, // Secure against XSS
            secure: process.env.NODE_ENV === 'production', // Only set for HTTPS in production
            maxAge: 1000 * 3600 * 2, // 2 hours expiration
        });

        // 6. Send unusual login alert if needed
        await sendUnusualLogin(user.username, user.email);

        return res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ error: 'Login failed', details: err.message });
    }
};

