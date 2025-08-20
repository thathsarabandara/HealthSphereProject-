const { findUserById, updateVerify} = require('../../models/auth/User'); 
const tokenutils = require('../../utils/tokenUtils');
const { sendOTP, verify } = require('../../services/otpService');
const { createPatient } = require('../../models/healthcare/Patient');
const { sendWelcomeMessage } = require('../../services/emailServices');
const { createTempToken, findTempToken, Token } = require('../../models/auth/Token');
const { createUserPassword, UserPassword } = require('../../models/auth/UserPassword');
const { UserGroup } = require('../../models/auth/UserGroup');
const { User } = require('../../models/auth/User');
const { Doctor } = require('../../models/healthcare/Doctor');
const { sendApplicationSubmissionEmail } = require('../../services/doctorEmailServices');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    let newUser;
    try {
        // 1. Create a new user (unverified)
        newUser = await User.create({ username, email, isVerified:'false' });
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
            group_id: 2
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

        const activePassword = await UserPassword.findAll({
            where: {
                user_id: UnverifiedUser.id,
                isActive: true,
            },
        });
        const tempToken = await tokenutils.generateToken(UnverifiedUser.email, activePassword.passwordHash);

        await createTempToken(UnverifiedUser.id, tempToken);

        const user = await updateVerify(UnverifiedUser.id)

        return res.status(200)
        .cookie('fullregister', tempToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 3600 * 2, // 20 minutes
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        })
        .json({ message: 'OTP verified successfully, registration complete!' , data : {id: UnverifiedUser.id}});
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

exports.saveProfileDetails = async (req, res) => {
    try {
        const token = req.cookies['fullregister'];
        // Validate token existence
        if (!token) {
            return res.status(400).json({ error: 'Token is missing. Please log in again.' });
        }

        // Verify token
        const isValidToken = await Token.findOne({
            where: {
                token: token,
                type: 'verify',
            },
        });

        if (!isValidToken) {
            return res.status(400).json({ error: 'Invalid token. Please log in again.' });
        }

        const userid = isValidToken.user_id;
        const user = await findUserById(userid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const id = req.params.id;

        if (id!= isValidToken.user_id){
            return res.status(400).json({error: 'Id is invalid'})
        }

        // Destructure the request body
        const {
            first_name,
            last_name,
            date_of_birth,
            gender,
            phone_number,
            address,
            medical_license_number,
            specialization,
            profile_description,
            years_of_experience,
            hospital_clinic_affiliation,
            medical_school_university,
        } = req.body;

        // Get file uploads (if any) from the request object
        const national_id_passport = req.uploadedFiles?.national_id;
        const medical_license_document = req.uploadedFiles?.medical_license;
        const profile_picture = req.uploadedFiles?.profile_picture;

        // Validate required fields
        if (
            !first_name ||
            !last_name ||
            !date_of_birth ||
            !gender ||
            !phone_number ||
            !address ||
            !medical_license_number ||
            !specialization ||
            !years_of_experience ||
            !hospital_clinic_affiliation ||
            !medical_school_university
        ) {
            console.log('here1');
            return res.status(400).json({ error: 'All required fields must be filled' });
        }

        // Validate file uploads
        if (!national_id_passport) {
            return res.status(400).json({ error: 'National ID or Passport document is required' });
        }
        if (!medical_license_document) {
            return res.status(400).json({ error: 'Medical license document is required' });
        }
        if (!profile_picture) {
            return res.status(400).json({ error: 'Profile picture is required' });
        }

        // Save doctor details to the database
        const newDoctor = await Doctor.create({
            user_id:id,
            first_name,
            last_name,
            date_of_birth,
            gender,
            phone_number,
            address,
            medical_license_number,
            bio:profile_description,
            specialization_id:specialization,
            years_of_experience,
            hospital_clinic_affiliation:hospital_clinic_affiliation,
            medical_school_university:medical_school_university,
            national_id_passport: national_id_passport, 
            medical_license_document: medical_license_document, 
            profile_picture: profile_picture, 
            status:'pending',
        });

        // Send application submission email
        await sendApplicationSubmissionEmail(user.email);

        // Return success response
        return res.status(201).json({
            message: 'Profile details saved successfully',
            doctor: newDoctor,
        });
    } catch (err) {
        console.error('Error saving profile details:', err.message || err);
        return res.status(500).json({ error: 'An error occurred while saving profile details' });
    }
};
