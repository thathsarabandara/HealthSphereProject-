const { findUserById, updateVerify} = require('../../models/auth/User'); 
const tokenutils = require('../../utils/tokenUtils');
const { sendOTP, verify } = require('../../services/otpService');
const { createPatient } = require('../../models/healthcare/Patient');
const { sendWelcomeMessage } = require('../../services/emailServices');
const { createTempToken, findTempToken } = require('../../models/auth/Token');
const { createUserPassword, UserPassword } = require('../../models/auth/UserPassword');
const { UserGroup } = require('../../models/auth/UserGroup');
const { User } = require('../../models/auth/User');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    let newUser;
    try {
        // 1. Create a new user (unverified)
        newUser = await User.create({ username, email });
        if (!newUser || !newUser.id) {
            return res.status(500).json({ error: 'User creation failed or returned invalid data.' });
        }

        // 2. Create user password
        const newPassword = await createUserPassword(newUser.id, password);
        if (!newPassword) {
            return res.status(500).json({ error: 'Password creation failed.' });
        }

        // 3. Assign the user to a group
        await UserGroup.create({
            user_id: newUser.id,
            group_id: 1
        });

        // 4. Send OTP for email verification
        await sendOTP(email);

        // 5. Generate a temporary token for OTP verification
        const tempToken = await tokenutils.generateToken(email, newPassword.passwordHash);

        // 6. Save tempToken in TempToken table for the user
        await createTempToken(newUser.id, tempToken);

        // 7. Set a cookie for token
        return res.status(200)
            .cookie('verifytoken', tempToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                maxAge: 1000 * 600 * 2, 
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
            })
            .json({ message: 'User registered successfully. Please verify OTP.' });

    } catch (error) {
        console.error('Error during registration:', error);
        if (newUser && newUser.id) {
            // Cleanup if newUser exists
            await UserPassword.destroy({ where: { user_id: newUser.id } });
            await User.destroy({ where: { id: newUser.id } });
        }
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
        const user = await updateVerify(UnverifiedUser.id)
        
        // 4. Create a patient record for the user
        const newPatient = await createPatient(UnverifiedUser.id);

        await UserGroup.create({
            user_id:UnverifiedUser.id,
            group_id: 1,
        })

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