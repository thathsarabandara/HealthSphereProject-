const { findToken } = require("../../models/auth/Token");
const { findByUserId } = require("../../models/auth/User");

exports.authHome = async (req, res) => {
    const token = req.cookies['token'];

    console.log(token);

    if (!token) {
        return res.status(400).json({ message: 'User token not found' });
    }

    const isValidToken = await findToken(token);

    if (!isValidToken) {
        return res.status(400).json({ message: 'Token expired or not a valid token' });
    }

    const user = await findByUserId(isValidToken.user_id);

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    } else if (!user.isVerified) {
        return res.status(400).json({ message: 'User is not verified!' });
    }

    // Assuming you want to return user info if token and user are valid
    return res.status(200).json({
        message: 'User authenticated successfully',
        data: {
            id: user.id,
            name: user.username,
            email: user.email,
            profilePicture: user.profilePicture, // If you store this
        }
    });
};
