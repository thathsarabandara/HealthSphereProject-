const { User } = require("../../models/auth/User");
const { Patient } = require("../../models/healthcare/Patient");

exports.profileLoad = async (req, res) => {
    try {
        const user = await User.findOne({where:{
            id: req.userID
        }})
        const patientData = await Patient.findOne({where:
            {user_id: req.userID}
        })
        if(!patientData){
            return res.status(404).json({message: 'Patient Datat not found'})
        }
        // Return user information if authentication and verification are successful
        return res.status(200).json({
            message: 'User authenticated successfully',
            data: {
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
    const {id} = req.params;
    const { first_name, last_name, date_of_birth, gender, phone_number, address } = req.body;
    
    try {
        // Initialize updateFields object
        const updateFields = {};
        
        // Only include fields that are provided and not empty
        if (first_name && first_name.trim()) updateFields.first_name = first_name.trim();
        if (last_name && last_name.trim()) updateFields.last_name = last_name.trim();
        if (date_of_birth) updateFields.date_of_birth = date_of_birth;
        if (gender) updateFields.gender = gender;
        if (phone_number && phone_number.trim()) updateFields.phone_number = phone_number.trim();
        if (address && address.trim()) updateFields.address = address.trim();
        
        // Check if at least one field is being updated
        if (Object.keys(updateFields).length === 0 && !req.file) {
            return res.status(400).json({ message: 'No valid fields provided for update' });
        }

        // Only update profile picture if a new one was uploaded
        if (req.file) {
            updateFields.profilePictureLocation = req.file.filename;
        }

        // Update the patient's profile
        const [updatedRows] = await Patient.update(updateFields, {
            where: { id },
        });

        // Check if any rows were updated
        if (updatedRows === 0) {
            console.log("here")          
            return res.status(404).json({ message: 'Patient not found or no changes made' });
        }

        return res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'An internal error occurred' });
    }
};