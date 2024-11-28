const { Token } = require("../../models/auth/Token");
const { Patient } = require("../../models/healthcare/Patient");
const { Prescription } = require("../../models/healthcare/Prescription");
const { Reservation } = require("../../models/healthcare/Reservation");
const { Schedule } = require("../../models/healthcare/Schedule");
const { Doctor } = require("../../models/healthcare/Doctor");

exports.loadPrescriptionDetails = async (req, res) => {
    try {
        const token = req.cookies['token'];

        // Validate Token
        const isValidToken = await Token.findOne({ where: { token } });
        if (!isValidToken) {
            return res.status(401).json({ message: 'Unauthorized access' }); // Added `return` to prevent further execution.
        }

        // Fetch Patient Details
        const patient = await Patient.findOne({
            where: { user_id: isValidToken.user_id } // Corrected property name from `userId` to `user_id`.
        });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Fetch Prescriptions
        const prescriptions = await Prescription.findAll({
            where: { patient_id: patient.id }, // Corrected property from `ID` to `id`.
            attributes: ['id', 'reservation_id', 'details', 'special_comments', 'prescription_photo', 'created_at']
        });

        if (!prescriptions.length) {
            return res.status(404).json({ message: 'No prescriptions found for this patient' });
        }

        // Fetch Associated Data
        const results = [];
        for (const prescription of prescriptions) {
            const reservation = await Reservation.findOne({
                where: { id: prescription.reservation_id }, // Corrected property from `reservationId` to `reservation_id`.
                attributes: ['id', 'schedule_id']
            });

            if (reservation) {
                const schedule = await Schedule.findOne({
                    where: { id: reservation.schedule_id }, // Corrected property from `scheduleId` to `schedule_id`.
                    attributes: ['id', 'doctor_id', 'schedule_date', 'schedule_time']
                });

                if (schedule) {
                    const doctor = await Doctor.findOne({
                        where: { id: schedule.doctor_id }, // Corrected property from `doctorId` to `doctor_id`.
                        attributes: ['id', 'first_name', 'last_name']
                    });

                    results.push({
                        patient_id: patient.id,
                        reservation_id: reservation.id,
                        date: schedule.schedule_date,
                        time: schedule.schedule_time,
                        doctor_id: doctor?.id || null, // Handle potential null `doctor`.
                        doctor_name: doctor ? `${doctor.first_name} ${doctor.last_name}` : 'Unknown',
                        prescription_id: prescription.id,
                        details: prescription.details
                    });
                }
            }
        }

        // Respond with Data
        return res.status(200).json(results); // Corrected typo from `result` to `results`.

    } catch (error) {
        console.error('Error loading prescription details:', error);
        res.status(500).json({ message: 'Server error', error: error.message }); // Corrected `error.msg` to `error.message`.
    }
};
