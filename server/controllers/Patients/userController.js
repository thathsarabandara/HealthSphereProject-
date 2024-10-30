const { now } = require("sequelize/lib/utils");
const { findUserID } = require("../../models/auth/Token");
const { findUserById } = require("../../models/auth/User");
const { Doctor } = require("../../models/healthcare/Doctor");
const { Schedule } = require("../../models/healthcare/Schedule");
const { Specialization } = require("../../models/healthcare/Specialization");
const { Op } = require('sequelize'); // Ensure to import Op for query operators
const moment = require('moment'); // Import moment for date manipulation

exports.authHome = async (req, res) => {
    try {
        const token = req.cookies['token'];

        if (!token) {
            return res.status(400).json({ message: 'User token not found' });
        }

        const isValidToken = await findUserID(token);

        if (!isValidToken) {
            return res.status(400).json({ message: 'Token expired or not a valid token' });
        }

        const user = await findUserById(isValidToken.user_id);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'User is not verified!' });
        }

        // Return user information if authentication and verification are successful
        return res.status(200).json({
            message: 'User authenticated successfully',
            data: {
                name: user.username,
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'An internal error occurred' });
    }
};

exports.loadDoctors = async (req, res) => {
    try {
        // Step 1: Get the specialization from URL parameters
        const categoryName = req.params.specialization;
        console.log(categoryName);
        
        // Step 2: Find the specialization in the database
        const specialization = await Specialization.findOne({ where: { name: categoryName } });
        
        if (!specialization) {
            return res.status(404).json({ message: 'Specialization not found' });
        }

        // Step 3: Find all doctors with the found specialization
        const doctors = await Doctor.findAll({ 
            where: { 
                specialization_id: specialization.id // Use the specialization ID
            }
        });

        if (!doctors.length) {
            return res.status(404).json({ message: 'No doctors found for this specialization' });
        }

        // Step 4: Get today's date for filtering schedules
        const today = moment().toDate();

        // Step 5: Find all approved schedules for the doctors found
        const schedules = await Schedule.findAll({ 
            where: { 
                doctor_id: doctors.map(doctor => doctor.id), // Filter schedules by doctor IDs
                date: { [Op.gte]: today }, // Get schedules for today and future dates
                status: 'approved' // Only approved schedules
            } 
        });

        // Step 6: Construct the response data according to the frontend expectations
        const response = doctors.map(doctor => {
            const doctorSchedules = schedules.filter(schedule => schedule.doctor_id === doctor.id); // Get schedules for each doctor

            return doctorSchedules.map(schedule => ({
                doctor_id: doctor.id,
                doctorname: doctor.name,
                date: schedule.date,
                time: schedule.time,
                profileLink: doctor.profileLink, // Assuming profileLink exists on doctor model
                consultationFee: schedule.fee + 500 // Adding hospital charges
            }));
        }).flat(); // Flatten the array to get a single array of doctor-schedule objects

        // Step 7: Remove doctors without schedules
        const filteredResponse = response.filter(doc => doc.date && doc.time); // Ensure there are schedules present

        // Step 8: Send the response
        res.status(200).json(filteredResponse);
    } catch (error) {
        console.error("Error loading doctors:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
