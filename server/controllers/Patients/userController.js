const { findUserID } = require("../../models/auth/Token");
const { findUserById } = require("../../models/auth/User");

exports.authHome = async (req, res) => {
    try {
        const token = req.cookies['token'];

        if (!token) {
            return res.status(400).json({ message: 'User token not found' });
        }

        const isValidToken = await findUserID(token);

        if (!isValidToken) {
            return res.status(400).json({ message: 'Token expired or not a valid token' });
        }

        const user = await findUserById(isValidToken.user_id);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'User is not verified!' });
        }

        // Return user information if authentication and verification are successful
        return res.status(200).json({
            message: 'User authenticated successfully',
            data: {
                name: user.username,
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'An internal error occurred' });
    }
};

