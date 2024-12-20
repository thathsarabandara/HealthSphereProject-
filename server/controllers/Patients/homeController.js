const { Patient } = require("../../models/healthcare/Patient");
const { PatientAllergy } = require("../../models/healthcare/PatientAllergy");
const { PatientBloodSugar } = require("../../models/healthcare/PatientBloodSugar");
const { PatientBMI } = require("../../models/healthcare/PatientBMI");
const { PatientHeartRate } = require("../../models/healthcare/PatientHeartRate");
const { PatientCondition } = require("../../models/healthcare/PatientCondition");
const { Offer } = require("../../models/ecommerce/Offer");
const { User } = require("../../models/auth/User");
const { Reservation } = require("../../models/healthcare/Reservation");
const { Schedule } = require("../../models/healthcare/Schedule");
const { Doctor } = require("../../models/healthcare/Doctor");

exports.authHome = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.userID
            }
        });
        const patientData = await Patient.findOne({
            where: { user_id: req.userID }
        });

        if (!patientData) {
            return res.status(404).json({ message: 'Patient data not found' });
        }

        const allergies = await PatientAllergy.findAll({
            where: { patient_id: patientData.id, status: 'active' }
        });

        // Get the latest 5 blood sugar records for the patient
        const bloodSugar = await PatientBloodSugar.findAll({
            where: { patient_id: patientData.id, status: 'active' },
            order: [['measurement_time', 'DESC']],
            limit: 5
        });

        // Get the latest 5 BMI records for the patient
        const bmi = await PatientBMI.findAll({
            where: { patient_id: patientData.id, status: 'active' },
            order: [['measurement_date', 'DESC']],
            limit: 5
        });

        // Get the latest 5 heart rate records for the patient
        const heartRate = await PatientHeartRate.findAll({
            where: { patient_id: patientData.id, status: 'active' },
            order: [['measurement_time', 'DESC']],
            limit: 5
        });

        const offers = await Offer.findAll({ limit: 2 });

        // Use req.userID to fetch reservation instead of req.patientID
        const reservation = await Reservation.findOne({
            where: { patient_id: patientData.id, status: 'available' },
            limit: 1
        });

        let schedule;
        let doctor;
        if (reservation) {
            schedule = await Schedule.findOne({
                where: {
                    id: reservation.schedule_id,
                }
            });

            if (schedule) {
                doctor = await Doctor.findOne({
                    where: {
                        id: schedule.doctor_id
                    }
                });
            }
        }

        const conditions = await PatientCondition.findAll({
            where: { patient_id: patientData.id, status: 'active' }
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
                upcommingSchedule: schedule ? {
                    date: schedule.schedule_date,
                    time: schedule.schedule_time,
                    doctorname: doctor ? doctor.first_name + ' ' + doctor.last_name : 'Not assigned'
                } : null,
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).json({ message: error.message });
    }
};

