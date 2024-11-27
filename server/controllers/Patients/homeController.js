const { findUserID, Token } = require("../../models/auth/Token");
const { findUserById } = require("../../models/auth/User");
const { Patient } = require("../../models/healthcare/Patient");
const { PatientAllergy } = require("../../models/healthcare/PatientAllergy");
const { PatientBloodSugar } = require("../../models/healthcare/PatientBloodSugar");
const { PatientBMI } = require("../../models/healthcare/PatientBMI");
const { PatientHeartRate } = require("../../models/healthcare/PatientHeartRate");
const { PatientCondition } = require("../../models/healthcare/PatientCondition");
const { Offer } = require("../../models/ecommerce/Offer");

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

exports.authHome = async (req, res) => {
    try {
        const token = req.cookies['token'];

        const user = await this.findUserByToken(token);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const patientData = await Patient.findOne({
            where: { user_id: user.id }
        });

        if (!patientData) {
            return res.status(404).json({ message: 'Patient data not found' });
        } 
        const allergies = await PatientAllergy.findAll({
            where: { patient_id: patientData.id, status:'active' }
        });

         // Get the latest 5 blood sugar records for the patient
         const bloodSugar = await PatientBloodSugar.findAll({
            where: { patient_id: patientData.id, status: 'active' },
            order: [['measurement_time', 'DESC']],
            limit: 5
        });

        // Get the latest 5 BMI records for the patient
        const bmi = await PatientBMI.findAll({
            where: { patient_id: patientData.id, status:'active' },
            order: [['measurement_date', 'DESC']],
            limit: 5
        });

        // Get the latest 5 heart rate records for the patient
        const heartRate = await PatientHeartRate.findAll({
            where: { patient_id: patientData.id, status: 'active' },
            order: [['measurement_time', 'DESC']],
            limit: 5
        });

        const offers = await Offer.findAll({limit:2});

        const conditions = await PatientCondition.findAll({
            where: { patient_id: patientData.id , status: 'active'}
        });      
        return res.status(200).json({
            message: 'User authenticated successfully',
            data: {
                name: user.username,
                email: user.email,
                id: patientData.id,
                first_name: patientData.first_name,
                last_name: patientData.last_name,
                date_of_birth: patientData.date_of_birth,
                gender: patientData.gender,
                phone_number: patientData.phone_number,
                address: patientData.address,
                profile_picture: patientData.profilePictureLocation,
                allergies: allergies,
                blood_sugar_levels: bloodSugar,
                bmi: bmi,
                heart_rate: heartRate,
                conditions: conditions,
                offer: offers, 
            }
        });
        
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};
