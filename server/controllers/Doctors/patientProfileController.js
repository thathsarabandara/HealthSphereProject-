const { Patient } = require("../../models/healthcare/Patient");
const { PatientAllergy } = require("../../models/healthcare/PatientAllergy");
const { PatientBloodSugar } = require("../../models/healthcare/PatientBloodSugar");
const { PatientBMI } = require("../../models/healthcare/PatientBMI");
const { PatientCondition } = require("../../models/healthcare/PatientCondition");
const { PatientHeartRate } = require("../../models/healthcare/PatientHeartRate");

exports.loadPatientProfile = async(req,res)=>{
    try{
        const {id} = req.params;

        const patientData = await Patient.findOne({
            where: { id:id }
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
            limit: 1
        });

        // Get the latest 5 BMI records for the patient
        const bmi = await PatientBMI.findAll({
            where: { patient_id: patientData.id, status:'active' },
            order: [['measurement_date', 'DESC']],
            limit: 1
        });

        // Get the latest 5 heart rate records for the patient
        const heartRate = await PatientHeartRate.findAll({
            where: { patient_id: patientData.id, status: 'active' },
            order: [['measurement_time', 'DESC']],
            limit: 1
        });

        const conditions = await PatientCondition.findAll({
            where: { patient_id: patientData.id , status: 'active'}
        });      
        return res.status(200).json({
            message: 'User authenticated successfully',
            data: {
                patientId: patientData.id,
                patientFirstName: patientData.first_name,
                patientLastName: patientData.last_name,
                patientDateOfBirth: patientData.date_of_birth,
                patientGender: patientData.gender,
                patientPhoneNumber: patientData.phone_number,
                patientAddress: patientData.address,
                profilePicture: patientData.profilePictureLocation,
                allergies: allergies,
                blood_sugar_levels: bloodSugar,
                bmi: bmi,
                heart_rate: heartRate,
                conditions: conditions, 
            }
        });
        
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
}