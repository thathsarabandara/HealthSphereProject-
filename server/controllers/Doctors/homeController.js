const { findUserID, Token } = require("../../models/auth/Token");
const { findUserById } = require("../../models/auth/User");

const { Offer } = require("../../models/ecommerce/Offer");
const { Doctor } = require("../../models/healthcare/Doctor");
const { Specialization } = require("../../models/healthcare/Specialization");

exports.findUserByToken = async (token) => {
    try {
        if (!token) {
            throw { status: 401, message: 'User token not found' };
        }

        const isValidToken = await Token.findOne({
            where: {
              token,
            //   expires_at: {
            //     [Op.gt]: Date.now(), // Check if the token expiration time is greater than the current time
            //   },
            },
          });

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

exports.authHome = async (req, res) => {
    try {
        const token = req.cookies['doctoken'];

        const user = await this.findUserByToken(token);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const doctordata = await Doctor.findOne({
            where: { user_id: user.id , status: 'approved'}
        });

        if (!doctordata) {
            return res.status(404).json({ message: 'Patient data not found' });
        } 
        
        const specialization = await Specialization.findOne({where:{
            id:doctordata.specialization_id
        }
        });
        return res.status(200).json({
            message: 'User authenticated successfully',
            data: {
                userid: user.id,
                name: user.username,
                email: user.email,
                id: doctordata.id,
                first_name: doctordata.first_name,
                last_name: doctordata.last_name,
                date_of_birth: doctordata.date_of_birth,
                gender: doctordata.gender,
                phone_number: doctordata.phone_number,
                address: doctordata.address,
                medical_license_number:doctordata.medical_license_number,
                specialization: specialization.name,
                experience: doctordata.years_of_experience,
                hospital: doctordata.hospital_clinic_affiliation,
                medicalSchool: doctordata.medical_school_university,
                profileImg:doctordata.profile_picture,
            }
        });
        
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};
