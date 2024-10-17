const User = require('../models/auth/User');
const { createUser, findByEmail } = require('../models/auth/User'); // Import the createUser function
const { comparePassword } = require('../utils/hashpassword');
const { createToken } = require('../models/auth/Token');
const tokenutils = require('../utils/tokenUtils');
const { sendOTP, verify } = require('../services/otpService');
const { createPatient } = require('../models/healthcare/Patient');
const { sendWelcomeMessage, sendUnusualLogin } = require('../services/emailServices');
const userStorage = new Map();

exports.register = async (req, res) => {
    const userdata = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    };

    // Ensure all required fields are provided
    if (!userdata.username || !userdata.email || !userdata.password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    try {
        // Send OTP to the user's email
        await sendOTP(userdata.email);
        console.log(`Sending OTP to ${userdata.email}`);

        // Store user data in memory temporarily
        userStorage.set(userdata.email, userdata);

        // Redirect to the OTP verification page
        return res.json({ message: 'Registration successful!' });
    } catch (error) {
        console.error('Error during registration process:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

exports.verifyUser = async (req, res) => {
    const otp = req.body.otp; // Ensure you're accessing the correct property for OTP
    const email = req.body.email
    if (!otp) {
        return res.status(400).json({ error: 'OTP section must not be empty!' });
    }

    try {
        const user = userStorage.get(email); // Retrieve the temporary user data
        if (!user) {
            return res.status(404).json({ error: 'User data not found' });
        }
        const isValid = await verify(user.email, otp);
        if (isValid) {

            const newUser = await createUser(user); // Ensure createUser is awaited
            const newPatient = await createPatient(newUser.id); // Ensure createPatient is awaited
            await sendWelcomeMessage(newUser.username, newPatient.id, newUser.email); // Ensure this is awaited
            console.log('yes')
            return res.status(200).json({message :'OTP verified successfully'});
        } else {
            return res.status(400).json({message :'Invalid or expired OTP'});
        }
    } catch (err) {
        console.error('Error during OTP verification:', err);
        return res.status(500).json({ message: 'Verify process failed'});
    }
};

exports.login = async (req, res) => {
    const credentials = req.body;

    try {
        // Step 1: Find user by email
        const user = await findByEmail(credentials.email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Step 2: Verify password
        const isValidPassword = await comparePassword(credentials.password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        // Step 3: Generate token
        const token = await tokenutils.generateToken({ id: user.id, email: user.email });

        // Step 4: Create token in the database
        await createToken(user.id, token);

        // Step 5: Set token in cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevent access from client-side scripts
            secure: process.env.NODE_ENV === 'production', // Secure true only in production (HTTPS)
            maxAge: 1000 * 3600 * 2, // 2 hours
        });
        await sendUnusualLogin(user.username, user.email);
        // Step 6: Respond to client with success message
        return res.status(200).json({ message: 'Login Successful', token });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ error: 'Login failed', details: err.message });
    }
};
