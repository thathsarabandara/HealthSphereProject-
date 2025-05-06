const { User } = require("../../models/auth/User");
const { UserPassword } = require("../../models/auth/UserPassword");
const { comparePassword } = require("../../utils/hashpassword");
const { UserGroup } = require("../../models/auth/UserGroup");
const { generateToken } = require("../../utils/tokenUtils");
const { createToken } = require("../../models/auth/Token");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "Incorrect Credentials" });
        }

        // Fetch user's hashed password
        const userPassword = await UserPassword.findOne({ where: { user_id: user.id } });

        if (!userPassword) {
            return res.status(401).json({ message: "Incorrect Credentials" });
        }

        const isValidPassword = await comparePassword(password, userPassword.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ message: "Incorrect Credentials" });
        }

        // Fetch user's group
        const userGroup = await UserGroup.findOne({ where: { user_id: user.id } });

        if (userGroup && userGroup.group_id === 3) {
            return res.status(401).json({ message: "Access Denied" });
        }

        // Generate authentication token
        const token = await generateToken({ id: user.id, email: user.email });

        // Store token in the database
        await createToken(user.id, token);

        // Set cookie with the token
        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 3600 * 20, // 20 hours
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        });

        return res.status(200).json({ message: "Login Successful" });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Login Failed" });
    }
};

exports.logout = async (req, res) => {
    const token = req.cookies['adminToken'];

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
        res.clearCookie('adminToken', {
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
