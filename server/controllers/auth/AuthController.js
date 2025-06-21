const passport = require("passport");
const { generateGoogleToken } = require("../../utils/tokenUtils");
const { createToken } = require('../../models/auth/Token');

exports.googleCallback = async (req, res) => {
     try {
        const token = await generateGoogleToken(req.user.email);
        await createToken(req.user.id, token);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 1000 * 3600 *20, 
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
        });
        return res.status(200)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
}