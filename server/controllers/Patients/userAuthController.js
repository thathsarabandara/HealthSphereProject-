const User = require('../../models/auth/User');
const { createUser, findByEmail , findByUserId } = require('../../models/auth/User'); // Import the createUser function
const { comparePassword } = require('../../utils/hashpassword');
const { createToken } = require('../../models/auth/Token');
const tokenutils = require('../../utils/tokenUtils');
const { sendOTP, verify } = require('../../services/otpService');
const { createPatient } = require('../../models/healthcare/Patient');
const { sendWelcomeMessage, sendUnusualLogin } = require('../../services/emailServices');
const { createTempToken, findTempToken ,updateExpiredat} = require('../../models/auth/Token');
const { createUserPassword } = require('../../models/auth/UserPassword');

exports.register = async (req, res) => {
    const userdata = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    };

    // Check if all fields are provided
    if (!userdata.username || !userdata.email || !userdata.password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    try {
        // 1. Check if the username already exists
        const existingUser = await User.findbyUsername(userdata.username);
        if (existingUser !== null) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        // 1. Check if the email already exists
        const existingUsername = await findByEmail(userdata.email);
        if (existingUsername !== null) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        console.log(userdata.username);
        console.log(userdata.email);
        // 2. Send OTP to the user's email
        await sendOTP(userdata.email);

        // 3. Create a new user (unverified)
        const newUser = await createUser(userdata.username, userdata.email);
        const password = await createUserPassword(newUser.id, userdata.password);

        // 4. Generate a temporary token for OTP verification
        const tempToken = await tokenutils.generateToken(userdata);

        // 5. Save tempToken in TempToken table for the user
        await createTempToken(newUser.id, tempToken);

        // 6. Set a cookie for token
        return res.status(200)
            .cookie('verifytoken', tempToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Only use secure in production
                maxAge: 1000 * 600 * 2,  // Token expiration: 10 minutes
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Set to 'Lax' for development
            })
            .json({ message: 'User registered successfully. Please verify OTP.' });
        
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

exports.verifyUser = async (req, res) => {
    const otp = req.body.otp;
    const token = req.cookies['verifytoken']; // Get token from cookies

    if (!otp) {
        return res.status(400).json({ message: 'OTP is required!' });
    }

    if (!token) {
        return res.status(400).json({ error: 'user verification problem' });
    }
        
    try {
        // 1. Check if the tempToken is valid
        const userid = await findTempToken(token);
        
        if (userid === null) {
            return res.status(400).json({ error: 'Invalid or expired token. Please register again.' });
        }
        const UnverifiedUser = await findByUserId(userid);

        if(UnverifiedUser.isVerified === true ){
            return res.status(400).json({message : 'user is already verified'})
        }

        // 2. Verify the OTP using otpService
        const isValidOTP = await verify(UnverifiedUser.email, otp);

        if (!isValidOTP) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        
        // 3. Mark the user as verified
        const user = await User.updateVerify(UnverifiedUser.id)
        
        // 4. Create a patient record for the user
        const newPatient = await createPatient(UnverifiedUser.id);

        // 5. Send a welcome email
        await sendWelcomeMessage(UnverifiedUser.username, newPatient.id, UnverifiedUser.email);

        return res.status(200).json({ message: 'OTP verified successfully, registration complete!' });
    } catch (err) {
        console.error('Error during OTP verification:', err);
        return res.status(500).json({ error: 'OTP verification failed' });
    }
};

exports.resendOTP = async (req,res) => {
    const token = req.cookies['verifytoken'];

    if (!token) {
        return res.status(400).json({ error: 'user verification problem' });
    }

    const UnverifiedUser = await findByUserId(userid);

    if(UnverifiedUser.isVerified === true ){
        return res.status(400).json({message : 'user is already verified'})
    }
    try{
        await sendOTP(userdata.email);
        return res.status(200).json({message: 'Otp Send Successfully!'})
    }catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ message: 'otp resend failed', details: err.message });
    }
    
}

exports.login = async (req, res) => {
    const credentials = {
        email: req.body.email,
        password: req.body.password
    };

    try {
        // 1. Find user by email
        const user = await findByEmail(credentials.email);

        if (!user || !user.isVerified) {
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
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only use secure in production
            maxAge: 1000 * 3600,  // Token expiration: 10 minutes
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Set to 'Lax' for development
        });

        // 6. Send unusual login alert if needed
        await sendUnusualLogin(user.username, user.email);

        return res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ error: 'Login failed', details: err.message });
    }
};

exports.logout = async (req, res) => {
    const token = req.cookies['token'];

    if (!token) {
        return res.status(400).json({ message: 'No token found.' });
    }

    try {
        // Optional: Update the token's status in the database if applicable
        await updateExpiredat(new Date(), token); // Set expiration date to now or mark it as invalid
        
        // Clear the token cookie from the response
        res.clearCookie('token'); // Ensure this matches your cookie settings

        return res.status(200).json({ message: 'Logged out successfully.' });
    } catch (err) {
        console.error('Error during logout:', err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
