const { findUserID, Token } = require("../../models/auth/Token");
const { findUserById } = require("../../models/auth/User");
const { Patient } = require("../../models/healthcare/Patient");

exports.findUserByToken = async (token) => {
    try {
        if (!token) {
            throw { status: 401, message: 'User token not found' };
        }

        const isValidToken = await findUserID(token);

        if (!isValidToken) {
            throw { status: 401, message: 'Token expired or not a valid token' };
        }

        const user = await findUserById(isValidToken.user_id);

        if (!user) {
            throw { status: 401, message: 'User not found' };
        }

        if (!user.isVerified) {
            throw { status: 401, message: 'User is not verified!' };
        }

        // Return user information if authentication and verification are successful
        return user;

    } catch (error) {
        // Pass error to the calling function
        throw error.status ? error : { status: 500, message: 'An internal error occurred' };
    }
};

exports.profileLoad = async (req, res) => {
    try {
        const token = req.cookies['token'];

        const user = await this.findUserByToken(token);

        const patientData = await Patient.findOne({where:
            {user_id: user.id}
        })
        if(!patientData){
            return res.status(404).json({message: 'Patient Datat not found'})
        }
        // Return user information if authentication and verification are successful
        return res.status(200).json({
            message: 'User authenticated successfully',
            data: {
                name: user.username,
                id: patientData.id,
                email: user.email,
                first_name: patientData.first_name,
                last_name : patientData.last_name,
                date_of_birth : patientData.date_of_birth,
                gender : patientData.gender,
                phone_number : patientData.phone_number,
                address : patientData.address,
                profilePicture: patientData.profilePictureLocation,
                registrationDate: patientData.created_at,
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'An internal error occurred' });
    }
};

exports.saveProfile = async (req, res) => {
    const { id, first_name, last_name, date_of_birth, gender, phone_number, address } = req.body;
    const profilePictureLocation = req.profile_picture;

    try {
        // Set the fields to be updated, with or without profile picture
        const updateFields = {
            first_name,
            last_name,
            date_of_birth,
            gender,
            phone_number,
            address,
        };

        // Add the profile picture field if available
        if (profilePictureLocation) {
            updateFields.profilePictureLocation = profilePictureLocation;
        }

        // Update the patient's profile
        const [updatedRows] = await Patient.update(updateFields, {
            where: { id },
        });

        // Check if any rows were updated
        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Patient not found or no changes made' });
        }

        return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'An internal error occurred' });
    }
};