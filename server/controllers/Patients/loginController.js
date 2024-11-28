const { findByEmail, findUserById,} = require('../../models/auth/User'); 
const { comparePassword } = require('../../utils/hashpassword');
const { createToken, updateExpiredat, Token } = require('../../models/auth/Token');
const tokenutils = require('../../utils/tokenUtils');
const { sendUnusualLogin, sendPasswordResetEmails, sendPasswordChange } = require('../../services/emailServices');
const { createUserPassword, findPassword, passwordDeactivate } = require('../../models/auth/UserPassword');
const {createPasswordResetRequest, findPasswordResetToken} = require('../../models/security/PasswordResetRequest');


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
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 1000 * 3600 *20, 
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
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
        // Invalidate the token in the database by setting its expiration to the current date
        await Token.update(
            { expires_at: new Date() }, // Use `new Date()` to ensure proper format
            { where: { token } }
        );

        // Clear the token cookie from the client's browser
        res.clearCookie('token', {
            httpOnly: true, // Ensure secure cookie handling
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Prevent CSRF
        });

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
        // Find the token in the database (based on token value or user ID)
        const resetRequest = await findPasswordResetToken(token);

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
        const resetRequest = await findPasswordResetToken(resettoken);
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
        const user = await findUserById(resetRequest.user_id);
        if (!user) {
            return res.status(500).json({ message: 'User no found' });
        }
        await sendPasswordChange(user.username, user.email);
        // Clear the reset token cookie
        res.clearCookie('resettoken');

        // Send success response
        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


