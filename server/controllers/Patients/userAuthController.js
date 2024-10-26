const User = require('../../models/auth/User');
const { createUser, findByEmail, findUserById, findbyUsername} = require('../../models/auth/User'); 
const { comparePassword } = require('../../utils/hashpassword');
const { createToken } = require('../../models/auth/Token');
const tokenutils = require('../../utils/tokenUtils');
const { sendOTP, verify } = require('../../services/otpService');
const { createPatient } = require('../../models/healthcare/Patient');
const { sendWelcomeMessage, sendUnusualLogin, sendPasswordResetEmails } = require('../../services/emailServices');
const { createTempToken, findTempToken ,updateExpiredat} = require('../../models/auth/Token');
const { createUserPassword, findPassword, passwordDeactivate } = require('../../models/auth/UserPassword');
const {createPasswordResetRequest} = require('../../models/security/PasswordResetRequest');
const { getLocationFromIP } = require('../../services/locationHelper');

exports.register = async (req, res) => {
    const {username, email, password} = req.body;

    // Check if all fields are provided
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    try {
        // 3. Create a new user (unverified)
        const newUser = await createUser(username, email);
        console.log('2')
        const newpassword = await createUserPassword(newUser.id, password);
        await sendOTP(email);
        // 4. Generate a temporary token for OTP verification
        const tempToken = await tokenutils.generateToken(email,newpassword.passwordHash);

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
        const UnverifiedUser = await findUserById(userid);

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
    const userid = await findTempToken(token);
    console.log(userid);
    if (userid === null) {
        return res.status(400).json({ error: 'Invalid or expired token. Please register again.' });
    }

    const UnverifiedUser = await findUserById(userid);

    if(UnverifiedUser.isVerified === true ){
        return res.status(400).json({message : 'user is already verified'})
    }
    try{
        await sendOTP(UnverifiedUser.email);
        return res.status(200).json({message: 'Otp Send Successfully!'})
    }catch (err) {
        console.error('rror during otp resending:', err);
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
        const hashedPassword = await findPassword(user.id);

        if (!user || !user.isVerified) {
            return res.status(404).json({ error: 'User not found or not verified' });
        }

        // 2. Verify password
        const isValidPassword = await comparePassword(credentials.password, hashedPassword.password_hash);
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

exports.resetPasswordRequest = async (req, res) => {
    const email = req.body.email;

    // Check if email is provided
    if (!email) {
        return res.status(400).json({ message: 'No email provided.' });
    }

    try {
        // Find user by email
        const user = await findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(400).json({ message: 'User is not verified.' });
        }

        // Generate a token for password reset
        const token = await tokenutils.generateToken();
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        
        // Initialize location as 'Unknown location' by default
        let location = 'Unknown location';

        // Attempt to get location if IP is not localhost
        if (ipAddress !== '::1' && ipAddress !== '127.0.0.1') {
            try {
                // Uncomment below line when getLocationFromIP is defined
                // const locationData = await getLocationFromIP(ipAddress);
                if (locationData) {
                    location = `${locationData.city}, ${locationData.region}, ${locationData.country}`;
                }
            } catch (locationError) {
                console.error('Error retrieving location data:', locationError);
            }
        }

        // Create password reset request
        await createPasswordResetRequest(user.id, token, ipAddress, userAgent, location);

        // Send password reset email
        await sendPasswordResetEmails(user.id, email, token);

        // Set cookie with token for reset confirmation
        res.cookie('resettoken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure only in production
            maxAge: 1000 * 60 * 10,  // Expiration: 10 minutes
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        });

        // Respond with success message
        res.status(200).json({ message: 'Password reset link has been sent to your email.' });

    } catch (error) {
        // Handle any unexpected errors
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.validateToken = async (req,res) =>{
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: 'Token not provided.' });
    }
    try {
        // Verify the token signature and expiration
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the token in the database (based on token value or user ID)
        const resetRequest = await findPasswordResetRequestByToken(token);

        if (!resetRequest) {
            return res.status(404).json({ message: 'Invalid or expired token.' });
        }

        // Optional: Check expiration date (if stored in the reset request)
        const isExpired = new Date() > new Date(resetRequest.expiresAt);
        if (isExpired) {
            return res.status(400).json({ message: 'Token has expired.' });
        }

        // Return a success message if the token is valid
        res.status(200).json({ message: 'Token is valid.', userId: resetRequest.userId });
    } catch (error) {
        console.error('Token validation error:', error);
        res.status(400).json({ message: 'Invalid or expired token.' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        // Extract password and reset token from request
        const { password } = req.body;
        const resettoken = req.cookies['resettoken'];

        // Check if reset token exists
        if (!resettoken) {
            return res.status(400).json({ message: 'No reset token provided.' });
        }

        // Find the reset request by token
        const resetRequest = await findPasswordResetRequestByToken(resettoken);
        if (!resetRequest) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        // Deactivate the old password for the user
        const rowAffected = await passwordDeactivate(resetRequest.user_id);
        if (rowAffected === 0) {
            return res.status(500).json({ message: 'Failed to deactivate the old password.' });
        }

        // Create and hash the new password
        const newPassword = await createUserPassword(resetRequest.user_id, password);
        if (!newPassword) {
            return res.status(500).json({ message: 'Failed to create new password.' });
        }

        // Clean up: delete the reset request after successful reset
        await deletePasswordResetRequest(resettoken);

        // Clear the reset token cookie
        res.clearCookie('resettoken');

        // Send success response
        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


